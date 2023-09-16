import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { signUpUser } from '../../utils/api';
import { useNavigation } from '@react-navigation/native';

const countries = [
  { label: 'Select Country', value: '' },
  { label: 'Singapore', value: 'Singapore' },
  { label: 'Indonesia', value: 'Indonesia' },
  { label: 'Malaysia', value: 'Malaysia' },
];

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isCountryPickerVisible, setCountryPickerVisibility] = useState(false);

  const handleSignUp = async () => {
    if (!userName || !password || !confirmPassword || !email || !selectedCountry || !dateOfBirth) {
      alert('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const userData = {
        userName,
        password,
        name: 'Emily Brown',
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
        alert('Signup successful');
        // Navigate to the Home Screen on successful signup
        navigation.navigate('Home');
      } else {
        alert(signUpResult.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Signup failed');
    }
  };

  return (
    <View style={styles.container}>
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
      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpButtonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  signUpButton: {
    height: 50,
    borderRadius: 25,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpButtonText: {
    fontSize: 18,
    color: 'white',
  },
});

export default SignUpScreen;
