import {createNativeStackNavigator} from "@react-navigation/native-stack";
import ExploreServices from "../screens/exploreServices/ExploreServices";

const ExploreServicesStack = createNativeStackNavigator();

const ExploreServicesStackGroup = () => {

    return (

        <ExploreServicesStack.Navigator screenOptions={{headerShown: false}}>
            {/* Adjust accordingly */}
            <ExploreServicesStack.Screen name="Explore Services" component={ExploreServices}/>
        </ExploreServicesStack.Navigator>
    );
};
export default ExploreServicesStackGroup;