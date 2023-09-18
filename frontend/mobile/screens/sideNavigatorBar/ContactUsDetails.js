import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import TopBar from '../../components/Common/TopNavBar';

const ContactUsDetails = ({ navigation }) => {
  const navigateToContactUs = () => {
    navigation.navigate('ContactUs');
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopBar />
      <Text style={styles.screenTitle}>ContactUsDetailsScreen</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={navigateToContactUs}
      >
        <Text style={styles.buttonText}>Contact Us Form</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ContactUsDetails;
