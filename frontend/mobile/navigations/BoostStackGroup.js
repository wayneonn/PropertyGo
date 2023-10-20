import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ListProperty from "../screens/userBottomNavBar/Sell";
import PropertyListing from "../screens/propertyListings/PropertyListing";
import EditPropertyListing from "../screens/propertyListings/EditPropertyListing";
import ViewUserProfile from "../screens/userProfile/ViewUserProfile";
import BoostPropertyListing from "../screens/propertyListings/BoostPropertyListing";
import Map from "../screens/propertyListings/map";

import BoostProfileListing from "../screens/dashboard/BoostProfileListing";

const BoostStack = createNativeStackNavigator();

const DashboardStackGroup = () => {

    return (
        <BoostStack.Navigator screenOptions={{headerShown: false}}>
            {/* Adjust accordingly */}
            {/* <PropertyListingsStack.Screen name="Map" component={Map}/> */}
            <BoostStack.Screen name={"Boost My Profile"} component={BoostProfileListing}/>
        </BoostStack.Navigator>
    );
};
export default DashboardStackGroup;