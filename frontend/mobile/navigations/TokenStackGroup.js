import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TokenScreen from "../screens/token/TokenScreen"; // Import your Coins screen here
import TokenCheckoutScreen from "../screens/token/TokenCheckoutScreen"; 

const CoinsStack = createNativeStackNavigator();

const TokenStackGroup = () => {
  return (
    <TokenStack.Navigator screenOptions={{ headerShown: false }}>
      <TokenStack.Screen name="Token" component={TokenScreen} />
      <TokenStack.Screen name="Token Checkout Screen" component={TokenCheckoutScreen}/>
      {/* Add more screens for your Coins section as needed */}
    </TokenStack.Navigator>
  );
};

export default TokenStackGroup;
