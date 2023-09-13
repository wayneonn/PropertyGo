import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './components/Account-Access-Module/LoginScreen';
import HomeScreen from './components/Home/HomeScreen';
import HomePage from './components/Home/HomePage';
import GetStarted from './components/Home/GetStarted';
import LoginPortal from './components/Account-Access-Module/LoginPortal';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="Home Page" component={HomePage} />
        <Stack.Screen name="Get Started" component={GetStarted} />
        <Stack.Screen name="Login Portal" component={LoginPortal} />
        <Stack.Screen name="Home Screen" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
