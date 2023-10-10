import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import YourContributionTopics from '../screens/forum/YourContributionTopics';
import YourContributionPosts from '../screens/forum/YourContributionPosts';
import YourContributionComments from '../screens/forum/YourContributionComments';
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

const YourContributionTabNavigator = () => {

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
                name="Your Contribution Topics"
                component={YourContributionTopics}
                // initialParams={{ topic }}
                options={{
                    tabBarLabel: ({ color, focused }) => (
                        <CustomTabLabel label="Topics" color={color} icon="topic" />
                    ),
                }}
            />
            <Tab.Screen
                name="Your Contribution Posts"
                component={YourContributionPosts}
                // initialParams={{ topic }}
                options={{
                    tabBarLabel: ({ color, focused }) => (
                        <CustomTabLabel label="Posts" color={color} icon="local-post-office" />
                    ),
                }}
            />

            <Tab.Screen
                name="Your Contribution Comments"
                component={YourContributionComments}
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

export default YourContributionTabNavigator;