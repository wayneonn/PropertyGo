import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AppointmentMain from '../../screens/sideNavigatorBar/Appointment/Appointments';
import AppointmentAgenda from '../../screens/sideNavigatorBar/Appointment/AppointmentsAgenda';
import AppointmentHistory from '../../screens/sideNavigatorBar/Appointment/AppointmentsHistory';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native'; // Import Text and View from react-native

const Tab = createMaterialTopTabNavigator();

const CustomTabLabel = ({ label, color, icon }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Ionicons name={icon} size={20} color="black" />
    <Text style={{ color: "black", marginLeft: 5 }}>{label}</Text>
  </View>
);

const AppointmentTabNavigator = () => {
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
        name="Appointment Upcoming"
        component={AppointmentMain}
        options={{
          tabBarLabel: ({ color, focused }) => (
            <CustomTabLabel label="Upcoming" color={color} icon="today-outline" />
          ),
        }}
      />
      <Tab.Screen
        name="Appointment History"
        component={AppointmentHistory}
        options={{
          tabBarLabel: ({ color, focused }) => (
            <CustomTabLabel label="History" color={color} icon="time-outline" />
          ),
        }}
      />
      <Tab.Screen
        name="Appointment Agenda"
        component={AppointmentAgenda}
        options={{
          tabBarLabel: ({ color, focused }) => (
            <CustomTabLabel label="Agenda" color={color} icon="list-outline" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppointmentTabNavigator;
