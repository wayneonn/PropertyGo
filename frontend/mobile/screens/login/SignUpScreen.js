import React, {useContext, useState} from 'react';
import {Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import {AuthContext} from '../../AuthContext';
import {loginUser, signUpUser} from '../../utils/api';
import {useNavigation} from '@react-navigation/native';

const countries = [
    {label: 'Select Country', value: ''},
    {label: 'Singapore', value: 'Singapore'},
    {label: 'Indonesia', value: 'Indonesia'},
    {label: 'Malaysia', value: 'Malaysia'},
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
    const [showPassword, setShowPassword] = useState(false); // Added showPassword state
    const {login} = useContext(AuthContext);

    const handleSignUp = async () => {
        // Add email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (
            !userName ||
            !password ||
            !confirmPassword ||
            !email ||
            !selectedCountry ||
            !dateOfBirth
        ) {
            Alert.alert('Sign Up Failed', 'Please fill in all fields.');
            return;
        }

        if (!emailPattern.test(email)) {
            Alert.alert('Sign Up Failed', 'Please enter a valid email address.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Sign Up Failed', 'Passwords do not match');
            return;
        }

        const today = new Date();
        const dob = new Date(dateOfBirth);
        let age = today.getFullYear() - dob.getFullYear();

        if (
            today.getMonth() < dob.getMonth() ||
            (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
        ) {
            age--;
        }

        if (age < 21) {
            Alert.alert('Sign Up Failed', 'You must be at least 21 years old to sign up.');
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
        const {success, data, message} = await loginUser(userName, password);

        if (success) {
            login(data); // Use the login function from AuthContext to set the user
            console.log('Login successful');
        } else {
            console.log(message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerContainer}>
                <Image
                    source={require('../../assets/PropertyGo-HighRes-Logo.png')}
                    style={styles.headerImage}
                />
                <Text style={styles.headerText}>Sign Up</Text>
            </View>
            <View style={styles.formContainer}>
                <View style={styles.inputRow}>
                    <Text style={styles.label}>Full Name:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        placeholderTextColor="black"
                        value={name}
                        onChangeText={setName}
                    />
                </View>
                <View style={styles.inputRow}>
                    <Text style={styles.label}>User Name:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="User Name"
                        placeholderTextColor="black"
                        value={userName}
                        onChangeText={setUserName}
                    />
                </View>
                <View style={styles.inputRow}>
                    <Text style={styles.label}>Password:</Text>
                    <View style={styles.passwordInputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="black"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword} // Toggle secureTextEntry based on showPassword
                        />
                        <TouchableOpacity
                            style={styles.passwordIcon}
                            onPress={() => setShowPassword(!showPassword)} // Toggle showPassword state
                        >
                            <Icon
                                name={showPassword ? 'eye' : 'eye-slash'}
                                size={20}
                                color="black"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.inputRow}>
                    <Text style={styles.label}>Confirm Password:</Text>
                    <View style={styles.passwordInputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            placeholderTextColor="black"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showPassword} // Toggle secureTextEntry based on showPassword
                        />
                    </View>
                </View>
                <View style={styles.inputRow}>
                    <Text style={styles.label}>Email:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="black"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                </View>
                <View style={styles.inputRow}>
                    <Text style={styles.label}>Date of Birth:</Text>
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
                <View style={styles.inputRow}>
                    <Text style={styles.label}>Country:</Text>
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
            </View>
            <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
                <View style={styles.buttonContent}>
                    <Icon name="user-plus" size={24} color="white" style={styles.icon}/>
                    <Text style={styles.signUpButtonText}>Sign Up</Text>
                </View>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerImage: {
        width: 60,
        height: 60,
        marginRight: 10,
        marginTop: 10,
        marginBottom: 10,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    formContainer: {
        width: '100%',
    },
    inputRow: {
        marginBottom: 10,
        width: '100%',
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        fontSize: 14, // Match the font size
    },
    passwordInputContainer: {
        position: 'relative',
    },
    passwordIcon: {
        position: 'absolute',
        right: 10,
        top: '45%',
        transform: [{translateY: -12}],
    },
    datePickerButton: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 10,
        justifyContent: 'center',
        borderRadius: 5, // Add border radius
    },
    countryPickerButton: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 10,
        justifyContent: 'center',
        borderRadius: 5, // Add border radius
    },
    pickerText: {
        fontSize: 14,
        color: 'black',
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    signUpButton: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#1E90FF',
        marginVertical: 10,
        width: '60%',
    },
    signUpButtonText: {
        fontSize: 18,
        color: 'white',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginLeft: 10,
    },
});

export default SignUpScreen;
