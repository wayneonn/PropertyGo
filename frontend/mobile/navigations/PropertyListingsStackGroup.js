import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import PropertyListing from "../screens/propertyListings/PropertyListings";
import ListProperty from "../screens/userBottomNavBar/Sell";
import PropertyListing from "../screens/propertyListings/PropertyListing";

const PropertyListingsStack = createNativeStackNavigator();

const PropertyListingsStackGroup = () => {

    return (

        <PropertyListingsStack.Navigator screenOptions={{ headerShown: false }}>
            {/* Adjust accordingly */}
            <PropertyListingsStack.Screen name="List Property" component={ListProperty}/>
            <PropertyListingsStack.Screen name="Property Listing" component={PropertyListing}/>
        </PropertyListingsStack.Navigator>
    );
};
export default PropertyListingsStackGroup;