import {createNativeStackNavigator} from "@react-navigation/native-stack";
import ExploreServicesTabNavigator from "../screens/exploreServices/ExploreServicesTabNavigator";
import ViewUserProfile from "../screens/userProfile/ViewUserProfile";

const ExploreServicesStack = createNativeStackNavigator();

const ExploreServicesStackGroup = () => {
    return (
        <ExploreServicesStack.Navigator screenOptions={{headerShown: false}}>
            {/* Adjust accordingly */}
            <ExploreServicesStack.Screen name="Explore Services" component={ExploreServicesTabNavigator}/>
            <ExploreServicesStack.Screen name="View Profile" component={ViewUserProfile}/>
        </ExploreServicesStack.Navigator>
    );
};
export default ExploreServicesStackGroup;