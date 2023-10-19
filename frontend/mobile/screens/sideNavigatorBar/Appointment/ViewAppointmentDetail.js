import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, ScrollView } from 'react-native';
import { AuthContext } from '../../../AuthContext';
import base64 from 'react-native-base64';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icon library
import { getUserById, getRatingByUser, getPropertyListing } from '../../../utils/api';
import StarRating from 'react-native-star-rating';
import { Ionicons } from '@expo/vector-icons';
import PropertyCard from '../../propertyListings/PropertyCardRectangle';

function ViewUserProfile({ route, navigation }) { // Add navigation parameter
  const { userId, propertyId, schedule } = route.params;
  // const { user, logout } = useContext(AuthContext);
  // console.log('loggedInUser:', user);
  const [userDetails, setUser] = useState(null);
  const [rating, setRating] = useState(null);
  const [propertyListing, setPropertyListing] = useState(null);

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

  const fetchUser = async (userId) => {
    try {
      console.log("userId: ", userId)
      const { success, data, message } = await getUserById(userId);

      if (success) {
        // Handle the user data here
        return data;
      } else {
        // Handle the error here
        console.error('Error fetching user:', message);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchRating = async (userId) => {
    try {
      const { success, data, message } = await getRatingByUser(userId);

      if (success) {
        // Handle the user data here
        return data;
      } else {
        // Handle the error here
        console.error('Error fetching user:', message);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };


  useEffect(() => {
    // Fetch user details based on the provided userId
    fetchUser(userId).then((userData) => {
      setUser(userData);
    });
    fetchRating(userId).then((rating) => {
      setRating(rating);
      console.log("rating: ", rating.userRating);
    });
    fetchPropertyListing(propertyId);
  }, [userId]);

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.viewContainer}>
        <View style={styles.headerContainer}>
          {/* Back button */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.header}>View Appointment Detail</Text>
        </View>

        {/* Property Listing Section */}

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Appointment</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 16 }}>
            <Ionicons name="calendar-outline" size={24} color="black" style={{ marginRight: 4 }} />
            <Text style={styles.scheduleDate}>{schedule.meetupDate}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 16 }}>
            <Ionicons name="time-outline" size={24} color="black" style={{ marginRight: 4 }} />
            <Text style={styles.scheduleTime}>{schedule.meetupTime}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Property Listing</Text>
          {propertyListing && (
            <PropertyCard
              key={propertyListing.propertyListingId}
              property={propertyListing}
              onPress={() => handlePropertyPress(propertyListing.propertyListingId)}
            />
          )}
        </View>
        {/* User Profile Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeader, {marginBottom: 30}]}>User Profile</Text>
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
            <Text style={[styles.label, {marginTop: 15}]}>Profile Picture</Text>
          </View>

          <View style={styles.profileInfo}>
            {rating !== null ? (
              <>
                <InfoRow label="Name:" value={userDetails.name} />
                <InfoRow label="Country:" value={userDetails.countryOfOrigin} />
                <InfoRow label="Rating:" value={rating.userRating !== null ? rating.userRating.toFixed(1) : '0.0 [New User]'} />

                <View style={styles.ratingContainer}>
                  <StarRating
                    disabled={true}
                    maxStars={5}
                    rating={rating.userRating !== null ? rating.userRating : 0}
                    fullStarColor="gold"
                    emptyStarColor="gold"
                    starSize={24}
                  />
                </View>
                <View style = {{alignItems: "center", marginBottom: 10}}>
                  <TouchableOpacity
                    style={styles.editProfileButton}
                    onPress={() => { }}
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
    borderRadius: 5,
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
    textAlign: 'center',
  },
  loginLink: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginTop: 8,
  },
  header: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    marginTop: -50,
    marginBottom: 20,
  },
  backButton: {
    // marginRight: 20,
    marginLeft: -20,
    marginTop: 20,
    marginBottom: 50,
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
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderColor: '#e1e1e1',
    borderWidth: 1,
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 1,
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
});

export default ViewUserProfile;
