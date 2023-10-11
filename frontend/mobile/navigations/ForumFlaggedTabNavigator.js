import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FlaggedTopics from '../screens/forum/FlaggedTopics'
import FlaggedPosts from '../screens/forum/FlaggedPosts'
import FlaggedComments from '../screens/forum/FlaggedComments'
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

const ForumFlaggedTabNavigator = () => {

    const route = useRoute();
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
                name="Flagged Topics"
                component={FlaggedTopics}
                // initialParams={{ topic }}
                options={{
                    tabBarLabel: ({ color, focused }) => (
                        <CustomTabLabel label="Topics" color={color} icon="topic" />
                    ),
                }}
            />
            <Tab.Screen
                name="Flagged Posts"
                component={FlaggedPosts}
                // initialParams={{ topic }}
                options={{
                    tabBarLabel: ({ color, focused }) => (
                        <CustomTabLabel label="Posts" color={color} icon="local-post-office" />
                    ),
                }}
            />

            <Tab.Screen
                name="Flagged Comments"
                component={FlaggedComments}
                // initialParams={{ topic }}
                options={{
                    tabBarLabel: ({ color, focused }) => (
                        <CustomTabLabel label="Comments" color={color} icon="comment" />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default ForumFlaggedTabNavigator;