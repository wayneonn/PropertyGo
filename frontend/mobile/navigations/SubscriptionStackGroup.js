import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import PropertyListing from "../screens/propertyListings/PropertyListings";
import SubscriptionMainPage from "../screens/partnerApplication/SubscriptionMainPage";
import PartnerSubscriptionCheckoutScreen from "../screens/purchase/PartnerSubscriptionCheckoutScreen";
import PropertyUserListing from "../screens/propertyListings/PropertyUserListing";
import EditPropertyUserListing from "../screens/propertyListings/EditPropertyUserListing";
import ViewUserProfile from "../screens/userProfile/ViewUserProfile";
import BoostPropertyListing from "../screens/propertyListings/BoostPropertyListing";
import TokenScreen from "../screens/token/TokenScreen";
import SetSchedule from "../screens/schedule/SetSchedule";
import Schedule from "../screens/schedule/Schedule";
import Map from "../screens/propertyListings/map";

const SubscriptionStack = createNativeStackNavigator();

const SubscriptionStackGroup = () => {

    return (

        <SubscriptionStack.Navigator screenOptions={{ headerShown: false }}>
            {/* Adjust accordingly */}
            {/* <PropertyListingsStack.Screen name="Map" component={Map}/> */}
            <SubscriptionStack.Screen name="Subscription Main Page" component={SubscriptionMainPage}/>
            <SubscriptionStack.Screen name="Partner Subscription Checkout Screen" component={PartnerSubscriptionCheckoutScreen}/>
        </SubscriptionStack.Navigator>
    );
};
export default SubscriptionStackGroup;