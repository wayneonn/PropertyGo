import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { AuthContext } from '../../../../AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getUserById, getRatingByUser } from '../../../../utils/api';
import StarRating from 'react-native-star-rating';
import { Ionicons } from '@expo/vector-icons';

function CustomerCard({ sellerId, transaction }) {
  const userId = sellerId;
  const { user } = useContext(AuthContext);
  const isSeller = user.user.userId === transaction.userId;
  const [userDetails, setUser] = useState(null);
  const [rating, setRating] = useState(null);

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

  useEffect(() => {
    // Fetch user details based on the provided userId
    fetchUser(userId).then((userData) => {
      setUser(userData);
    });
  }, [userId]);

  let profileImageBase64;
  if (userDetails && userDetails.profileImage && userDetails.profileImage.data) {
    profileImageBase64 = base64.encodeFromByteArray(userDetails.profileImage.data);
  }

  if (!userDetails) {
    return (
      <View style={styles.container}>
        {/* ... (Same as before) */}
      </View>
    );
  }

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardContent}>
        <Image
          source={
            profileImageBase64
              ? { uri: `data:image/jpeg;base64,${profileImageBase64}` }
              : require('../../../../assets/Default-Profile-Picture-Icon.png')
          }
          style={styles.profileImage}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userDetails.name}</Text>
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() => {
              // Handle chat button press
            }}
          >
            <Text style={styles.chatButtonText}>Chat</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  cardContainer: {
    backgroundColor: 'white', // Set the background color to white
    borderRadius: 10,
    margin: 16,
    padding: 16,
    elevation: 5, // Add elevation for shadow on Android
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  userInfo: {
    marginLeft: 16,
    marginTop: 8, // Add margin to move the name closer to the top
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  chatButton: {
    backgroundColor: 'dodgerblue',
    padding: 5,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    marginTop: 16, // Add margin to move the chat button closer to the bottom
  },
  chatButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});



export default CustomerCard;
