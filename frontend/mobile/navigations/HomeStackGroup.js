import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import PropertyListing from "../screens/propertyListings/PropertyListings";
import HomePage from "../screens/userBottomNavBar/HomePage";
import PropertyListing from "../screens/propertyListings/PropertyListing";
import PropertiesList from "../screens/propertyListings/PropertiesList";
import ViewUserProfile from "../screens/userProfile/ViewUserProfile";
import Map from "../screens/propertyListings/map";

const HomeListingsStack = createNativeStackNavigator();

const HomeListingsStackGroup = () => {

    return (

        <HomeListingsStack.Navigator screenOptions={{ headerShown: false }}>
            {/* Adjust accordingly */}
            {/* <PropertyListingsStack.Screen name="Map" component={Map}/> */}
            <HomeListingsStack.Screen name="List Property" component={HomePage}/>
            <HomeListingsStack.Screen name="Property Listing" component={PropertyListing}/>
            <HomeListingsStack.Screen name="Properties List" component={PropertiesList}/>
            <HomeListingsStack.Screen name="View Profile" component={ViewUserProfile}/>
        </HomeListingsStack.Navigator>
    );
};
export default HomeListingsStackGroup;