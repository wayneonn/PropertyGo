import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserProfile from '../screens/sideNavigatorBar/UserProfile';
import EditProfile from '../screens/userProfile/EditProfile';
import ProfileUpdate from '../screens/userProfile/ProfileUpdate';

const UserProfileStack = createNativeStackNavigator();

const UserProfileStackGroup = () => {
  return (
    <UserProfileStack.Navigator screenOptions={{ headerShown: false }}>
      {/* <UserProfileStack.Screen name="ProfileUpdate" component={ProfileUpdate} /> */}
      <UserProfileStack.Screen name="UserProfile" component={UserProfile} />
      <UserProfileStack.Screen name="ProfileUpdate" component={EditProfile} />
      {/* <UserProfileStack.Screen name="ProfileUpdate" component={ProfileUpdate} /> */}
    </UserProfileStack.Navigator>
  );
};

export default UserProfileStackGroup;
