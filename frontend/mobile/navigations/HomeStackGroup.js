import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import PropertyListing from "../screens/propertyListings/PropertyListings";
import HomePage from "../screens/userBottomNavBar/HomePage";
import PropertyListing from "../screens/propertyListings/PropertyListing";
import EditPropertyListing from "../screens/propertyListings/EditPropertyListing";
import PropertiesList from "../screens/propertyListings/PropertiesList";
import ViewUserProfile from "../screens/userProfile/ViewUserProfile";
import TokenScreen from "../screens/token/TokenScreen"; // Import your Coins screen here
import BoostPropertyListing from "../screens/propertyListings/BoostPropertyListing";
import SearchResults from '../screens/propertyListings/SearchResults';
import SetSchedule from "../screens/schedule/SetSchedule";
import Schedule from "../screens/schedule/Schedule";
import PurchaseOptionFee from "../screens/purchaseProperty/PurchaseOptionFee";
import Map from "../screens/propertyListings/map";

const HomeListingsStack = createNativeStackNavigator();

const HomeListingsStackGroup = () => {

    return (

        <HomeListingsStack.Navigator screenOptions={{ headerShown: false }}>
            {/* Adjust accordingly */}
            {/* <PropertyListingsStack.Screen name="Map" component={Map}/> */}
            <HomeListingsStack.Screen name="Home Page" component={HomePage}/>
            <HomeListingsStack.Screen name="Property Listing" component={PropertyListing}/>
            <HomeListingsStack.Screen name="Edit Property Listing" component={EditPropertyListing}/>
            <HomeListingsStack.Screen name="Properties List" component={PropertiesList}/>
            <HomeListingsStack.Screen name="View Profile" component={ViewUserProfile}/>
            <HomeListingsStack.Screen name="Token" component={TokenScreen}/>
            <HomeListingsStack.Screen name="Boost Listing" component={BoostPropertyListing}/>
            <HomeListingsStack.Screen name="Search Results" component={SearchResults}/>
            <HomeListingsStack.Screen name="Set Schedule" component={SetSchedule}/>
            <HomeListingsStack.Screen name="Schedule" component={Schedule}/>
            <HomeListingsStack.Screen name="Purchase Option Fee" component={PurchaseOptionFee}/>
        </HomeListingsStack.Navigator>
    );
};
export default HomeListingsStackGroup;