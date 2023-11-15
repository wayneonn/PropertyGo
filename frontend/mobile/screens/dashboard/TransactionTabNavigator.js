import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text } from 'react-native'; // Import Text and View from react-native
import { useRoute } from '@react-navigation/native';
import PaidRequest from './PaidRequest';
import PendingRequest from './PendingRequest';

const Tab = createMaterialTopTabNavigator();

const CustomTabLabel = ({ label, color, icon }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <MaterialCommunityIcons name={icon} size={20} color={color} />
        <Text style={{ color: "black", marginLeft: 5 }}>{label}</Text>
    </View>
);

const TransactionTabNavigator = () => {

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
                name="Paid Request"
                component={PaidRequest}
                options={{
                    tabBarLabel: ({ color, focused }) => (
                        <CustomTabLabel label="Paid Request" color={color} icon="inbox-arrow-up-outline" />
                    ),
                }}
            />
            <Tab.Screen
                name="Pending Request"
                component={PendingRequest}
                options={{
                    tabBarLabel: ({ color, focused }) => (
                        <CustomTabLabel label="Pending Request" color={color} icon="inbox-arrow-down-outline" />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default TransactionTabNavigator;