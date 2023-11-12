import {createNativeStackNavigator} from "@react-navigation/native-stack";
import ExploreServices from "../screens/exploreServices/ExploreServices";
import ViewUserProfile from "../screens/userProfile/ViewUserProfile";

const ExploreServicesStack = createNativeStackNavigator();

const ExploreServicesStackGroup = () => {

    return (

        <ExploreServicesStack.Navigator screenOptions={{headerShown: false}}>
            {/* Adjust accordingly */}
            <ExploreServicesStack.Screen name="Explore Services" component={ExploreServices}/>
            <ExploreServicesStack.Screen name="View Profile" component={ViewUserProfile}/>
        </ExploreServicesStack.Navigator>
    );
};
export default ExploreServicesStackGroup;