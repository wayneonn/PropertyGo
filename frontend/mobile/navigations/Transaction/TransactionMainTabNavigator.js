import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Transactions from '../../screens/sideNavigatorBar/Transaction/Transactions';
import PendingTransactions from '../../screens/sideNavigatorBar/Transaction/PendingTransactions';
import TokenTransactions from '../../screens/sideNavigatorBar/Transaction/TokenTransactions';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { View, Text } from 'react-native'; // Import Text and View from react-native

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
        component={Transactions}
        options={{
          tabBarLabel: ({ color, focused }) => (
            <CustomTabLabel label="All" color={color} icon="list-ol" />
          ),
        }}
      />
      <Tab.Screen
        name="Token Transactions"
        component={TokenTransactions}
        options={{
          tabBarLabel: ({ color, focused }) => (
            <CustomTabLabel label="History" color={color} icon="coins" />
          ),
        }}
      />
      <Tab.Screen
        name="Pending Transactions"
        component={PendingTransactions}
        options={{
          tabBarLabel: ({ color, focused }) => (
            <CustomTabLabel label="Pending" color={color} icon="hourglass-start" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TransactionTabNavigator;
