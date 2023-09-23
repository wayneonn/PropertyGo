import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GetStarted from '../screens/login/GetStarted';
import LoginPortal from '../screens/login/LoginPortal';
import HomeScreen from '../screens/login/HomeScreen';
import LoginScreen from '../screens/login/LoginScreen.js';
import SignUpScreen from '../screens/login/SignUpScreen';
import SignUpSelection from '../screens/login/SignUpSelection';
import LoginSelection from '../screens/login/LoginSelection';
import GoogleSignUp from '../screens/login/GoogleSignUp';
import SideNavigator from './SideNavigator'
import ForumSideNavigator from './ForumSideNavigator';
import PropertyListingsStackGroup from './PropertyListingsStackGroup';

const Stack = createNativeStackNavigator();

const LoginNavigator = () => {
    return (
        <Stack.Navigator>
            {/* <Stack.Screen name="Home Page" component={HomePage} /> */}
            {/* <Stack.Screen name="Google Sign Up" component={GoogleSignUp} /> */}
            <Stack.Screen name="Get Started" component={GetStarted} />
            <Stack.Screen name="Login Portal" component={LoginPortal} />
            <Stack.Screen name="Sign Up Screen" component={SignUpScreen} />
            <Stack.Screen name="Home Screen" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Sign Up Options" component={SignUpSelection} />
            <Stack.Screen name="Login Options" component={LoginSelection} />
            {/* <Stack.Screen name="Home Page" component={HomePage} /> */}
            <Stack.Screen
                name="Side Navigator"
                component={SideNavigator}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Forum Side Navigator"
                component={ForumSideNavigator}
                // options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Property Listings Stack Group"
                component={PropertyListingsStackGroup}
                options={{ headerShown: false }}
            />

        </Stack.Navigator>
    );
};

export default LoginNavigator;