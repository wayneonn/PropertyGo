// Navigation screen for Partner Application.
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import IntroScreen from "../screens/partnerApplication/InfoScreen";
import CompanyInfoScreen from '../screens/partnerApplication/CompanyInfo';
import UserRoleScreen from '../screens/partnerApplication/UserRole';
import {FormDataProvider} from '../contexts/PartnerApplicationFormDataContext'
import documentSubmissionScreen from "../screens/partnerApplication/DocumentSubmission";
import creditCardInfoScreen from "../screens/partnerApplication/CreditCardInfoScreen";


const Stack = createStackNavigator();

// This needs to change depending on status.
export default function App() {
    return (
        <NavigationContainer>
            <FormDataProvider>
                <Stack.Navigator initialRouteName="Intro">
                    <Stack.Screen name="Intro" component={IntroScreen}/>
                    <Stack.Screen name="Company Info" component={CompanyInfoScreen}/>
                    <Stack.Screen name="User Role" component={UserRoleScreen}/>
                    <Stack.Screen name="Credit Card Info" component={creditCardInfoScreen}/>
                    <Stack.Screen name="Document Submission" component={documentSubmissionScreen}/>
                </Stack.Navigator>
            </FormDataProvider>
        </NavigationContainer>
    );
}
