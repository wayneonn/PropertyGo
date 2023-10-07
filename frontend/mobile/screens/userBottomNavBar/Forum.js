import React from 'react';
import { TouchableOpacity, Text, SafeAreaView, View, StyleSheet, ImageBackground } from 'react-native';

const Forum = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../../assets/GBTB.jpg')}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>          
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Forum Side Navigator')}
          >
            <Text style={styles.text}>Welcome to the Forum!</Text>
            <Text style={styles.buttonText}>Go to Forum Page</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  text: {
    fontSize: 23,
    marginBottom: 20,
    fontWeight:"bold"
  },
  button: {
    width: 280, 
    height: 280,
    borderRadius: 140, 
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: 'blue',
  },
});

export default Forum;
