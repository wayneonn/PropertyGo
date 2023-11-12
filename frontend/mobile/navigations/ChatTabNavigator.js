import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text } from 'react-native'; // Import Text and View from react-native
import { useRoute } from '@react-navigation/native';
import ReceiverChat from '../screens/chat/ReceiverChat';
import SenderChat from '../screens/chat/SenderChat';

const Tab = createMaterialTopTabNavigator();

const CustomTabLabel = ({ label, color, icon }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <MaterialCommunityIcons name={icon} size={20} color={color} />
        <Text style={{ color: "black", marginLeft: 5 }}>{label}</Text>
    </View>
);

const ChatTabNavigator = () => {

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#FFD700',
                tabBarLabelStyle: {
                    color: 'black',
                },
                tabBarItemStyle: {
                    height: 50,
                },
                tabBarIndicatorStyle: {
                    backgroundColor: '#FFD700',
                },
                tabBarStyle: {
                    backgroundColor: 'white',
                },
            }}
        >
            <Tab.Screen
                name="Sender Chat"
                component={SenderChat}
                options={{
                    tabBarLabel: ({ color, focused }) => (
                        <CustomTabLabel label="Buying" color={color} icon="inbox-arrow-up-outline" />
                    ),
                }}
            />
            <Tab.Screen
                name="Receiver Chat"
                component={ReceiverChat}
                options={{
                    tabBarLabel: ({ color, focused }) => (
                        <CustomTabLabel label="Selling" color={color} icon="inbox-arrow-down-outline" />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default ChatTabNavigator;