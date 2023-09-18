import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { AuthContext } from '../../AuthContext'; 
import base64 from 'react-native-base64';

function UserProfile({ navigation }) {
  const { user, logout } = useContext(AuthContext); 
  console.log('loggedInUser:', user); 

  let profileImageBase64;
  if (user && user.user.profileImage && user.user.profileImage.data) {
    profileImageBase64 = base64.encodeFromByteArray(user.user.profileImage.data);
  }

  if (!user) {
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
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        {profileImageBase64 ? (
          <Image
            source={{ uri: `data:image/jpeg;base64,${profileImageBase64}` }}
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.defaultProfileImage}>
            <Text style={styles.defaultProfileText}>Add Image</Text>
          </View>
        )}
        <Text style={styles.heading}>User Profile</Text>
      </View>
      <View style={styles.profileInfo}>
        <Text>Name: {user.user.name}</Text>
        <Text>Email: {user.user.email}</Text>
        <Text>Country: {user.user.countryOfOrigin}</Text>
        <Text>Date Of Birth: {user.user.dateOfBirth}</Text>
      </View>
      <TouchableOpacity
        style={styles.editProfileButton}
        onPress={() => {
          navigation.navigate('EditProfile');
        }}
      >
        <Text style={styles.editProfileButtonText}>Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={() => logout()}>
        <Text style={styles.logoutButtonText}>Logout</Text>
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
  profileHeader: {
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  defaultProfileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  defaultProfileText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  profileInfo: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  editProfileButton: {
    backgroundColor: '#1E90FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  editProfileButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#FF4500',
    padding: 12,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  loginLink: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginTop: 8,
  },
});

export default UserProfile;
