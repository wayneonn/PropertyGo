import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';

const { width, height } = Dimensions.get('window');

const SignUpSelection = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Welcome to PropertyGo!</Text>
            <Image source={require('../../assets/PropertyGo-HighRes-Logo.png')} style={styles.icon} />
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Sign Up Screen')}>
                <Text style={styles.buttonText}>Sign Up with Email</Text>
            </TouchableOpacity>
            {/* Add the following buttons */}
            <TouchableOpacity style={styles.socialButton} onPress={() => handleSignUpWithGoogle()}>
                <Text style={styles.socialButtonText}>Sign Up with Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={() => handleSignUpWithFacebook()}>
                <Text style={styles.socialButtonText}>Sign Up with Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={() => handleSignUpWithApple()}>
                <Text style={styles.socialButtonText}>Sign Up with Apple</Text>
            </TouchableOpacity>
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
    // Style for social sign-up buttons
    socialButton: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 25,
        backgroundColor: '#4267B2', // Example: Facebook Blue
        width: width * 0.8,
        marginVertical: 10,
    },
    socialButtonText: {
        color: '#fff',
        fontSize: RFValue(16, 680),
    },
});

export default SignUpSelection;
