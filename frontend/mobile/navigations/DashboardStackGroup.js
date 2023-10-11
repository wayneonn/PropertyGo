import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ListProperty from "../screens/userBottomNavBar/Sell";
import PropertyListing from "../screens/propertyListings/PropertyListing";
import EditPropertyListing from "../screens/propertyListings/EditPropertyListing";
import ViewUserProfile from "../screens/userProfile/ViewUserProfile";
import BoostPropertyListing from "../screens/propertyListings/BoostPropertyListing";
import Map from "../screens/propertyListings/map";

import TransactionList from "../screens/dashboard/transactionList"

const DashboardStack = createNativeStackNavigator();

const DashboardStackGroup = () => {

    return (
        <DashboardStack.Navigator screenOptions={{headerShown: false}}>
            {/* Adjust accordingly */}
            {/* <PropertyListingsStack.Screen name="Map" component={Map}/> */}
            <DashboardStack.Screen name={"Top Transactions"} component={TransactionList}/>
        </DashboardStack.Navigator>
    );
};
export default DashboardStackGroup;