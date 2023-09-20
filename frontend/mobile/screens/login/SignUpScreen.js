import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  Image
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { signUpUser } from '../../utils/api';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icon library
import { AuthContext } from '../../AuthContext';
import { loginUser } from '../../utils/api';

const countries = [
  { label: 'Select Country', value: '' },
  { label: 'Singapore', value: 'Singapore' },
  { label: 'Indonesia', value: 'Indonesia' },
  { label: 'Malaysia', value: 'Malaysia' },
];

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isCountryPickerVisible, setCountryPickerVisibility] = useState(false);
  const { login } = useContext(AuthContext); 

  const handleSignUp = async () => {
    if (!userName || !password || !confirmPassword || !email || !selectedCountry || !dateOfBirth) {
      Alert.alert('Sign Up Failed', 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Sign Up Failed', 'Passwords do not match');
      return;
    }

    try {
      const userData = {
        userName,
        password,
        name,
        email,
        countryOfOrigin: selectedCountry.toUpperCase(),
        dateOfBirth: dateOfBirth.toISOString().split('T')[0],
        isActive: true,
        rating: null,
        experience: null,
        projectsCompleted: null,
        companyName: null,
        startTime: null,
        endTime: null,
        contractorSpecialization: null,
        userType: 'BUYER',
      };

      const signUpResult = await signUpUser(userData);

      if (signUpResult.success) {
        handleLogin();
        Alert.alert('Sign Up Successful', 'Signup successful');
        navigation.navigate('Side Navigator');
      } else if (signUpResult.message) {
        if (signUpResult.message.includes('Username')) {
          Alert.alert('Sign Up Failed', 'Username is already taken. Please choose another.');
        } else if (signUpResult.message.includes('Email')) {
          Alert.alert('Sign Up Failed', 'Email is already used. Please use another email address.');
        } else {
          Alert.alert('Sign Up Failed', signUpResult.message);
        }
      } else {
        if (signUpResult.error.includes('Username')) {
          Alert.alert('Sign Up Failed', 'Username is already taken. Please choose another.');
        } else if (signUpResult.error.includes('Email')) {
          Alert.alert('Sign Up Failed', 'Email is already used. Please use another email address.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Sign Up Failed', 'Signup failed');
    }
  };

  const handleLogin = async () => {
    const { success, data, message } = await loginUser(userName, password);

    if (success) {
      login(data); // Use the login function from AuthContext to set the user
      console.log('Login successful');
    } else {
      console.log(message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {/* Icon at the top center */}
        <Image
          source={require('../../assets/PropertyGo-HighRes-Logo.png')} // Replace with the actual path to your image
          style={styles.iconImage}
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="black"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="User Name"
        placeholderTextColor="black"
        value={userName}
        onChangeText={setUserName}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="black"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="black"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="black"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <View style={styles.pickerContainer}>
        {/* Date of Birth Picker */}
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setDatePickerVisibility(true)}
        >
          <Text style={styles.pickerText}>
            {dateOfBirth ? dateOfBirth.toDateString() : 'Date of Birth'}
          </Text>
        </TouchableOpacity>
        <Modal
          transparent={true}
          animationType="slide"
          visible={isDatePickerVisible}
          onRequestClose={() => setDatePickerVisibility(false)}
        >
          <View style={styles.modalView}>
            <DateTimePicker
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={(date) => {
                setDateOfBirth(date);
                setDatePickerVisibility(false);
              }}
              onCancel={() => setDatePickerVisibility(false)}
            />
          </View>
        </Modal>
      </View>
      <View style={styles.pickerContainer}>
        {/* Country Picker */}
        <TouchableOpacity
          style={styles.countryPickerButton}
          onPress={() => setCountryPickerVisibility(true)}
        >
          <Text style={styles.pickerText}>
            {selectedCountry || 'Select Country'}
          </Text>
        </TouchableOpacity>
        <Modal
          transparent={true}
          animationType="slide"
          visible={isCountryPickerVisible}
          onRequestClose={() => setCountryPickerVisibility(false)}
        >
          <View style={styles.modalView}>
            <Picker
              selectedValue={selectedCountry}
              onValueChange={(itemValue) => {
                setSelectedCountry(itemValue);
                setCountryPickerVisibility(false);
              }}
            >
              {countries.map((country) => (
                <Picker.Item
                  key={country.value}
                  label={country.label}
                  value={country.value}
                />
              ))}
            </Picker>
          </View>
        </Modal>
      </View>
      <View style={styles.buttonContainer}>
        {/* Shifted "Sign Up" button below */}
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  iconContainer: {
    alignItems: 'center', // Center the icon horizontally
    marginTop: 10, // Add some top margin
    marginBottom: 20, // Add some bottom margin
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    color: 'black',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  datePickerButton: {
    flex: 1,
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    justifyContent: 'center',
  },
  countryPickerButton: {
    flex: 1,
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    justifyContent: 'center',
  },
  pickerText: {
    fontSize: 16,
    color: 'black',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  buttonContainer: {
    flex: 1, // Ensure the button container takes remaining space
    justifyContent: 'flex-end', // Push the button to the bottom
  },
  signUpButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 25,
    backgroundColor: '#1E90FF',
    marginVertical: 10,
  },
  signUpButtonText: {
    fontSize: 18,
    color: 'white',
  },
  iconImage: {
    width: 60, // Adjust the width and height as needed
    height: 60,
  },
});

export default SignUpScreen;
