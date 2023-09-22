import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ForumHome from '../screens/forum/ForumHome';

const ForumStack = createNativeStackNavigator();

const ForumStackGroup = () => {

    return (

        <ForumStack.Navigator screenOptions={{ headerShown: false }}>
            <ForumStack.Screen name="Forum Home" component={ForumHome}/>
        </ForumStack.Navigator>
    );
};
export default ForumStackGroup;