import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import PropertyListing from "../screens/propertyListings/PropertyListings";
import HomePage from "../screens/userBottomNavBar/HomePage";
import PropertyListing from "../screens/propertyListings/PropertyListing";
import EditPropertyListing from "../screens/propertyListings/EditPropertyListing";
import PropertiesList from "../screens/propertyListings/PropertiesList";
import ViewUserProfile from "../screens/userProfile/ViewUserProfile";
import TokenScreen from "../screens/token/TokenScreen"; // Import your Coins screen here
import TokenCheckoutScreen from "../screens/token/TokenCheckoutScreen"; 
import BoostPropertyListing from "../screens/propertyListings/BoostPropertyListing";
import SearchResults from '../screens/propertyListings/SearchResults';
import SetSchedule from "../screens/schedule/SetSchedule";
import Schedule from "../screens/schedule/Schedule";
import PurchaseOptionFee from "../screens/purchase/PurchaseOptionFeeCheckoutScreen";
import PurchaseOptionFeeInfo from "../screens/purchase/PurchaseOptionFeeInfo";
import ViewAppointmentDetail from "../screens/sideNavigatorBar/Appointment/ViewAppointmentDetail";
import Map from "../screens/propertyListings/map";
import OptionTransactionDetailOrder from '../screens/sideNavigatorBar/Transaction/OptionTransactionDetailOrder';
import SellerOptionTransactionDetailOrder from '../screens/sideNavigatorBar/Transaction/SellerOptionTransactionDetailOrder';
import ChatTabNavigator from "./ChatTabNavigator";
import BuyerUploadOTP from '../screens/sideNavigatorBar/Transaction/BuyerUploadOTP';
import Message from "../screens/chat/Message";

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
            <HomeListingsStack.Screen name="Token Checkout Screen" component={TokenCheckoutScreen}/>
            <HomeListingsStack.Screen name="Boost Listing" component={BoostPropertyListing}/>
            <HomeListingsStack.Screen name="Search Results" component={SearchResults}/>
            <HomeListingsStack.Screen name="Set Schedule" component={SetSchedule}/>
            <HomeListingsStack.Screen name="Schedule" component={Schedule}/>
            <HomeListingsStack.Screen name="View Appointment Detail" component={ViewAppointmentDetail}/>
            <HomeListingsStack.Screen name="Purchase Option Fee" component={PurchaseOptionFee}/>
            <HomeListingsStack.Screen name="Purchase Option Fee Info" component={PurchaseOptionFeeInfo}/>
            <HomeListingsStack.Screen name={"Option Transaction Order Screen"} component={OptionTransactionDetailOrder}/>
            <HomeListingsStack.Screen name={"Seller Option Transaction Order Screen"} component={SellerOptionTransactionDetailOrder}/>
            <HomeListingsStack.Screen name="Chat" component={ChatTabNavigator}/>
            <HomeListingsStack.Screen name={"Buyer Upload OTP"} component={BuyerUploadOTP}/>
            {/* <HomeListingsStack.Screen name="Message" component={Message}/> */}
        </HomeListingsStack.Navigator>
    );
};
export default HomeListingsStackGroup;