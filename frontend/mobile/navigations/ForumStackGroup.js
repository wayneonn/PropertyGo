import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ForumTopicTabNavigator from './ForumTopicTabNavigator';
import ForumPostTabNavigator from './ForumPostTabNavigator';
import ForumTopNavBar from '../components/Forum/ForumTopNavBar';
const ForumStack = createNativeStackNavigator();

const ForumStackGroup = () => {

    return (

        <ForumStack.Navigator screenOptions={{ header: () => <ForumTopNavBar/> }}>
            <ForumStack.Screen name="Forum Topic Tab Navigator" component={ForumTopicTabNavigator}/>
            <ForumStack.Screen name="Forum Post Tab Navigator" component={ForumPostTabNavigator}/>
        </ForumStack.Navigator>
    );
};
export default ForumStackGroup;