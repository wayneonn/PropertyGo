import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import PropertyListing from "../screens/propertyListings/PropertyListings";
import PropertyListing from "../screens/propertyListings/PropertyListing";
import EditPropertyListing from "../screens/propertyListings/EditPropertyListing";
import PropertiesList from "../screens/propertyListings/PropertiesList";
import ViewUserProfile from "../screens/userProfile/ViewUserProfile";
import TokenScreen from "../screens/token/TokenScreen"; // Import your Coins screen here
import BoostPropertyListing from "../screens/propertyListings/BoostPropertyListing";
import SearchResults from '../screens/propertyListings/SearchResults';
import Map from "../screens/propertyListings/map";
import HomePagePartner from "../screens/userBottomNavBar/HomePagePartner";

const HomeListingsStack = createNativeStackNavigator();

// This is the Partner Home Stack.
// I need to change the HomePage
const HomeListingsStackGroup = () => {

    return (

        <HomeListingsStack.Navigator screenOptions={{ headerShown: false }}>
            {/* Adjust accordingly */}
            {/* <PropertyListingsStack.Screen name="Map" component={Map}/> */}
            <HomeListingsStack.Screen name="List Property" component={HomePagePartner}/>
            <HomeListingsStack.Screen name="Property Listing" component={PropertyListing}/>
            <HomeListingsStack.Screen name="Edit Property Listing" component={EditPropertyListing}/>
            <HomeListingsStack.Screen name="Properties List" component={PropertiesList}/>
            <HomeListingsStack.Screen name="View Profile" component={ViewUserProfile}/>
            <HomeListingsStack.Screen name="Token" component={TokenScreen}/>
            <HomeListingsStack.Screen name="Boost Listing" component={BoostPropertyListing}/>
            <HomeListingsStack.Screen name="Search Results" component={SearchResults}/>
        </HomeListingsStack.Navigator>
    );
};
export default HomeListingsStackGroup;