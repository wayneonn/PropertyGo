// Navigation screen for Partner Application.
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import IntroScreen from "../../screens/partnerApplication/InfoScreen";
import CompanyInfoScreen from '../../screens/partnerApplication/CompanyInfo';
import UserRoleScreen from '../../screens/partnerApplication/UserRole';
import CreditCardInfoScreen from "../partnerApplication/CreditCardInfoScreen";
import DocumentSubmission from "../partnerApplication/DocumentSubmission";
import EndingScreen from "../partnerApplication/EndingScreen";
import {FormDataProvider} from '../../contexts/PartnerApplicationFormDataContext'

const Stack = createStackNavigator();

// Nice, actually kinda works.
export default function App() {
    return (
            <FormDataProvider>
                <Stack.Navigator initialRouteName="Intro">
                    <Stack.Screen name="Intro" component={IntroScreen} options={{
                        headerLeft: () => null,
                    }}/>
                    <Stack.Screen name="Company Info" component={CompanyInfoScreen}/>
                    <Stack.Screen name="User Role" component={UserRoleScreen}/>
                    <Stack.Screen name="Credit Card Info" component={CreditCardInfoScreen}/>
                    <Stack.Screen name="Document Selection" component={DocumentSubmission}/>
                    <Stack.Screen name="Ending" component={EndingScreen}/>
                </Stack.Navigator>
            </FormDataProvider>
    );
}
