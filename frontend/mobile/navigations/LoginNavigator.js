import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import GetStarted from '../screens/login/GetStarted';
import LoginPortal from '../screens/login/LoginPortal';
import HomeScreen from '../screens/login/HomeScreen';
import LoginScreen from '../screens/login/LoginScreen.js';
import SignUpScreen from '../screens/login/SignUpScreen';
import SignUpSelection from '../screens/login/SignUpSelection';
import LoginSelection from '../screens/login/LoginSelection';
import SideNavigator from './SideNavigator'
import ForumSideNavigator from './ForumSideNavigator';
import PropertyListingsStackGroup from './PropertyListingsStackGroup';
import SignUpScreenPartnerApp from "../screens/login/SignUpScreenPartnerApp";
import {FormDataProvider} from "../contexts/PartnerApplicationFormDataContext";
import PartnerApp from "./PartnerApplicationNavigator";
import SideNavigatorPartner from "./SideNavigatorPartner";
import IntroScreen from "../screens/partnerApplication/InfoScreen";
import CompanyInfoScreen from "../screens/partnerApplication/CompanyInfo";
import UserRoleScreen from "../screens/partnerApplication/UserRole";
import creditCardInfoScreen from "../screens/partnerApplication/CreditCardInfoScreen";
import documentSubmissionScreen from "../screens/partnerApplication/DocumentSubmission";

const Stack = createNativeStackNavigator();

const LoginNavigator = () => {
    return (
        <FormDataProvider>
            <Stack.Navigator>
                {/* <Stack.Screen name="Home Page" component={HomePage} /> */}
                {/* <Stack.Screen name="Google Sign Up" component={GoogleSignUp} /> */}
                <Stack.Screen name="Get Started" component={GetStarted}/>
                <Stack.Screen name="Login Portal" component={LoginPortal}/>
                <Stack.Screen name="Sign Up Screen" component={SignUpScreen}/>
                <Stack.Screen name={"Sign Up Screen (Partner)"} component={SignUpScreenPartnerApp} />
                <Stack.Screen name="Home Screen" component={HomeScreen}/>
                <Stack.Screen name="Intro to Partner App" component={IntroScreen} options={{ headerShown: false }}/>
                <Stack.Screen name="Company Info" component={CompanyInfoScreen}/>
                <Stack.Screen name="User Role" component={UserRoleScreen}/>
                <Stack.Screen name="Credit Card Info" component={creditCardInfoScreen} />
                <Stack.Screen name="Document Submission" component={documentSubmissionScreen} options={{
                    headerLeft: () => null,
                }}/>
                <Stack.Screen name="Login" component={LoginScreen}/>
                <Stack.Screen name="Sign Up Options" component={SignUpSelection}/>
                <Stack.Screen name="Login Options" component={LoginSelection}/>
                {/* <Stack.Screen name="Home Page" component={HomePage} /> */}
                <Stack.Screen
                    name="Side Navigator"
                    component={SideNavigator}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="Forum Side Navigator"
                    component={ForumSideNavigator}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="Property Listings Stack Group"
                    component={PropertyListingsStackGroup}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name={"Side Navigator (Partner)"}
                    component={SideNavigatorPartner}
                    options={{headerShown: false}}
                />


            </Stack.Navigator>
        </FormDataProvider>
    );
};

export default LoginNavigator;