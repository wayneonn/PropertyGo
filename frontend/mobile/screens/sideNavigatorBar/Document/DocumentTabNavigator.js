import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Transactions from '../Transaction/Transactions';
import PendingTransactions from '../Transaction/PendingTransactions';
import TokenTransactions from '../Transaction/TokenTransactions';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import Documents from "./ViewDocuments"; // Import Text and View from react-native
import UploadDocuments from "./UploadDocuments";

const Tab = createMaterialTopTabNavigator();

const CustomTabLabel = ({ label, color, icon }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <FontAwesome5 name={icon} size={20} color="black" />
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
                name="All Transactions"
                component={Documents}
                options={{
                    tabBarLabel: ({ color, focused }) => (
                        <CustomTabLabel label="View Documents" color={color} icon="file-alt" />
                    ),
                }}
            />
            <Tab.Screen
                name="Token Transactions"
                component={UploadDocuments}
                options={{
                    tabBarLabel: ({ color, focused }) => (
                        <CustomTabLabel label="Upload Documents" color={color} icon="file-upload" />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default TransactionTabNavigator;
