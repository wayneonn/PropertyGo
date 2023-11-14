import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ViewAppointmentDetail from "../../screens/sideNavigatorBar/Appointment/ViewAppointmentDetail";
import AppointmentMainTabNavigator from './AppointmentMainTabNavigator';
import PropertyUserListing from "../../screens/propertyListings/PropertyUserListing";
import EditPropertyListing from "../../screens/propertyListings/EditPropertyListing";
import SetSchedule from "../../screens/schedule/SetSchedule";
import ViewUserProfile from "../../screens/userProfile/ViewUserProfile";
import Schedule from "../../screens/schedule/SetSchedule";
import Map from "../../screens/propertyListings/map";

import TransactionList from "../../screens/dashboard/transactionList"
import SetSchedulePartner from "../../screens/schedule/SetSchedulePartner";

const AppointmentStack = createNativeStackNavigator();

// This is the Stack Group for Partner Appointments.
// General Flow -> Replace the modal screen for appointments into the Partner Profile.
// Then the Buyer can come back and handle it in the similr way.
const AppointmentStackGroup = () => {

    return (
        <AppointmentStack.Navigator screenOptions={{headerShown: false}}>
            {/* <AppointmentStack.Screen name={"Appointment Main"} component={AppointmentMain}/> */}
            <AppointmentStack.Screen name={"Appointment Main"} component={AppointmentMainTabNavigator}/>
            <AppointmentStack.Screen name="View Profile" component={ViewUserProfile}/>
            <AppointmentStack.Screen name="View Appointment Detail" component={ViewAppointmentDetail}/>
            <AppointmentStack.Screen name="Property Listing" component={PropertyUserListing}/>
            <AppointmentStack.Screen name="Set Schedule" component={SetSchedulePartner}/>
            <AppointmentStack.Screen name="Schedule" component={SchedulePartner}/>
        </AppointmentStack.Navigator>
    );
};
export default AppointmentStackGroup;