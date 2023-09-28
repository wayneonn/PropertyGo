import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import PropertyListing from "../screens/propertyListings/PropertyListings";
import Favourite from "../screens/userBottomNavBar/Favourite";
import PropertyListing from "../screens/propertyListings/PropertyListing";
import ViewUserProfile from "../screens/userProfile/ViewUserProfile";
import Map from "../screens/propertyListings/map";

const FavouriteStack = createNativeStackNavigator();

const FavouriteStackGroup = () => {

    return (

        <FavouriteStack.Navigator screenOptions={{ headerShown: false }}>
            {/* Adjust accordingly */}
            {/* <PropertyListingsStack.Screen name="Map" component={Map}/> */}
            <FavouriteStack.Screen name="Favourite" component={Favourite}/>
            <FavouriteStack.Screen name="Property Listing" component={PropertyListing}/>
            <FavouriteStack.Screen name="View Profile" component={ViewUserProfile}/>
        </FavouriteStack.Navigator>
    );
};
export default FavouriteStackGroup;