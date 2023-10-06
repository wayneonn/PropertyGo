import React, {useContext, useEffect, useState} from 'react';
import {Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import {AuthContext} from '../../AuthContext';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {Picker} from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import {loginUser, updateUserProfile, updateUserProfilePicture} from '../../utils/api';
import base64 from 'react-native-base64';
import {Ionicons} from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';

const countries = [
    {label: 'Select Country', value: ''},
    {label: 'Singapore', value: 'Singapore'},
    {label: 'Indonesia', value: 'Indonesia'},
    {label: 'Malaysia', value: 'Malaysia'},
];

function EditProfile({navigation, route}) {
    const {user, login, upd} = useContext(AuthContext);

    const [editedUser, setEditedUser] = useState({
        name: user.user.name,
        email: user.user.email,
        countryOfOrigin: user.user.countryOfOrigin,
        dateOfBirth: user.user.dateOfBirth,
    });

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isCountryPickerVisible, setCountryPickerVisibility] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [profileImageBase64, setProfileImageBase64] = useState(null);

    useEffect(() => {
        let profileImageBase64;
        if (user && user.user.profileImage && user.user.profileImage.data) {
            profileImageBase64 = base64.encodeFromByteArray(user.user.profileImage.data);
        }
        setProfileImageBase64(profileImageBase64);
    }, [user]);

    useEffect(() => {
        if (profileImageBase64) {
            setProfileImage(`data:image/jpeg;base64,${profileImageBase64}`);
        }
    }, [profileImageBase64]);

    const handleInputChange = (field, value) => {
        setEditedUser({...editedUser, [field]: value});
    };

    const openDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const handleDateConfirm = (date) => {
        setEditedUser({...editedUser, dateOfBirth: date.toISOString().split('T')[0]});
        setDatePickerVisibility(false);
    };

    const handleCountryChange = (itemValue) => {
        setEditedUser({...editedUser, countryOfOrigin: itemValue});
        setCountryPickerVisibility(false);
    };

    const fetchUpdatedUserDetailsImage = async () => {
        try {
            const {success, data, message} = await loginUser(user.user.userName, user.user.password);

            if (success) {
                login(data);
            } else {
                Alert.alert('Error', message);
            }
        } catch (error) {
            console.error('Error fetching updated user details:', error);
        }
    };

    const fetchUpdatedUserDetails = async () => {
        try {
            const {success, data, message} = await loginUser(user.user.userName, user.user.password);

            if (success) {
                login(data);
            } else {
                Alert.alert('Error', message);
            }
        } catch (error) {
            console.error('Error fetching updated user details:', error);
        }
    };

    const saveChanges = async () => {
        // Add email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!editedUser.name || !editedUser.email || !editedUser.dateOfBirth || !editedUser.countryOfOrigin) {
            Alert.alert('Sign Up Failed', 'Please fill in all fields.');
            return;
        }

        if (!emailPattern.test(editedUser.email)) {
            Alert.alert('Sign Up Failed', 'Please enter a valid email address.');
            return;
        }

        const today = new Date();
        const dob = new Date(editedUser.dateOfBirth);
        let age = today.getFullYear() - dob.getFullYear();

        if (today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
            age--;
        }

        if (age < 21) {
            Alert.alert('Sign Up Failed', 'You must be at least 21 years old to sign up.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', editedUser.name);
            formData.append('email', editedUser.email);
            formData.append('countryOfOrigin', editedUser.countryOfOrigin);
            formData.append('dateOfBirth', editedUser.dateOfBirth);

            const {success, data, message} = await updateUserProfile(user.user.userId, formData);

            if (success) {
                if (profileImage) {
                    const response = await updateUserProfilePicture(user.user.userId, profileImage);

                    if (response.success) {

                        fetchUpdatedUserDetails();
                        Alert.alert('Success', 'Profile updated successfully!');
                    } else {
                        Alert.alert('Error', response.message || 'Profile update failed.');
                    }
                } else {
                    fetchUpdatedUserDetails();
                }
            } else {
                console.error('Failed to update user profile:', message);
                Alert.alert('Error', message || 'Profile update failed.');
            }
        } catch (error) {
            console.error('Error updating user profile:', error);
        }
    };

    const chooseImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.2,
            });

            if (!result.cancelled) {
                setProfileImage(result.uri);

                try {
                    const response = await updateUserProfilePicture(user.user.userId, result.uri);

                    if (response.success) {
                        Alert.alert('Success', 'Image uploaded successfully!');
                        fetchUpdatedUserDetailsImage();
                    } else {
                        Alert.alert('Error', response.message || 'Image upload failed.');
                    }
                } catch (error) {
                    console.error('Error uploading image:', error);
                    Alert.alert('Error', 'Image upload failed.');
                }
            }
        } catch (error) {
            console.error('Error picking image:', error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerContainer}>
                {/* Back button */}
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black"/>
                </TouchableOpacity>
                <Text style={styles.header}>Edit Profile</Text>
            </View>

            <View style={styles.profileHeader}>
                <TouchableOpacity onPress={chooseImage}>
                    {profileImage ? (
                        <Image source={{uri: profileImage}} style={styles.profileImage}/>
                    ) : (
                        <View style={styles.profileImagePlaceholder}>
                            <Icon name="user" size={100} color="white"/>
                        </View>
                    )}
                </TouchableOpacity>
                <Text style={styles.heading}>User Profile</Text>
            </View>

            <View style={styles.profileInfo}>
                <View style={styles.inputRow}>
                    <Text style={styles.label}>Name:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        value={editedUser.name}
                        onChangeText={(text) => handleInputChange('name', text)}
                    />
                </View>
                <View style={styles.inputRow}>
                    <Text style={styles.label}>Email:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={editedUser.email}
                        onChangeText={(text) => handleInputChange('email', text)}
                    />
                </View>
                <View style={styles.inputRow}>
                    <Text style={styles.label}>Country:</Text>
                    <TouchableOpacity
                        style={styles.countryPickerButton}
                        onPress={() => setCountryPickerVisibility(true)}
                    >
                        <Text style={styles.countryPickerText}>{editedUser.countryOfOrigin}</Text>
                        <Ionicons name="caret-down-outline" size={20} color="black"/>
                    </TouchableOpacity>
                    <Modal
                        transparent={true}
                        animationType="slide"
                        visible={isCountryPickerVisible}
                        onRequestClose={() => setCountryPickerVisibility(false)}
                    >
                        <View style={styles.modalContainer}>
                            <Picker
                                selectedValue={editedUser.countryOfOrigin}
                                onValueChange={handleCountryChange}
                                style={styles.picker}
                            >
                                {countries.map((country, index) => (
                                    <Picker.Item
                                        key={index}
                                        label={country.label}
                                        value={country.value}
                                    />
                                ))}
                            </Picker>
                        </View>
                    </Modal>
                </View>
                <View style={styles.inputRow}>
                    <Text style={styles.label}>Date Of Birth:</Text>
                    <TouchableOpacity onPress={openDatePicker} style={styles.datePicker}>

                        <Text style={styles.datePickerText}>{editedUser.dateOfBirth}</Text>
                        <Ionicons name="calendar-outline" size={20} color="black"/>
                    </TouchableOpacity>
                    <DateTimePicker
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleDateConfirm}
                        onCancel={() => setDatePickerVisibility(false)}
                    />
                </View>
            </View>

            <TouchableOpacity
                style={styles.updatePasswordButton}
                onPress={() => navigation.navigate('UpdatePassword')}
            >
                <Ionicons name="key-outline" size={20} color="white"/>
                <Text style={styles.updatePasswordButtonText}>Update Password</Text>
            </TouchableOpacity>

            {/* Save Changes button with icon */}
            <TouchableOpacity style={styles.saveChangesButton} onPress={saveChanges}>
                <Ionicons name="save-outline" size={18} color="white"/>
                <Text style={styles.saveChangesButtonText}>Save Changes</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 70,
    },
    profileHeader: {
        alignItems: 'center',
        marginTop: 20,
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 120,
    },
    profileImagePlaceholder: {
        width: 150,
        height: 150,
        borderRadius: 120,
        backgroundColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heading: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    profileInfo: {
        marginTop: 20,
    },
    inputRow: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: 20,
        width: '100%',
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
        width: '100%',
    },
    input: {
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        borderColor: 'gray',
        fontSize: 14,
        padding: 10,
        width: '100%',
    },
    countryPickerButton: {
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        borderColor: 'gray',
        fontSize: 14,
        padding: 8,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    countryPickerText: {
        fontSize: 14,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    picker: {
        backgroundColor: 'white',
    },
    datePicker: {
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        borderColor: 'gray',
        fontSize: 14,
        padding: 8,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    datePickerText: {
        fontSize: 14,
    },
    updatePasswordButton: {
        backgroundColor: 'dodgerblue',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center', // Center horizontally
        flexDirection: 'row',
        justifyContent: 'center', // Center vertically
        width: '60%',
        marginLeft: 70,
    },
    updatePasswordButtonText: {
        color: 'white',
        marginLeft: 10,
    },
    saveChangesButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center', // Center horizontally
        flexDirection: 'row',
        justifyContent: 'center', // Center vertically
        width: '60%',
        marginLeft: 70,
    },
    saveChangesButtonText: {
        color: 'white',
        marginLeft: 10,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default EditProfile;
