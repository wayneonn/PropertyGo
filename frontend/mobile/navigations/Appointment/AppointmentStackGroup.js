import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppointmentMain from "../../screens/sideNavigatorBar/Appointment/Appointments";
import AppointmentMainTabNavigator from './AppointmentMainTabNavigator';
import PropertyListing from "../../screens/propertyListings/PropertyListing";
import EditPropertyListing from "../../screens/propertyListings/EditPropertyListing";
import ViewUserProfile from "../../screens/userProfile/ViewUserProfile";
import BoostPropertyListing from "../../screens/propertyListings/BoostPropertyListing";
import Map from "../../screens/propertyListings/map";

import TransactionList from "../../screens/dashboard/transactionList"

const AppointmentStack = createNativeStackNavigator();

const AppointmentStackGroup = () => {

    return (
        <AppointmentStack.Navigator screenOptions={{headerShown: false}}>
            {/* <AppointmentStack.Screen name={"Appointment Main"} component={AppointmentMain}/> */}
            <AppointmentStack.Screen name={"Appointment Main"} component={AppointmentMainTabNavigator}/>
            <AppointmentStack.Screen name="View Profile" component={ViewUserProfile}/>
        </AppointmentStack.Navigator>
    );
};
export default AppointmentStackGroup;