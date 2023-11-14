import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ViewUserProfile from "../screens/userProfile/ViewUserProfile";
import TransactionList from "../screens/dashboard/transactionList"
import TransactionTabNavigator from "../screens/dashboard/TransactionTabNavigator";
import RequestListing from "../screens/dashboard/RequestListing";

const DashboardStack = createNativeStackNavigator();

const DashboardStackGroup = () => {

    return (
        <DashboardStack.Navigator screenOptions={{headerShown: false}}>
            {/* Adjust accordingly */}
            {/* <PropertyListingsStack.Screen name="Map" component={Map}/> */}
            <DashboardStack.Screen name={"Top Transactions"} component={TransactionTabNavigator}/>
            <DashboardStack.Screen name={"View Profile"} component={ViewUserProfile}/>
            <DashboardStack.Screen name={"View Request"} component = {RequestListing}/>
        </DashboardStack.Navigator>
    );
};
export default DashboardStackGroup;