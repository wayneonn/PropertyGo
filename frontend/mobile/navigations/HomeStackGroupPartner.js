import React, {useContext, useEffect, useState} from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import PropertyListing from "../screens/propertyListings/PropertyListings";
import PropertyListing from "../screens/propertyListings/PropertyListing";
import EditPropertyListing from "../screens/propertyListings/EditPropertyListing";
import PropertiesList from "../screens/propertyListings/PropertiesList";
import ViewUserProfile from "../screens/userProfile/ViewUserProfile";
import TokenScreen from "../screens/token/TokenScreen"; // Import your Coins screen here
import TokenCheckoutScreen from "../screens/token/TokenCheckoutScreen";
import PartnerSubscriptionCheckoutScreen from "../screens/purchase/PartnerSubscriptionCheckoutScreen";
import SearchResults from '../screens/propertyListings/SearchResults';
import BoostProfileListing from "../screens/dashboard/BoostProfileListing";
import PartnerSubscriptionLandingPage from '../screens/partnerApplication/PartnerSubscriptionLandingPage';
import Map from "../screens/propertyListings/map";
import HomePagePartner from "../screens/userBottomNavBar/HomePagePartner";
import { PhotoGalleryUpload } from "../screens/dashboard/PhotoGalleryUpload";
import { AuthContext } from '../AuthContext';
import ChatTabNavigatorPartner from "./ChatTabNavigatorPartner";

const HomeListingsStack = createNativeStackNavigator();

// This is the Partner Home Stack.
// I need to change the HomePage
const HomeListingsStackGroup = () => {
    const { user } = useContext(AuthContext);
    const subscriptionPaid = user.user.partnerSubscriptionPaid;

    function isExpired(dateToCompare) {
        const today = new Date();
        console.log("Today: ", today);
        console.log("Date to compare: ", dateToCompare);

        // Convert dateToCompare to a Date object
        const compareDate = new Date(dateToCompare);

        // Adjust the time zone offset for compareDate to match the local time zone
        compareDate.setMinutes(compareDate.getMinutes() - today.getTimezoneOffset());

        return compareDate < today;
    }

    console.log("subscriptionPaid: ", subscriptionPaid )
    const screens = subscriptionPaid && !isExpired(user.user.partnerSubscriptionEndDate)
        ? [
              <HomeListingsStack.Screen key="List Property" name="List Property" component={HomePagePartner} />,
          ]
        : [
              <HomeListingsStack.Screen name="PartnerSubscriptionLandingPage" component={PartnerSubscriptionLandingPage} />,
              <HomeListingsStack.Screen key="List Property" name="List Property" component={HomePagePartner} />
          ];

    return (
        <HomeListingsStack.Navigator screenOptions={{ headerShown: false }}>
            {screens}
            <HomeListingsStack.Screen name="View Profile" component={ViewUserProfile} />
            <HomeListingsStack.Screen name="Token" component={TokenScreen}/>
            <HomeListingsStack.Screen name="Token Checkout Screen" component={TokenCheckoutScreen} />
            <HomeListingsStack.Screen name="Partner Subscription Checkout Screen" component={PartnerSubscriptionCheckoutScreen} />
            <HomeListingsStack.Screen name="Boost Listing" component={BoostProfileListing} />
            <HomeListingsStack.Screen name="Search Results" component={SearchResults} />
            <HomeListingsStack.Screen name={"Upload Photos"} component={PhotoGalleryUpload} />
            <HomeListingsStack.Screen name="Chat" component={ChatTabNavigatorPartner}/>
        </HomeListingsStack.Navigator>
    );
};

export default HomeListingsStackGroup;