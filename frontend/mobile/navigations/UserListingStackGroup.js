import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import PropertyListing from "../screens/propertyListings/PropertyListings";
import UserListings from "../screens/sideNavigatorBar/UserListings";
import PropertyUserListing from "../screens/propertyListings/PropertyUserListing";
import EditPropertyUserListing from "../screens/propertyListings/EditPropertyUserListing";
import ViewUserProfile from "../screens/userProfile/ViewUserProfile";
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
        </UserListingStack.Navigator>
    );
};
export default UserListingStackGroup;