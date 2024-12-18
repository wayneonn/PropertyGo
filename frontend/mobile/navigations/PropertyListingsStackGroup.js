import React, {useContext} from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import PropertyListing from "../screens/propertyListings/PropertyListings";
import ListProperty from "../screens/userBottomNavBar/Sell";
import PropertyListing from "../screens/propertyListings/PropertyListing";
import RegionPropertiesList from "../screens/propertyListings/RegionPropertiesList";
import FlatTypePropertiesList from "../screens/propertyListings/FlatTypePropertiesList";
import EditPropertyListing from "../screens/propertyListings/EditPropertyListing";
import ViewUserProfile from "../screens/userProfile/ViewUserProfile";
import BoostPropertyListing from "../screens/propertyListings/BoostPropertyListing";
import SetSchedule from "../screens/schedule/SetSchedule";
import Schedule from "../screens/schedule/Schedule";
import PurchaseOptionFee from "../screens/purchase/PurchaseOptionFeeCheckoutScreen";
import PurchaseOptionFeeInfo from "../screens/purchase/PurchaseOptionFeeInfo";
import Map from "../screens/propertyListings/map";
import TokenScreen from "../screens/token/TokenScreen"; // Import your Coins screen here
import TokenCheckoutScreen from "../screens/token/TokenCheckoutScreen";
import SellerOnboarding from "../screens/propertyListings/SellerOnboarding";
import { AuthContext } from '../AuthContext';

const PropertyListingsStack = createNativeStackNavigator();

const PropertyListingsStackGroup = () => {
    const { user } = useContext(AuthContext);
    const bankName = user.user.bankName;
    const bankAccount = user.user.bankAccount;

    const screens = bankName && bankAccount
        ? [
            
            <PropertyListingsStack.Screen name="List Property" component={ListProperty} />,
        ]
        : [
            <PropertyListingsStack.Screen name="Seller Onboarding" component={SellerOnboarding} />,
            <PropertyListingsStack.Screen name="List Property" component={ListProperty} />
        ];

    return (
        <PropertyListingsStack.Navigator screenOptions={{ headerShown: false }}>
            {/* Adjust accordingly */}
            {/* <PropertyListingsStack.Screen name="Map" component={Map}/> */}
            {screens}
            {/* <PropertyListingsStack.Screen name="List Property" component={ListProperty} /> */}
            <PropertyListingsStack.Screen name="Property Listing" component={PropertyListing} />
            <PropertyListingsStack.Screen name="Region Property List" component={RegionPropertiesList} />
            <PropertyListingsStack.Screen name="Flat Type Property List" component={FlatTypePropertiesList} />
            <PropertyListingsStack.Screen name="Edit Property Listing" component={EditPropertyListing} />
            <PropertyListingsStack.Screen name="View Profile" component={ViewUserProfile} />
            <PropertyListingsStack.Screen name="Boost Listing" component={BoostPropertyListing} />
            <PropertyListingsStack.Screen name="Set Schedule" component={SetSchedule} />
            <PropertyListingsStack.Screen name="Schedule" component={Schedule} />
            <PropertyListingsStack.Screen name="Token" component={TokenScreen} />
            <PropertyListingsStack.Screen name="Token Checkout Screen" component={TokenCheckoutScreen} />
            <PropertyListingsStack.Screen name="Purchase Option Fee" component={PurchaseOptionFee} />
            <PropertyListingsStack.Screen name="Purchase Option Fee Info" component={PurchaseOptionFeeInfo} />
            {/* <PropertyListingsStack.Screen name="Seller Onboarding" component={SellerOnboarding} /> */}
        </PropertyListingsStack.Navigator>
    );
};
export default PropertyListingsStackGroup;