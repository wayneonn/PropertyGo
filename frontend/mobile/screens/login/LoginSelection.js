import React, {useEffect, useState} from 'react';
import {Dimensions, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {RFValue} from 'react-native-responsive-fontsize';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width, height} = Dimensions.get('window');

WebBrowser.maybeCompleteAuthSession();

export default function LoginSelection() {
    const navigation = useNavigation();
    const [accessToken, setAccessToken] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: '975614309732-0ngvqr4vvcebrjdlpeldknq9mpr3a5mq.apps.googleusercontent.com',
        iosClientId: '975614309732-aef963hu3lkfus4u3jqnnkmm263vb7v7.apps.googleusercontent.com',
        expoClientId: '975614309732-7efv821237vv7prh9oq73vek4bv2h4il.apps.googleusercontent.com',
    });

    useEffect(() => {
        handleLoginWithGoogle();
    }, [response]);

    async function handleLoginWithGoogle() {
        if (response?.type === 'success') {
            const {accessToken} = response.authentication;

            // Store the access token in AsyncStorage or send it to your server for authentication.
            await AsyncStorage.setItem('accessToken', accessToken);

            // Fetch user info
            fetchUserInfo(accessToken);
        }
    }

    async function fetchUserInfo(token) {
        try {
            const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
                headers: {Authorization: `Bearer ${token}`},
            });
            const userInfo = await response.json();

            // Store user info in state and AsyncStorage
            setUserInfo(userInfo);
            await AsyncStorage.setItem('@user', JSON.stringify(userInfo));
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Welcome to PropertyGo!</Text>
            <Image source={require('../../assets/PropertyGo-HighRes-Logo.png')} style={styles.icon}/>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.buttonText}>Sign In with Email</Text>
            </TouchableOpacity>
            <View style={styles.googleButtonWrapper}>
                <TouchableOpacity
                    disabled={!request}
                    onPress={() => {
                        promptAsync();
                    }}
                    style={styles.googleButton}
                >
                    <Image source={require("../../assets/Login-Icons/Sign-In-Google-Icon.png")}
                           style={styles.googleButtonImage}/>
                </TouchableOpacity>
            </View>
        </View>
    );
}

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
    googleButtonWrapper: {
        borderWidth: 0.15, // Add border styling here
        borderRadius: 25,
        overflow: 'hidden', // Hide overflow of the border
        width: width * 0.8,
        height: height * 0.06,
        marginVertical: 10,
    },
    googleButton: {
        width: '100%',
        height: '100%',
        justifyContent: 'center', // Center vertically
        alignItems: 'center', // Center horizontally
    },
    googleButtonImage: {
        width: 250,
        height: 40,
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
