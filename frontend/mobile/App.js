import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {AuthProvider} from './AuthContext';
import LoginNavigator from './navigations/LoginNavigator';
import { PaperProvider } from 'react-native-paper';

const Stack = createStackNavigator();

function App() {
    return (
        <PaperProvider>
            <AuthProvider>
                <NavigationContainer>
                    <LoginNavigator/>
                </NavigationContainer>
            </AuthProvider>
        </PaperProvider>
    );
}

export default App;


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
