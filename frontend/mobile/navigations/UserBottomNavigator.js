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
import { useNavigation } from "@react-navigation/native";
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
// import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const UserBottomNavigator = () => {
    const navigation = useNavigation();

    // Screen-specific header options
    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <AntDesign name="menu-unfold" size={24} color="black" />
          </TouchableOpacity>
        ),
        headerTitle: () => (
            <Image
              source={require('../assets/PropertyGo-Logo.png')}
              style={{ width: 40, height: 40, marginBottom: 20 }}
            />
        ),
        headerRight: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => {
                /*side nav bar*/
              }}
              style={{ marginRight: 10 }}
            >
              <FontAwesome5 name="coins" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                /*side nav bar*/
              }}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
        ),
      });
    }, [navigation]);


    return (
        <Tab.Navigator 
        screenOptions={({route, navigation}) => ({
            headerShown:false,
            tabBarIcon: ({color, focused, size}) => {
                let iconName;
                if (route.name === "Home") {

                    iconName = focused ? "home" : "home-outline";

                } else if (route.name === "Favourite") {

                    iconName = focused ? "favorite" : "favorite-border";

                } else if (route.name === "Sell") {

                    iconName = "add-sharp" ;

                } else if (route.name === "Forum") {

                    iconName = focused ? "forum" : "forum-outline";
                    
                } else if (route.name === "Activity") {

                    iconName = focused ? "md-notifications-sharp" : "md-notifications-outline";
                    
                }
                return route.name ===  "Favourite" ? <MaterialIcons name={iconName} size={size} color={color}/>
                : (route.name ===  "Forum")  ? <MaterialCommunityIcons name={iconName} size={size} color={color}/>
                : <Ionicons name={iconName} size={size} color={color}/> 
            },
            tabBarActiveTintColor: "#FFD700",

        })}
        >
            <Tab.Screen name="Home" component={HomePage} />
            <Tab.Screen name="Favourite" component={Favourite} />
            <Tab.Screen name="Sell" component={Sell} />
            <Tab.Screen name="Forum" component={Forum} />
            <Tab.Screen name="Activity" component={Activity} />
        </Tab.Navigator>
    );
};

export default UserBottomNavigator;