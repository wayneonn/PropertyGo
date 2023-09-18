import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../AuthContext'; // Import the AuthContext from the correct path

function UserProfile({ navigation }) {
  const { user, logout } = useContext(AuthContext); // Use the AuthContext to access user data and logout function
  console.log('loggedInUser:', user); // Add this line

  // Check if a user is logged in
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
      <Text style={styles.heading}>User Profile</Text>
      <View style={styles.profileInfo}>
        <Text>Name: {user.user.name}</Text>
        <Text>Email: {user.user.email}</Text>
        {/* Add more user details here */}
      </View>
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
  logoutButton: {
    backgroundColor: '#1E90FF',
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
