import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from '../screens/userBottomNavBar/HomePage';
import Favourite from '../screens/userBottomNavBar/Favourite';
import Sell from '../screens/userBottomNavBar/Sell';
import Forum from '../screens/userBottomNavBar/Forum';
import Activity from '../screens/userBottomNavBar/Activity';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import PropertyListingsStackGroup from './PropertyListingsStackGroup';
import DashboardStackGroup from "./DashboardStackGroup"
import BoostListingScreen from "../screens/propertyListings/BoostPropertyListing";
import FavouriteStackGroup from './FavouriteStackGroup';
import HomeStackGroup from './HomeStackGroup';
import { AuthContext } from "../AuthContext";
import HomeStackGroupPartner from "./HomeStackGroupPartner";
import BoostStackGroup from "./BoostStackGroup";
import BoostProfileListing from "../screens/dashboard/BoostProfileListing";
import { countUnreadNotifications } from '../utils/notificationApi';
import { socket } from './LoginNavigator';

const Tab = createBottomTabNavigator();

const UserBottomNavigator = () => {
    const { user } = useContext(AuthContext)
    const [notificationCount, setNotificationCount] = useState(0)

    const fetchData = async () => {
        try {
            const numberUnreadNotification = await countUnreadNotifications(user.user.userId);
            setNotificationCount(numberUnreadNotification.unreadCount);
            console.log(numberUnreadNotification.unreadCount);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        socket.on("userNewForumCommentNotification", (data) => {
            fetchData()
        });
    })

    useEffect(() => {
        fetchData();
    }, [notificationCount]);

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
                    } else if (route.name === "Dashboard") {
                        iconName = "dashboard";
                    } else if (route.name === "Boost") {
                        iconName = focused ? "rocket" : "rocket-outline";
                    }

                    const iconComponent =
                        route.name === "Favourite" || route.name === "Dashboard" ? (
                            <MaterialIcons name={iconName} size={size} color={"#FFD700"} />
                        ) : route.name === "Forum" ? (
                            <MaterialCommunityIcons name={iconName} size={size} color={"#FFD700"} />
                        ) : (
                            <View style={styles.tabLabelContainer}>
                                {/* {console.log("notificationCount", notificationCount)} */}
                                {notificationCount > 0 && iconName === "md-notifications-outline" && (
                                    <View style={styles.notificationBadge}>
                                        <Text style={styles.notificationCountText}>{notificationCount}</Text>
                                    </View>
                                )}
                                <Ionicons name={iconName} size={size} color={"#FFD700"} />
                            </View>
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
            <Tab.Screen name={"Home"} component={HomeStackGroup} />
            }
            {["LAWYER", "CONTRACTOR", "PROPERTY AGENT"].includes(user.user.userType) ?
                <Tab.Screen name={"Boost"} component={BoostProfileListing} /> :
                <Tab.Screen name="Favourite" component={FavouriteStackGroup} />

            }
            {["LAWYER", "CONTRACTOR", "PROPERTY AGENT"].includes(user.user.userType) ?
                <Tab.Screen name={"Dashboard"} component={DashboardStackGroup} /> :
                <Tab.Screen name="Sell" component={PropertyListingsStackGroup} />
            }
            <Tab.Screen name="Forum" component={Forum} />
            {/* <Tab.Screen name="Activity" component={Activity} parentFetchData={fetchData} /> */}
            <Tab.Screen name="Activity" >
                {props => <Activity {...props} component={Activity} parentFetchData={fetchData} />}
            </Tab.Screen>
        </Tab.Navigator>
    );
};

export default UserBottomNavigator;

const styles = StyleSheet.create({
    tabLabelContainer: {
        flexDirection: 'row',
        //   alignItems: 'center',
    },
    notificationBadge: {
        backgroundColor: 'red',
        borderRadius: 8,
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        //   marginLeft: 4, // Adjust the spacing
    },
    notificationCountText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
});