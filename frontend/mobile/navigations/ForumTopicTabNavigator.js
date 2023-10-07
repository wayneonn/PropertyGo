import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ForumTopicDefault from '../screens/forum/ForumTopicDefault';
import ForumTopicHot from '../screens/forum/ForumTopicHot';
import { MaterialIcons } from '@expo/vector-icons';
import { View, Text } from 'react-native'; // Import Text and View from react-native

const Tab = createMaterialTopTabNavigator();

const CustomTabLabel = ({ label, color, icon }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <MaterialIcons name={icon} size={20} color={color} />
    <Text style={{ color: "black", marginLeft: 5 }}>{label}</Text>
  </View>
);

const ForumTopicTabNavigator = () => {
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
        name="Forum Topic Default"
        component={ForumTopicDefault}
        options={{
          tabBarLabel: ({ color, focused }) => (
            <CustomTabLabel label="Latest" color={color} icon="access-time" />
          ),
        }}
      />
      <Tab.Screen
        name="Forum Topic Hot"
        component={ForumTopicHot}
        options={{
          tabBarLabel: ({ color, focused }) => (
            <CustomTabLabel label="Hot" color={color} icon="whatshot" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default ForumTopicTabNavigator;
