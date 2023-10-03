import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ForumPostDefault from '../screens/forum/ForumPostDefault';
import ForumPostHot from '../screens/forum/ForumPostHot';
import { MaterialIcons } from '@expo/vector-icons';
import { View, Text } from 'react-native'; // Import Text and View from react-native
import { useRoute } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();

const CustomTabLabel = ({ label, color, icon }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <MaterialIcons name={icon} size={20} color={color} />
    <Text style={{ color: "black", marginLeft: 5 }}>{label}</Text>
  </View>
);

const ForumPostTabNavigator = () => {

  const route = useRoute();
  const { topic } = route.params;
  // console.log(topic);

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
        name="Forum Post Default"
        component={ForumPostDefault}
        initialParams={{ topic }}
        options={{
          tabBarLabel: ({ color, focused }) => (
            <CustomTabLabel label="Latest" color={color} icon="access-time" />
          ),
        }}
      />
      <Tab.Screen
        name="Forum Post Hot"
        component={ForumPostHot}
        initialParams={{ topic }}
        options={{
          tabBarLabel: ({ color, focused }) => (
            <CustomTabLabel label="Hot" color={color} icon="whatshot" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default ForumPostTabNavigator;