import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserBottomNavigator from './UserBottomNavigator';

const HomeStack = createNativeStackNavigator();

const HomeStackGroup = () => {

    return (

        <HomeStack.Navigator>
            <HomeStack.Screen name="User Bottom Navigator" component={UserBottomNavigator}/>
        </HomeStack.Navigator>
    );
};
export default HomeStackGroup;