import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ContactUsDetails from '../screens/sideNavigatorBar/ContactUsDetails';
import ContactUs from '../screens/sideNavigatorBar/ContactUs';

const ContactUsStack = createNativeStackNavigator();

const ContactUsStackGroup = () => {

    return (

        <ContactUsStack.Navigator screenOptions={{ headerShown: false }}>
            <ContactUsStack.Screen name="ContactUs Details" component={ContactUsDetails}/>
            <ContactUsStack.Screen name="ContactUs" component={ContactUs}/>
        </ContactUsStack.Navigator>
    );
};
export default ContactUsStackGroup;