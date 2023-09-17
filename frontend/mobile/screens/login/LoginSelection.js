import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import * as Google from 'expo-auth-session/providers/google';

const { width, height } = Dimensions.get('window');

const LoginSelection = () => {
  const navigation = useNavigation();
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '975614309732-7efv821237vv7prh9oq73vek4bv2h4il.apps.googleusercontent.com',
    redirectUri: 'https://10c7-132-147-113-199.ngrok.io',
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      
      // Send the id_token to your backend for verification
      fetch('http://10.0.0.17:3000/auth/google-signin', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      })
      .then(res => res.json())
      .then(data => {
        // Handle the user data response
        navigation.navigate('Home Page');
      })
      .catch(error => {
        console.error(error);
      });
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to PropertyGo!</Text>
      <Image source={require('../../assets/PropertyGo-HighRes-Logo.png')} style={styles.icon} />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Sign In with Email</Text>
      </TouchableOpacity>
      {/* Add the following button */}
      <TouchableOpacity style={styles.socialButton} onPress={() => promptAsync()}>
        <Text style={styles.socialButtonText}>Sign In with Google</Text>
      </TouchableOpacity>
      {/* Add your other social sign-in methods here */}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    welcomeText: {
        fontWeight: 'bold',
        fontSize: RFValue(24, 680),
        color: 'black',
        marginBottom: 60,
    },
    icon: {
        width: width * 0.5,
        height: height * 0.2,
        resizeMode: 'contain',
        marginBottom: 80,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 25,
        backgroundColor: '#1E90FF',
        width: width * 0.8,
        marginVertical: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: RFValue(16, 680),
    },
    socialButton: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 25,
        backgroundColor: '#4267B2',
        width: width * 0.8,
        marginVertical: 10,
    },
    socialButtonText: {
        color: '#fff',
        fontSize: RFValue(16, 680),
    },
});


export default LoginSelection;
