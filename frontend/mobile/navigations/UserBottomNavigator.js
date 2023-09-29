import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from '../screens/userBottomNavBar/HomePage';
import Favourite from '../screens/userBottomNavBar/Favourite';
import Sell from '../screens/userBottomNavBar/Sell';
import Forum from '../screens/userBottomNavBar/Forum';
import Activity from '../screens/userBottomNavBar/Activity';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PropertyListingsStackGroup from './PropertyListingsStackGroup';
import FavouriteStackGroup from './FavouriteStackGroup';
import HomeStackGroup from './HomeStackGroup';

const Tab = createBottomTabNavigator();

const UserBottomNavigator = () => {

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, focused, size }) => {
                    let iconName;

                    if (route.name === "Home") {
                        iconName = focused ? "home" : "home-outline";
                    } else if (route.name === "Favourite") {
                        iconName = focused ? "favorite" : "favorite-border";
                    } else if (route.name === "Sell") {
                        iconName = "add-sharp";
                    } else if (route.name === "Forum") {
                        iconName = focused ? "forum" : "forum-outline";
                    } else if (route.name === "Activity") {
                        iconName = focused ? "md-notifications-sharp" : "md-notifications-outline";
                    }

                    const iconComponent =
                        route.name === "Favourite" ? (
                            <MaterialIcons name={iconName} size={size} color={"#FFD700"} />
                        ) : route.name === "Forum" ? (
                            <MaterialCommunityIcons name={iconName} size={size} color={"#FFD700"} />
                        ) : (
                            <Ionicons name={iconName} size={size} color={"#FFD700"} />
                        );

                    return iconComponent;
                },
                tabBarActiveTintColor: "#000000", 
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: 'bold',
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeStackGroup} />
            <Tab.Screen name="Favourite" component={FavouriteStackGroup} />
            <Tab.Screen name="Sell" component={PropertyListingsStackGroup} />
            <Tab.Screen name="Forum" component={Forum} />
            <Tab.Screen name="Activity" component={Activity} />
        </Tab.Navigator>
    );
};

export default UserBottomNavigator;