import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import HomePage from '../Home/HomePage';

const Drawer = createDrawerNavigator();

const SideBar = () => {

    return (
        <Drawer.Navigator initialRouteName="Home">
            <Drawer.Screen name="Home" component={HomePage}/>
            {/* <Drawer.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Settings" component={Settings} /> */}
            {/* Add more screens as needed */}
        </Drawer.Navigator>
    );
};
export default SideBar;