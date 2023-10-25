import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import PropertyListing from "../screens/propertyListings/PropertyListings";
import Favourite from "../screens/userBottomNavBar/Favourite";
import PropertyListing from "../screens/propertyListings/PropertyListing";
import EditPropertyListing from "../screens/propertyListings/EditPropertyListing";
import ViewUserProfile from "../screens/userProfile/ViewUserProfile";
import Map from "../screens/propertyListings/map";
import TokenScreen from "../screens/token/TokenScreen"; // Import your Coins screen here
import TokenCheckoutScreen from "../screens/token/TokenCheckoutScreen"; 

const FavouriteStack = createNativeStackNavigator();

const FavouriteStackGroup = () => {

    return (

        <FavouriteStack.Navigator screenOptions={{ headerShown: false }}>
            {/* Adjust accordingly */}
            {/* <PropertyListingsStack.Screen name="Map" component={Map}/> */}
            <FavouriteStack.Screen name="Favourite" component={Favourite}/>
            <FavouriteStack.Screen name="Property Listing" component={PropertyListing}/>
            <FavouriteStack.Screen name="Edit Property Listing" component={EditPropertyListing}/>
            <FavouriteStack.Screen name="View Profile" component={ViewUserProfile}/>
            <FavouriteStack.Screen name="Token" component={TokenScreen}/>
            <FavouriteStack.Screen name="Token Checkout Screen" component={TokenCheckoutScreen}/>
        </FavouriteStack.Navigator>
    );
};
export default FavouriteStackGroup;