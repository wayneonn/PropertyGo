import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Feather, MaterialIcons} from '@expo/vector-icons';
import ContactUsStatus from '../screens/sideNavigatorBar/ContactUsStatus';
import ContactUs from '../screens/sideNavigatorBar/ContactUs';

// const ContactUsStack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

const ContactUsStackGroup = ({route}) => {

    // return (

    //     <ContactUsStack.Navigator>
    //         <ContactUsStack.Screen name="ContactUs Details" component={ContactUsDetails} options={{ headerShown: false }}/>
    //         <ContactUsStack.Screen name="ContactUs" component={ContactUs}/>
    //     </ContactUsStack.Navigator>
    // );

    return (
        <Tab.Navigator
            screenOptions={({route}) => ({
                headerShown: false,
                tabBarIcon: ({color, focused, size}) => {
                    let iconName;

                    if (route.name === "ContactUs") {
                        iconName = focused ? "mail" : "mail-outline";
                        return <MaterialIcons name={iconName} size={size} color={color}/>;
                    } else if (route.name === "ContactUs Status") {
                        // You can use Feather icon for "Contact Us Status"
                        return <Feather name="loader" size={size} color={color}/>;
                    }

                },
                tabBarActiveTintColor: "#FFD700",
            })}
        >
            <Tab.Screen name="ContactUs" component={ContactUs} initialParams={{parentRoute: route.params.parentRoute}}/>
            <Tab.Screen name="ContactUs Status" component={ContactUsStatus}
                        initialParams={{parentRoute: route.params.parentRoute}}/>

        </Tab.Navigator>
    );
};
export default ContactUsStackGroup;