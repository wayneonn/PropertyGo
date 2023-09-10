import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Welcome to PropertyGo</Text>
      <Text style={styles.detailText}>To access all features, please log in.</Text>
      <Button
        title="Go to Login"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    justifyContent: 'center', // Center content vertically
    alignItems: 'center',     // Center content horizontally
  },
  headerText: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center', // Center text
  },
  detailText: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center', // Center text
  },
});

export default HomeScreen;
