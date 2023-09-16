import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeStackGroup from './HomeStackGroup';
import Logout from '../screens/login/LoginPortal';

const Drawer = createDrawerNavigator();

const SideBar = () => {
    return (
        <Drawer.Navigator screenOptions={{ headerShown: false }}>
            <Drawer.Screen name="Home Stack Group" component={HomeStackGroup} />
            {/* <Drawer.Screen name="Explore Services" component={ExploreServices} />
            <Drawer.Screen name="User Profile" component={UserProfile} />
            <Drawer.Screen name="Listings" component={Listings} />
            <Drawer.Screen name="Appointments" component={Appointments} />
            <Drawer.Screen name="Transactions" component={Transactions} />
            <Drawer.Screen name="Documents" component={Documents} />
            <Drawer.Screen name="Mortgage Calculator" component={MortgageCalculator} />
            <Drawer.Screen name="Work with Us" component={WorkWithUs} />
            <Drawer.Screen name="Help & Support" component={HelpAndSupport} />
            <Drawer.Screen name="Contact Us" component={ContactUs} /> */}
            <Drawer.Screen name="Logout" component={Logout} />
        </Drawer.Navigator>
    );
};

export default SideBar;
