import { createNativeStackNavigator } from "@react-navigation/native-stack";
import propertyListings from "../screens/propertyListings/PropertyListings";

const PropertyListingsStack = createNativeStackNavigator();

const PropertyListingsStackGroup = () => {

    return (

        <PropertyListingsStack.Navigator screenOptions={{ headerShown: false }}>
            {/* Adjust accordingly */}
            <PropertyListingsStack.Screen name="property Listings" component={propertyListings}/>
        </PropertyListingsStack.Navigator>
    );
};
export default PropertyListingsStackGroup;