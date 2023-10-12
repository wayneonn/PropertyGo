import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomePage from '../screens/userBottomNavBar/HomePage';
import Favourite from '../screens/userBottomNavBar/Favourite';
import Sell from '../screens/userBottomNavBar/Sell';
import Forum from '../screens/userBottomNavBar/Forum';
import Activity from '../screens/userBottomNavBar/Activity';
import {Ionicons, MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons';
import PropertyListingsStackGroup from './PropertyListingsStackGroup';
import DashboardStackGroup from "./DashboardStackGroup"
import FavouriteStackGroup from './FavouriteStackGroup';
import HomeStackGroup from './HomeStackGroup';
import {AuthContext} from "../AuthContext";
import HomeStackGroupPartner from "./HomeStackGroupPartner";

const Tab = createBottomTabNavigator();

const UserBottomNavigator = () => {
    const {user} = useContext(AuthContext)

    return (
        <Tab.Navigator
            screenOptions={({route}) => ({
                headerShown: false,
                tabBarIcon: ({color, focused, size}) => {
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
                    } else if (route.name === "Dashboard") {
                        iconName = "dashboard";
                    }

                    const iconComponent =
                        route.name === "Favourite" || route.name === "Dashboard" ? (
                            <MaterialIcons name={iconName} size={size} color={"#FFD700"}/>
                        ) : route.name === "Forum" ? (
                            <MaterialCommunityIcons name={iconName} size={size} color={"#FFD700"}/>
                        ) : (
                            <Ionicons name={iconName} size={size} color={"#FFD700"}/>
                        );

                    return iconComponent;
                },
                tabBarActiveTintColor: "#000000",
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: 'bold',
                },
            })}
        >{["LAWYER", "CONTRACTOR", "PROPERTY AGENT"].includes(user.user.userType) ?
            <Tab.Screen name="Home" component={HomeStackGroupPartner} /> :
            <Tab.Screen name={"Home"} component={HomeStackGroup}/>
        }
            <Tab.Screen name="Favourite" component={FavouriteStackGroup} />
            {["LAWYER", "CONTRACTOR", "PROPERTY AGENT"].includes(user.user.userType) ?
                <Tab.Screen name={"Dashboard"} component={DashboardStackGroup}/> :
                <Tab.Screen name="Sell" component={PropertyListingsStackGroup} />
            }
            <Tab.Screen name="Forum" component={Forum} />
            <Tab.Screen name="Activity" component={Activity} />
        </Tab.Navigator>
    );
};

export default UserBottomNavigator;