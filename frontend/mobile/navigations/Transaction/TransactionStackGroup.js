import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ViewAppointmentDetail from "../../screens/sideNavigatorBar/Appointment/ViewAppointmentDetail";
import TransactionMainTabNavigator from './TransactionMainTabNavigator';
import TransactionScreen from '../../screens/sideNavigatorBar/Transaction/TransactionScreen';
import SellerUploadOTP from '../../screens/sideNavigatorBar/Transaction/SellerUploadOTP';
import OptionTransactionDetailOrder from '../../screens/sideNavigatorBar/Transaction/OptionTransactionDetailOrder';
import SellerOptionTransactionDetailOrder from '../../screens/sideNavigatorBar/Transaction/SellerOptionTransactionDetailOrder';
import PropertyUserListing from "../../screens/propertyListings/PropertyUserListing";
import EditPropertyUserListing from "../../screens/propertyListings/EditPropertyUserListing";
import ViewUserProfile from "../../screens/userProfile/ViewUserProfile";
import BoostPropertyListing from "../../screens/propertyListings/BoostPropertyListing";
import TokenScreen from "../../screens/token/TokenScreen";
import TokenCheckoutScreen from "../../screens/token/TokenCheckoutScreen"; 
import SetSchedule from "../../screens/schedule/SetSchedule";
import Schedule from "../../screens/schedule/Schedule";

import TransactionList from "../../screens/dashboard/transactionList"

const TransactionStack = createNativeStackNavigator();

const TransactionStackGroup = () => {

    return (
        <TransactionStack.Navigator screenOptions={{headerShown: false}}>
            {/* <AppointmentStack.Screen name={"Appointment Main"} component={AppointmentMain}/> */}
            <TransactionStack.Screen name={"Transaction Main"} component={TransactionMainTabNavigator}/>
            <TransactionStack.Screen name={"Transaction Screen"} component={TransactionScreen}/>
            <TransactionStack.Screen name={"Seller Upload OTP"} component={SellerUploadOTP}/>
            <TransactionStack.Screen name={"Option Transaction Order Screen"} component={OptionTransactionDetailOrder}/>
            <TransactionStack.Screen name={"Seller Option Transaction Order Screen"} component={SellerOptionTransactionDetailOrder}/>
            <TransactionStack.Screen name="Property Listing" component={PropertyUserListing}/>
            <TransactionStack.Screen name="Edit Property User Listing" component={EditPropertyUserListing}/>
            <TransactionStack.Screen name="View Profile" component={ViewUserProfile}/>
            <TransactionStack.Screen name="Boost Listing" component={BoostPropertyListing}/>
            <TransactionStack.Screen name="Token" component={TokenScreen}/>
            <TransactionStack.Screen name="Token Checkout Screen" component={TokenCheckoutScreen}/>
            <TransactionStack.Screen name="Set Schedule" component={SetSchedule}/>
            <TransactionStack.Screen name="Schedule" component={Schedule}/>
        </TransactionStack.Navigator>
    );
};
export default TransactionStackGroup;