import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem
} from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import HomeStackGroup from './HomeStackGroup';
import { Ionicons } from '@expo/vector-icons';
import LogoutButton from '../components/LogoutButton';
import Appointments from '../screens/sideNavigatorBar/Appointments'
import Documents from '../screens/sideNavigatorBar/Documents'
import ExploreServices from '../screens/sideNavigatorBar/ExploreServices'
import FAQ from '../screens/sideNavigatorBar/FAQs'
import MortgageCalculator from '../screens/sideNavigatorBar/MortgageCalculator'
import Transactions from '../screens/sideNavigatorBar/Transactions'
import UserListings from '../screens/sideNavigatorBar/UserListings'
import UserProfile from '../screens/sideNavigatorBar/UserProfile'
import WorkWithUs from '../screens/sideNavigatorBar/WorkWithUs'
import ContactUsStackGroup from './ContactUsStackGroup';
import TopBar from '../components/Common/TopNavBar';
const CustomDrawerContent = (props) => {
    const { navigation, profilePictureUrl } = props; // Replace with the actual prop name you use

    const handleLogout = () => {
        navigation.navigate("Login Portal");
    };

    return (
        <DrawerContentScrollView {...props}>
            {/* Profile Picture */}
            <View style={{ alignItems: 'center', padding: 16 }}>
                <Image
                    source={require('../assets/dog.jpg')}
                    style={{ width: 100, height: 100, borderRadius: 50 }}
                />
                <Text style={{ marginTop: 15, fontSize: 16, fontWeight: 'bold', color: 'black' }}>
                    PropertyGo
                </Text>
            </View>

            {/* Drawer Items */}
            <DrawerItemList {...props} />

            {/* Logout Button */}
            <LogoutButton onPress={handleLogout} />
        </DrawerContentScrollView>
    );
};



const Drawer = createDrawerNavigator();

const createDrawerScreen = (name, component, iconName, label, hideHeader = false) => {
    return {
        name,
        component,
        options: () => ({
            drawerLabel: label,
            drawerIcon: ({ focused, color, size }) => (
                <Ionicons
                    name={focused ? iconName : `${iconName}-outline`}
                    size={size}
                    color={color}
                />
            ),
            // headerShown: !hideHeader && route.name !== 'Home', // Show header unless it's the "Home" screen
        }),
    };
};

const drawerScreens = [
    createDrawerScreen('Home', HomeStackGroup, 'home', 'Home'),
    createDrawerScreen('Explore Services', ExploreServices, 'search', 'Explore Services'),
    createDrawerScreen('User Profile', UserProfile, 'person', 'User Profile'),
    createDrawerScreen('User Listings', UserListings, 'list', 'User Listings'),
    createDrawerScreen('Appointments', Appointments, 'calendar', 'Appointments'),
    createDrawerScreen('Documents', Documents, 'document', 'Documents'),
    createDrawerScreen('Transactions', Transactions, 'swap-horizontal', 'Transactions'),
    createDrawerScreen('Mortgage Calculator', MortgageCalculator, 'calculator', 'Mortgage Calculator'),
    createDrawerScreen('FAQ', FAQ, 'help-circle', 'FAQ'),
    createDrawerScreen('Contact Us Group', ContactUsStackGroup, 'mail', 'Contact Us'),
    createDrawerScreen('Work With Us', WorkWithUs, 'briefcase', 'Work With Us'),
];


const SideBar = ({route}) => {

    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                drawerActiveTintColor: "#FFD700",
                header: () => <TopBar/>,
                // headerShown: false,
            }}>
            {drawerScreens.map((screen) => (
                <Drawer.Screen
                    key={screen.name}
                    name={screen.name}
                    component={screen.component}
                    options={screen.options}
                    initialParams={{ parentRoute: route }}
                />
            ))}
        </Drawer.Navigator>
    );
};

export default SideBar;
