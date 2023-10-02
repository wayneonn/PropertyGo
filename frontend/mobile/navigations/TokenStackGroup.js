import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TokenScreen from "../screens/token/TokenScreen"; // Import your Coins screen here

const CoinsStack = createNativeStackNavigator();

const TokenStackGroup = () => {
  return (
    <TokenStack.Navigator screenOptions={{ headerShown: false }}>
      <TokenStack.Screen name="Token" component={TokenScreen} />
      {/* Add more screens for your Coins section as needed */}
    </TokenStack.Navigator>
  );
};

export default TokenStackGroup;
