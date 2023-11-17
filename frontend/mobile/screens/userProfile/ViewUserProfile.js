import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View, ScrollView} from 'react-native';
import base64 from 'react-native-base64';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icon library
import {getRatingByUser, getUserById} from '../../utils/api';
import StarRating from 'react-native-star-rating';
import { Ionicons } from '@expo/vector-icons';
import { createChat } from '../../utils/chatApi';

function ViewUserProfile({ route, navigation }) { // Add navigation parameter
  const { userId, property } = route.params;
  // const { user, logout } = useContext(AuthContext);
  // console.log('loggedInUser:', user);
  const [userDetails, setUser] = useState(null);
  const [rating, setRating] = useState(null);

    const fetchUser = async (userId) => {
        try {
            console.log("userId: ", userId)
            const {success, data, message} = await getUserById(userId);

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

  // const fetchRating = async (userId) => {
  //   try {
  //     const { success, data, message } = await getRatingByUser(userId);

  //     if (success) {
  //       // Handle the user data here
  //       return data;
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
        fetchUser(userId).then((userData) => {
            setUser(userData);
        });
        fetchRating(userId).then((rating) => {
            setRating(rating);
            console.log("rating: ", rating.userRating);
        });
    }, [userId]);

  useEffect(() => {
    // Fetch user details based on the provided userId
    fetchUser(userId).then((userData) => {
      setUser(userData);
    });
    // fetchRating(userId).then((rating) => {
    //   setRating(rating);
    //   console.log("rating: ", rating.userRating);
    // });
  }, [userId]);


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

  const handleChatWithSeller = async () => {
    const chatData = {
      propertyId: property.propertyListingId,
      receiverId: property.sellerId
    }

    const data = await createChat(userId, chatData);
    // console.log(data.chatId)
    navigation.navigate("Message", { chatId: data.chatId });
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {/* Back button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>User Profile</Text>
      </View>
      <View style={styles.profileHeader}>
        {profileImageBase64 ? (
          <Image
            source={{ uri: `data:image/jpeg;base64,${profileImageBase64}` }}
            style={styles.profileImage}
          />
        ) : (
          <Image
            source={require('../../assets/Default-Profile-Picture-Icon.png')} // Provide a default image source
            style={{ width: 150, height: 150, borderRadius: 120 }}
          />
        )}
        <Text style={styles.heading}>Profile Picture</Text>
      </View>
      {userDetails !== null ? (
        <View style={styles.profileInfo}>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{userDetails.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Country:</Text>
            <Text style={styles.value}>{userDetails.countryOfOrigin}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{userDetails.email}</Text>
          </View>
          {/* <View style={styles.row}>
            <Text style={styles.label}>Rating:</Text>
            <Text style={styles.value}>
              {rating.userRating !== null
                ? rating.userRating.toFixed(1)
                : '0.0 [New User]'}
            </Text>
          </View> */}
          {/* <View style={styles.ratingContainer}>
            <StarRating
              disabled={true}
              maxStars={5}
              rating={rating.userRating !== null ? rating.userRating : 0}
              fullStarColor="gold"
              emptyStarColor="gold"
              starSize={24}
            />
          </View> */}
        </View>
      ) : (
        <ActivityIndicator size="large" color="dodgerblue" />
      )}
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
  );
}

const styles = StyleSheet.create({
  container: {
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
    fontWeight  : '600',
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
    marginBottom: 50,
  },
  backButton: {
    // marginRight: 20,
    marginLeft: -80,
    marginBottom: 60,
  },
});

export default ViewUserProfile;
