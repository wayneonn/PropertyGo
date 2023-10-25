import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import PropertyListing from "../screens/propertyListings/PropertyListings";
import PropertyListing from "../screens/propertyListings/PropertyListing";
import EditPropertyListing from "../screens/propertyListings/EditPropertyListing";
import PropertiesList from "../screens/propertyListings/PropertiesList";
import ViewUserProfile from "../screens/userProfile/ViewUserProfile";
import TokenScreen from "../screens/token/TokenScreen"; // Import your Coins screen here
import TokenCheckoutScreen from "../screens/token/TokenCheckoutScreen"; 
import SearchResults from '../screens/propertyListings/SearchResults';
import BoostProfileListing from "../screens/dashboard/BoostProfileListing";
import Map from "../screens/propertyListings/map";
import HomePagePartner from "../screens/userBottomNavBar/HomePagePartner";
import {PhotoGalleryUpload} from "../screens/dashboard/PhotoGalleryUpload";

const HomeListingsStack = createNativeStackNavigator();

// This is the Partner Home Stack.
// I need to change the HomePage
const HomeListingsStackGroup = () => {

    return (

        <HomeListingsStack.Navigator screenOptions={{ headerShown: false }}>
            {/* Adjust accordingly */}
            {/* <PropertyListingsStack.Screen name="Map" component={Map}/> */}
            <HomeListingsStack.Screen name="List Property" component={HomePagePartner}/>
            <HomeListingsStack.Screen name="View Profile" component={ViewUserProfile}/>
            <HomeListingsStack.Screen name="Token" component={TokenScreen}/>
            <HomeListingsStack.Screen name="Token Checkout Screen" component={TokenCheckoutScreen}/>
            <HomeListingsStack.Screen name="Boost Listing" component={BoostProfileListing}/>
            <HomeListingsStack.Screen name="Search Results" component={SearchResults}/>
            <HomeListingsStack.Screen name={"Upload Photos"} component={PhotoGalleryUpload}/>
        </HomeListingsStack.Navigator>
    );
};
export default HomeListingsStackGroup;