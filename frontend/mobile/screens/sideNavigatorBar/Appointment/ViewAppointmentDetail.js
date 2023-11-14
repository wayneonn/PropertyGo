import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { AuthContext } from '../../../AuthContext';
import base64 from 'react-native-base64';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icon library
import { getUserById, getRatingByUser, getPropertyListing } from '../../../utils/api';
import {
  sellerApprovesViewing, sellerRejectsViewing,
  sellerCancelsViewing, buyerCancelsViewing,
  getScheduleById
} from '../../../utils/scheduleApi';
import StarRating from 'react-native-star-rating';
import { Ionicons } from '@expo/vector-icons';
import PropertyCard from '../../propertyListings/PropertyCardRectangle';
import { set } from 'date-fns';
import { useFocusEffect } from '@react-navigation/native';
import { format } from 'date-fns';
import { createChat } from '../../../utils/chatApi';
import PropertyCardRectangle from './PropertyCardRectangleAppointment';

function ViewUserProfile({ route, navigation }) { // Add navigation parameter
  const { userId, propertyId, scheduleId } = route.params;
  // const { user, logout } = useContext(AuthContext);
  // console.log('loggedInUser:', user);
  const [userDetails, setUser] = useState(null);
  const [rating, setRating] = useState(null);
  const [propertyListing, setPropertyListing] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [scheduleStatus, setScheduleStatus] = useState('');
  const { user } = useContext(AuthContext);
  // const isSeller = userDetails && userDetails.userId === user.user.userId;
  const [isSeller, setIsSeller] = useState(false);


  const fetchPropertyListing = async (id) => {
    try {
      // Make an API call to fetch property listing details by id
      const response = await fetch(getPropertyListing(id));
      const data = await response.json();
      setPropertyListing(data); // Update state with the fetched data
      console.log('Property Listing Data:', data)
      console.log('schedule:', schedule)
    } catch (error) {
      console.error('Error fetching property listing:', error);
    }
  };

  const fetchSchedule = async (scheduleId) => {
    try {
      console.log("userId: ", userId)
      const { success, data, message } = await getScheduleById(scheduleId);

      if (success) {
        // Handle the user data here
        setScheduleStatus(data.ScheduleStatus);
        setIsSeller(data.sellerId === user.user.userId);
        if (data.sellerId === user.user.userId) {
          fetchUser(data.userId);
        } else {
          fetchUser(data.sellerId);
        }
        return data;
      } else {
        // Handle the error here
        console.error('Error fetching schedule:', message);
      }
    } catch (error) {
      console.error('Error fetching schedule:', error);
    }
  };

  const fetchUser = async (userId) => {
    try {
      console.log("userId: ", userId)
      const { success, data, message } = await getUserById(userId);

      if (success) {
        // Handle the user data here
        setUser(data);
        // fetchRating(userId);
      } else {
        // Handle the error here
        console.error('Error fetching user:', message);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  // const fetchRating = async (userId) => {
  //   try {
  //     const { success, data, message } = await getRatingByUser(userId);

  //     if (success) {
  //       // Handle the user data here
  //       setRating(data);
  //     } else {
  //       // Handle the error here
  //       console.error('Error fetching user:', message);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching user:', error);
  //   }
  // };


  useEffect(() => {
    // Fetch user details based on the provided userId
    fetchSchedule(scheduleId).then((scheduleData) => {
      setSchedule(scheduleData);
    });
    fetchPropertyListing(propertyId);
  }, [userId, scheduleStatus]);

  useFocusEffect(
    React.useCallback(() => {
      fetchSchedule(scheduleId).then((scheduleData) => {
        setSchedule(scheduleData);
      });
      fetchPropertyListing(propertyId);
    }, [])
  );


  const getStatusColor = (status) => {
    switch (status) {
      case 'AWAIT_SELLER_CONFIRMATION':
        return 'yellow';
      case 'SELLER_CONFIRMED':
        return 'green';
      case 'SELLER_REJECT':
      case 'BUYER_CANCELLED':
      case 'SELLER_CANCELLED':
        return 'red';
      default:
        return 'blue'; // Default color
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'AWAIT_SELLER_CONFIRMATION':
        return 'black';
      default:
        return 'white'; // Default color
    }
  };

  const getStatusText = (status) => {
    if (isSeller) {
      switch (status) {
        case 'AWAIT_SELLER_CONFIRMATION':
          return 'Awaiting Your Response';
        case 'SELLER_CONFIRMED':
          return 'You Have Confirmed The Appointment';
        case 'SELLER_REJECT':
          return 'You Have Rejected The Appointment';
        case 'BUYER_CANCELLED':
          return 'The Buyer Have Cancelled The Appointment';
        case 'SELLER_CANCELLED':
          return 'You Have Cancelled The Appointment';
        default:
          return status; // Default status text
      }
    } else {
      switch (status) {
        case 'AWAIT_SELLER_CONFIRMATION':
          return 'Awaiting Seller Response';
        case 'SELLER_CONFIRMED':
          return 'The Seller Have Confirmed The Appointment';
        case 'SELLER_REJECT':
          return 'The Seller Has Rejected The Appointment';
        case 'BUYER_CANCELLED':
          return 'You Have Cancelled The Appointment';
        case 'SELLER_CANCELLED':
          return 'The Seller Cancelled The Appointment';
        default:
          return status; // Default status text
      }
    }
  };

  const handlePropertyPress = (propertyListingId) => {
    // Navigate to the Property Listing screen with the given propertyListingId
    navigation.navigate('Property Listing', { propertyListingId });
  };


  let profileImageBase64;
  if (userDetails && userDetails.profileImage && userDetails.profileImage.data) {
    profileImageBase64 = base64.encodeFromByteArray(userDetails.profileImage.data);
  }

  if (!userDetails) {
    return (
      <View style={styles.container}>
        <Text>Please log in to view your profile.</Text>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleConfirmRequest = async () => {
    Alert.alert(
      'Confirm Request',
      `Do you want to confirm the request for viewing?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {
            approveRequest();
            setScheduleStatus("SELLER_CONFIRMED");
          }
        },
      ]
    );
  }

  const approveRequest = async () => {
    try {
      console.log("schedule.scheduleId: ", schedule.scheduleId)
      const { success, data, message } = await sellerApprovesViewing(schedule.scheduleId);

      if (success) {
        Alert.alert('Approval Successful', `You have approved the viewing.`);
      } else {
        Alert.alert('Error', message || 'Approval failed.');
      }
    } catch (error) {
      console.error('Error approving:', error);
      Alert.alert('Error', 'Approval failed.');
    }
  }

  const handleSellerCancelRequest = async () => {
    Alert.alert(
      'Cancel Viewing',
      `Do you want to cancel the request for viewing?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {
            sellerCancelRequest();
            // setScheduleStatus("SELLER_CANCELLED");
          }
        },
      ]
    );
  }

  const sellerCancelRequest = async () => {
    try {
      // Call the API function for cancelling the viewing with the correct scheduleId
      const { success, data, message } = await sellerCancelsViewing(schedule.scheduleId);

      if (success) {
        // Update the state or perform any other necessary actions
        setScheduleStatus("SELLER_CANCELLED");
        Alert.alert('Cancel Successful', `You have cancelled the viewing.`);
      } else {
        Alert.alert('Error', message || 'Cancel failed.');
      }
    } catch (error) {
      console.error('Error cancellation:', error);
      Alert.alert('Error', 'Cancel failed.');
    }
  }

  const handleSellerRejectRequest = async () => {
    Alert.alert(
      'Cancel Viewing',
      `Do you want to reject the request for viewing?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {
            sellerRejectRequest();
          }
        },
      ]
    );
  }

  const sellerRejectRequest = async () => {
    try {
      // Call the API function for cancelling the viewing with the correct scheduleId
      const { success, data, message } = await sellerRejectsViewing(schedule.scheduleId);

      if (success) {
        // Update the state or perform any other necessary actions
        setScheduleStatus("SELLER_REJECT");
        Alert.alert('Rejection Successful', `You have rejected the viewing.`);
      } else {
        Alert.alert('Error', message || 'Reject failed.');
      }
    } catch (error) {
      console.error('Error Rejection:', error);
      Alert.alert('Error', 'Rejection failed.');
    }
  }

  const handleBuyerCancelRequest = async () => {
    Alert.alert(
      'Cancel Viewing',
      `Do you want to cancel the viewing session?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {
            buyerCancelRequest();
          }
        },
      ]
    );
  }

  const buyerCancelRequest = async () => {
    try {
      // Call the API function for cancelling the viewing with the correct scheduleId
      const { success, data, message } = await buyerCancelsViewing(schedule.scheduleId);

      if (success) {
        // Update the state or perform any other necessary actions
        setScheduleStatus("BUYER_CANCELLED");
        Alert.alert('Cancel Successful', `You have cancelled your appointment.`);
      } else {
        Alert.alert('Error', message || 'Cancel failed.');
      }
    } catch (error) {
      console.error('Error Cancellation:', error);
      Alert.alert('Error', 'Cancellation failed.');
    }
  }

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd MMMM yyyy'); // e.g., 23 October 2023
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return format(date, 'h:mm a'); // e.g., 2:00 PM
  };

  const handleChatWithSeller = async () => {
    chatData = {
      propertyId: propertyListing.propertyListingId,
      receiverId: propertyListing.sellerId
    }
    let userId;
    if (isSeller) {
      userId = sellerId;
    } else {
      userId = user.user.userId;
    }
    const data = await createChat(userId, chatData);
    // console.log(data.chatId)
    navigation.navigate("Message", { chatId: data.chatId });
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.viewContainer}>

        <View style={styles.headerContainer}>
          {/* Back button */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.header}> Appointment Details</Text>
        </View>

        {/* Property Listing Section */}

        <View style={styles.section}>

          {/* Check if ScheduleStatus is not null */}
          {scheduleStatus !== null ? (
            <>
              {isSeller ? (
                <Text style={styles.topHeader}>Buyer Details To View Your Property</Text>
              ) : (
                <Text style={styles.topHeader}>Seller Details To View At Your Next Property</Text>
              )}
              <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(scheduleStatus) }]}>
                <Text style={[styles.statusText, { color: getStatusTextColor(scheduleStatus) }]}>{getStatusText(scheduleStatus)}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 16 }}>
                <Ionicons name="calendar-outline" size={24} color="black" style={{ marginRight: 4 }} />
                <Text style={styles.scheduleDate}>{formatDate(schedule.meetupDate)}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 16 }}>
                <Ionicons name="time-outline" size={24} color="black" style={{ marginRight: 4 }} />
                <Text style={styles.scheduleTime}>{formatTime(schedule.meetupTime)}</Text>
              </View>
              <View style={styles.bottomButtonsContainer}>
                {isSeller ? (
                  //Seller Side
                  scheduleStatus === "AWAIT_SELLER_CONFIRMATION" ? (
                    <>
                      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmRequest}>
                        <Text style={styles.buttonText}>Confirm Request</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.rejectButton} onPress={handleSellerRejectRequest}>
                        <Text style={styles.buttonText}>Reject Request</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    scheduleStatus === "SELLER_CANCELLED" ? (
                      // <TouchableOpacity style={styles.confirmButton} onPress={handleSellerCancelRequest}>
                      //   <Text style={styles.buttonText}>Cancel Viewing</Text>
                      // </TouchableOpacity>
                      <Text style={styles.scheduleTime}></Text>
                    ) : (
                      scheduleStatus === "BUYER_CANCELLED" ? (
                        <Text style={styles.scheduleTime}></Text>
                      ) : (
                        <TouchableOpacity style={styles.rejectButton} onPress={handleSellerCancelRequest}>
                          <Text style={styles.buttonText}>Cancel Viewing</Text>
                        </TouchableOpacity>
                      )
                    )
                  )
                ) : (
                  //Buyer Side
                  scheduleStatus === "AWAIT_SELLER_CONFIRMATION" ? (
                    <Text style={styles.scheduleTime}></Text>
                  ) : (
                    scheduleStatus === "SELLER_CANCELLED" ? (
                      <Text style={styles.scheduleTime}></Text>
                    ) : (
                      scheduleStatus === "BUYER_CANCELLED" ? (
                        <Text style={styles.scheduleTime}></Text>
                      ) : (
                        <TouchableOpacity style={styles.rejectButton} onPress={handleBuyerCancelRequest}>
                          <Text style={styles.buttonText}>Cancel Viewing</Text>
                        </TouchableOpacity>
                      )
                    )
                  )
                )}
              </View>
            </>
          ) : (
            // Render a loading indicator if ScheduleStatus is null
            <ActivityIndicator size="large" color="dodgerblue" />
          )}
        </View>

        {/* <View style={styles.section}>
          <Text style={styles.sectionHeader}>Property Listing</Text>
          {propertyListing && (
            <PropertyCard
              key={propertyListing.propertyListingId}
              property={propertyListing}
              onPress={() => handlePropertyPress(propertyListing.propertyListingId)}
            />
          )}
        </View> */}

        <PropertyCardRectangle
          property={propertyListing}
          seller={userDetails}
          onPress={() => {
            navigation.navigate('Property Listing', { propertyListingId: propertyListing.propertyListingId })
          }}
        />

        {/* User Profile Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { marginBottom: 30 }]}>User Profile</Text>
          <View style={styles.profileHeader}>
            {profileImageBase64 ? (
              <Image
                source={{ uri: `data:image/jpeg;base64,${profileImageBase64}` }}
                style={styles.profileImage}
              />
            ) : (
              <Image
                source={require('../../../assets/Default-Profile-Picture-Icon.png')} // Provide a default image source
                style={styles.defaultProfileImage}
              />
            )}
            <Text style={[styles.label, { marginTop: 15 }]}>Profile Picture</Text>
          </View>

          <View style={styles.profileInfo}>
            {userDetails !== null ? (
              <>
                <InfoRow label="Name:" value={userDetails.name} />
                <InfoRow label="Country:" value={userDetails.countryOfOrigin} />
                <InfoRow label="Email:" value={userDetails.email} />
                {/* <InfoRow label="Rating:" value={rating.userRating !== null ? rating.userRating.toFixed(1) : '0.0 [New User]'} />

                <View style={styles.ratingContainer}>
                  <StarRating
                    disabled={true}
                    maxStars={5}
                    rating={rating.userRating !== null ? rating.userRating : 0}
                    fullStarColor="gold"
                    emptyStarColor="gold"
                    starSize={24}
                  />
                </View> */}
                <View style={{ alignItems: "center", marginBottom: 10 }}>

                  <TouchableOpacity
                    style={styles.editProfileButton}
                    onPress={handleChatWithSeller}
                  >
                    <Icon
                      name="edit"
                      size={20}
                      color="white"
                      style={styles.editIcon}
                    />
                    <Text style={styles.editProfileButtonText}>Chat With User</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <ActivityIndicator size="large" color="dodgerblue" />
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const InfoRow = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  viewContainer: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  userIcon: {
    marginBottom: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 120,
  },
  defaultProfileImage: {
    width: 150,
    height: 150,
    borderRadius: 120,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultProfileText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
  },
  profileInfo: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Align items to the left
    marginBottom: 8,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  value: {
    fontSize: 18,
    marginBottom: 16,
  },
  editProfileButton: {
    backgroundColor: 'dodgerblue',
    padding: 10,
    borderRadius: 20,
    marginTop: 20,
    alignItems: 'center', // Center horizontally
    flexDirection: 'row',
    justifyContent: 'center', // Center vertically
    width: '60%',
    marginLeft: 0,
  },
  editIcon: {
    marginRight: 10,
  },
  editProfileButtonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  loginLink: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginTop: 8,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    marginTop: -50,
    marginBottom: 20,
  },
  backButton: {
    // marginRight: 20,
    marginLeft: -30,
    marginTop: 10,
    marginBottom: 60,
  },
  scrollContentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1, // To make sure content can scroll
  },
  section: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    borderColor: '#e1e1e1',
    borderWidth: 1,
    elevation: 5, // Add elevation for shadow on Android
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 1,
  },
  topHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 60,
    marginTop: 10,
    textAlign: 'center',
    letterSpacing: 1,
    paddingHorizontal: 40,
  },
  scheduleDate: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
    padding: 10,

  },
  scheduleTime: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
    padding: 10,
  },
  confirmButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#4CAF50', // Yellow color
    alignItems: 'center',
    borderWidth: 1,        // Add border
    borderColor: '#000',   // Border color
    borderRadius: 10,      // Make it rounded
    margin: 2,  // Margin for spacing between buttons
  },
  rejectButton: {
    flex: 1,
    padding: 12,
    backgroundColor: 'red', // Yellow color
    alignItems: 'center',
    borderWidth: 1,        // Add border
    borderColor: '#000',   // Border color
    borderRadius: 10,      // Make it rounded
    margin: 2,  // Margin for spacing between buttons
  },
  statusIndicator: {
    // position: 'absolute',
    // left: 35,
    // top: 85,
    // position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -40,
    marginBottom: 10,
    borderWidth: 0.18,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 5,
    backgroundColor: 'yellow', // Default color
  },
  statusText: {
    fontSize: 12,
    letterSpacing: 1,
    fontWeight: 'bold',
    // color: '#000',
    padding: 2,
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    borderTopColor: '#eee',
    justifyContent: 'space-between', // Added for spacing between buttons
    paddingHorizontal: 10, // Padding to give space from the screen edge
    paddingTop: 20,
    paddingBottom: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',           // Black text color for all buttons
  },
});

export default ViewUserProfile;
