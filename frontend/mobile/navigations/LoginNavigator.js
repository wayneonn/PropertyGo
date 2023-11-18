import React, { useEffect, useContext, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GetStarted from '../screens/login/GetStarted';
import LoginPortal from '../screens/login/LoginPortal';
import HomeScreen from '../screens/login/HomeScreen';
import LoginScreen from '../screens/login/LoginScreen.js';
import SignUpScreen from '../screens/login/SignUpScreen';
import SignUpSelection from '../screens/login/SignUpSelection';
import LoginSelection from '../screens/login/LoginSelection';
import SideNavigator from './SideNavigator'
import ForumSideNavigator from './ForumSideNavigator';
import PropertyListingsStackGroup from './PropertyListingsStackGroup';
import SignUpScreenPartnerApp from "../screens/login/SignUpScreenPartnerApp";
import { FormDataProvider } from "../contexts/PartnerApplicationFormDataContext";
import PartnerApp from "./PartnerApplicationNavigator";
import SideNavigatorPartner from "./SideNavigatorPartner";
import IntroScreen from "../screens/partnerApplication/InfoScreen";
import CompanyInfoScreen from "../screens/partnerApplication/CompanyInfo";
import UserRoleScreen from "../screens/partnerApplication/UserRole";
import creditCardInfoScreen from "../screens/partnerApplication/CreditCardInfoScreen";
import documentSubmissionScreen from "../screens/partnerApplication/DocumentSubmission";
import Response from '../screens/sideNavigatorBar/Response';
import ResponseTopNavBar from '../components/ContactUs/ResponseTopNavBar';
import Message from '../screens/chat/Message';
import MessagePartner from "../screens/chat/MessagePartner";
import MessageTopNavBar from '../components/Chat/MessageTopNavBar';

import { AuthContext } from '../AuthContext';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { io } from 'socket.io-client';
import configData from "../config.json"
import { savePushToken } from '../utils/tokenApi';

const BASE_URL = configData.BASE_URL;

const socket = io(BASE_URL);

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

// Can use this function below or use Expo's Push Notification Tool from: https://expo.dev/notifications
async function sendPushNotification(notificationData) {
    const message = {
        to: notificationData.pushToken,
        sound: 'default',
        title: notificationData.title,
        body: notificationData.body,
        data: {
            navigateTo: notificationData.chatNotificationBoolean ? "Chat" : "Activity", // Add the navigation destination here
            // someData: 'goes here',
        },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
}

async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig.extra.eas.projectId,
        });
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    return token;
}

const Stack = createNativeStackNavigator();



const LoginNavigator = () => {
    const { user } = useContext(AuthContext);
    const navigation = useNavigation();
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const [userId, setUserId] = useState(null);
    const notificationListener = useRef();
    const responseListener = useRef();
    // console.log("rendered", user.user.userId);


    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token.data));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            const navigateTo = response.notification.request.content.data.navigateTo;

            if (navigateTo) {
                // Navigate to the specified screen
                navigation.navigate(navigateTo);
            }
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);



    useEffect(() => {
        console.log("socket")

        socket.on('connect', () => {
            console.log('Connected to server');
            console.log("socketID:  ", socket.id); // This will have a value after the connection is established
        });

        socket.on("userNotification", (data) => {
            // console.log("Received userNewForumCommentNotification");
            // Handle user logout event
            const pushToken = data.pushToken;
            const title = data.title;
            const body = data.body;
            // console.log("userNewForumCommentNotification")

            // console.log({pushToken,title,body})
            sendPushNotification({ pushToken, title, body });
        });

        socket.on('login', (userId) => {
            // console.log("login UserId:" , userId);
            socket.on(`userChatNotification${user.user.userId}`, (data) => {
                // console.log("Received userNewForumCommentNotification");
                // Handle user logout event
                const pushToken = data.pushToken;
                const title = data.title;
                const body = data.body;
                const chatNotificationBoolean = data.chatNotificationBoolean;
                // console.log("userNewForumCommentNotification")

                // console.log({pushToken,title,body})
                sendPushNotification({ pushToken, title, body, chatNotificationBoolean });
            });
        });

        return () => {
            socket.disconnect();
            console.log("socket deleted")
        };
    }, [userId]);

    useEffect(() => {
        const updateUserPushToken = async () => {
            if (user) {
                const userId = user.user.userId;
                const pushToken = expoPushToken;
                console.log({ userId, pushToken });

                try {
                    await savePushToken({ userId, pushToken });
                } catch (error) {
                    console.error(error);
                }
            }
        };

        updateUserPushToken();
        // console.log("LOGIN NAV: ", user);
    }, [user]);

    return (
        <FormDataProvider>
            <Stack.Navigator>
                {/* <Stack.Screen name="Home Page" component={HomePage} /> */}
                {/* <Stack.Screen name="Google Sign Up" component={GoogleSignUp} /> */}
                <Stack.Screen name="Get Started" component={GetStarted} />
                <Stack.Screen name="Login Portal" component={LoginPortal} />
                <Stack.Screen name="Sign Up Screen" component={SignUpScreen} />
                <Stack.Screen name={"Sign Up Screen (Partner)"} component={SignUpScreenPartnerApp} />
                <Stack.Screen name="Home Screen" component={HomeScreen} />
                <Stack.Screen name="Intro to Partner App" component={IntroScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Company Info" component={CompanyInfoScreen} />
                <Stack.Screen name="User Role" component={UserRoleScreen} />
                <Stack.Screen name="Credit Card Info" component={creditCardInfoScreen} />
                <Stack.Screen name="Document Submission" component={documentSubmissionScreen} options={{
                    headerLeft: () => null,
                }} />
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
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Property Listings Stack Group"
                    component={PropertyListingsStackGroup}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name={"Side Navigator (Partner)"}
                    component={SideNavigatorPartner}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name={"Response"}
                    component={Response}
                    options={{ header: () => <ResponseTopNavBar /> }}
                />
                <Stack.Screen
                    name={"Message"}
                    component={Message}
                    options={{ header: () => <MessageTopNavBar /> }}
                />
                <Stack.Screen name={"Message Partner"} component={MessagePartner} options={{ header: () => <MessageTopNavBar /> }} />
            </Stack.Navigator>
        </FormDataProvider>
    );
};

export default LoginNavigator;

export { socket }; 