import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeStackGroup from './HomeStackGroup';


const Drawer = createDrawerNavigator();

const SideBar = () => {

    return (
        <Drawer.Navigator screenOptions={{ headerShown: false }}>
            <Drawer.Screen name="Home Stack Group" component={HomeStackGroup} />
            {/* <Drawer.Screen name="Profile" component={Profile} /> */}
            {/* Add more screens as needed */}
        </Drawer.Navigator>
    );
};
export default SideBar;