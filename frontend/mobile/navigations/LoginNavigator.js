import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GetStarted from '../screens/login/GetStarted';
import LoginPortal from '../screens/login/LoginPortal';
import HomeScreen from '../screens/login/HomeScreen';
import LoginScreen from '../screens/login/LoginScreen.js';
import SideNavigator from './SideNavigator'
import UserBottomNavigator from './UserBottomNavigator';

const Stack = createNativeStackNavigator();

const LoginNavigator = () => {
    return (
        <Stack.Navigator>
            {/* <Stack.Screen name="Home Page" component={HomePage} /> */}
            <Stack.Screen name="Get Started" component={GetStarted} />
            <Stack.Screen name="Login Portal" component={LoginPortal} />
            <Stack.Screen name="Home Screen" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            {/* <Stack.Screen name="Home Page" component={HomePage} /> */}
            <Stack.Screen
                name="Side Navigator"
                component={SideNavigator}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default LoginNavigator;