import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import PropertyListing from "../screens/propertyListings/PropertyListings";
import UserListings from "../screens/sideNavigatorBar/UserListings";
import PropertyUserListing from "../screens/propertyListings/PropertyUserListing";
import EditPropertyUserListing from "../screens/propertyListings/EditPropertyUserListing";
import ViewUserProfile from "../screens/userProfile/ViewUserProfile";
import BoostPropertyListing from "../screens/propertyListings/BoostPropertyListing";
import TokenScreen from "../screens/token/TokenScreen";
import TokenCheckoutScreen from "../screens/token/TokenCheckoutScreen"; 
import SetSchedule from "../screens/schedule/SetSchedule";
import Schedule from "../screens/schedule/Schedule";
import Map from "../screens/propertyListings/map";

const UserListingStack = createNativeStackNavigator();

const UserListingStackGroup = () => {

    return (

        <UserListingStack.Navigator screenOptions={{ headerShown: false }}>
            {/* Adjust accordingly */}
            {/* <PropertyListingsStack.Screen name="Map" component={Map}/> */}
            <UserListingStack.Screen name="Favourite" component={UserListings}/>
            <UserListingStack.Screen name="Property Listing" component={PropertyUserListing}/>
            <UserListingStack.Screen name="Edit Property User Listing" component={EditPropertyUserListing}/>
            <UserListingStack.Screen name="View Profile" component={ViewUserProfile}/>
            <UserListingStack.Screen name="Boost Listing" component={BoostPropertyListing}/>
            <UserListingStack.Screen name="Token" component={TokenScreen}/>
            <UserListingStack.Screen name="Token Checkout Screen" component={TokenCheckoutScreen}/>
            <UserListingStack.Screen name="Set Schedule" component={SetSchedule}/>
            <UserListingStack.Screen name="Schedule" component={Schedule}/>
        </UserListingStack.Navigator>
    );
};
export default UserListingStackGroup;