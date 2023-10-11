import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import UpvotedTopics from '../screens/forum/UpvotedTopics'
import UpvotedPosts from '../screens/forum/UpvotedPosts'
import UpvotedComments from '../screens/forum/UpvotedComments'
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

const ForumUpvoteTabNavigator = () => {

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
                name="Upvoted Topics"
                component={UpvotedTopics}
                // initialParams={{ topic }}
                options={{
                    tabBarLabel: ({ color, focused }) => (
                        <CustomTabLabel label="Topics" color={color} icon="topic" />
                    ),
                }}
            />
            <Tab.Screen
                name="Upvoted Posts"
                component={UpvotedPosts}
                // initialParams={{ topic }}
                options={{
                    tabBarLabel: ({ color, focused }) => (
                        <CustomTabLabel label="Posts" color={color} icon="local-post-office" />
                    ),
                }}
            />

            <Tab.Screen
                name="Upvoted Comments"
                component={UpvotedComments}
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

export default ForumUpvoteTabNavigator;