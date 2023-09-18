import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserProfile from '../screens/sideNavigatorBar/UserProfile';
import EditProfile from '../screens/userProfile/EditProfile';

const UserProfileStack = createNativeStackNavigator();

const UserProfileStackGroup = () => {
  return (
    <UserProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <UserProfileStack.Screen name="UserProfile" component={UserProfile} />
      <UserProfileStack.Screen name="EditProfile" component={EditProfile} />
    </UserProfileStack.Navigator>
  );
};

export default UserProfileStackGroup;
