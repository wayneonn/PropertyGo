import React, { useContext, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    Modal,
    Alert,
} from 'react-native';
import { AuthContext } from '../../AuthContext';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { updateUserProfile } from '../../utils/api';
import { updateUserProfilePicture, loginUser } from '../../utils/api';
import base64 from 'react-native-base64';
import { Ionicons } from '@expo/vector-icons';

const countries = [
    { label: 'Select Country', value: '' },
    { label: 'Singapore', value: 'Singapore' },
    { label: 'Indonesia', value: 'Indonesia' },
    { label: 'Malaysia', value: 'Malaysia' },
];

function EditProfile({ navigation, route }) {
    const { user, login, upd } = useContext(AuthContext);

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
        setEditedUser({ ...editedUser, [field]: value });
    };

    const openDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const handleDateConfirm = (date) => {
        setEditedUser({ ...editedUser, dateOfBirth: date.toISOString().split('T')[0] });
        setDatePickerVisibility(false);
    };

    const handleCountryChange = (itemValue) => {
        setEditedUser({ ...editedUser, countryOfOrigin: itemValue });
        setCountryPickerVisibility(false);
    };

    const fetchUpdatedUserDetailsImage = async () => {
        try {
            const { success, data, message } = await loginUser(user.user.userName, user.user.password);

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
            const { success, data, message } = await loginUser(user.user.userName, user.user.password);

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
        try {
            const formData = new FormData();
            formData.append('name', editedUser.name);
            formData.append('email', editedUser.email);
            formData.append('countryOfOrigin', editedUser.countryOfOrigin);
            formData.append('dateOfBirth', editedUser.dateOfBirth);

            // Call the updateUserProfile function to update user profile data
            const { success, data, message } = await updateUserProfile(user.user.userId, formData);

            if (success) {
                // If the profile update is successful, also update the profile picture
                if (profileImage) {
                    const response = await updateUserProfilePicture(user.user.userId, profileImage);

                    if (response.success) {
                        fetchUpdatedUserDetails();
                        Alert.alert('Success', 'Profile updated successfully!');
                    } else {
                        Alert.alert('Error', response.message || 'Profile update failed.');
                    }
                } else {
                    // If no profile image is selected, only update the profile data
                    fetchUpdatedUserDetails();
                }
            } else {
                console.error('Failed to update user profile:', message);
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
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                {/* Back button */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <Text style={styles.header}>Edit Profile</Text>
            <View style={styles.profileHeader}>
                <TouchableOpacity onPress={chooseImage}>
                    {profileImage ? (
                        <Image source={{ uri: profileImage }} style={styles.profileImage} />
                    ) : profileImageBase64 ? (
                        <Image source={{ uri: `data:image/jpeg;base64,${profileImageBase64}` }} style={styles.profileImage} />
                    ) : (
                        <View style={styles.defaultProfileImage}>
                            <Text style={styles.defaultProfileText}>Upload Image</Text>
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
                        <Text style={styles.value}>{editedUser.countryOfOrigin || 'Select Country'}</Text>
                        <Ionicons name="caret-down-outline" size={20} color="grey" />
                    </TouchableOpacity>
                    <Modal
                        transparent={true}
                        animationType="slide"
                        visible={isCountryPickerVisible}
                        onRequestClose={() => setCountryPickerVisibility(false)}
                    >
                        <View style={styles.modalView}>
                            <Picker
                                selectedValue={editedUser.countryOfOrigin}
                                onValueChange={handleCountryChange}
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
                <View style={styles.inputRow}>
                    <Text style={styles.label}>Date Of Birth:</Text>
                    <TouchableOpacity onPress={openDatePicker} style={styles.datePicker}>
                        <Text style={styles.value}>{editedUser.dateOfBirth}</Text>
                        <Ionicons name="calendar" size={20} color="grey" style={styles.calendarIcon} />
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
                <Ionicons name="key-outline" size={24} color="white" />
                <Text style={styles.updatePasswordButtonText}>Update Password</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.editProfileButton} onPress={saveChanges}>
                <Text style={styles.editProfileButtonText}>Save Changes</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 200,
        height: 200,
        borderRadius: 120,
    },
    defaultProfileImage: {
        width: 200,
        height: 200,
        borderRadius: 120,
        backgroundColor: 'lightgray',
        justifyContent: 'center',
        alignItems: 'center',
    },
    defaultProfileText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 16,
    },
    profileInfo: {
        marginTop: 20,
        paddingHorizontal: 20,
        width: '100%', // Set width to 100% for consistent sizing
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 35,
        width: '100%', // Set width to 100% for consistent sizing
        justifyContent: 'space-between', // To evenly distribute label and input
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'right', // Align labels to the right
        width: '30%', // Adjust label width as needed
    },
    input: {
        flex: 1,
        borderBottomWidth: 0.5,
        borderColor: 'gray',
        fontSize: 16,
        padding: 5,
        marginLeft: 20,
    },
    countryPickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 35,
        width: '65%', // Set width to 100% for consistent sizing
        borderColor: 'gray',
        borderWidth: 0.5,
        paddingLeft: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 5,
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    editProfileButton: {
        backgroundColor: '#1E90FF',
        padding: 12,
        borderRadius: 8,
        width: '90%',
        marginTop: 20,
    },
    editProfileButtonText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
    },
    loginLink: {
        color: 'blue',
        textDecorationLine: 'underline',
        marginTop: 8,
    },
    datePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'gray',
        borderWidth: 0.5,
        paddingLeft: 10,
        paddingVertical: 5,
        borderRadius: 5,
        width: '65%', // Set width to 100% for consistent sizing
        justifyContent: 'space-between', // To evenly distribute date and icon
    },
    calendarIcon: {
        marginRight: 10,
    },
    updatePasswordButton: {
        backgroundColor: '#FF6347',
        padding: 10,
        borderRadius: 8,
        width: '90%',
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    updatePasswordButtonText: {
        color: 'white',
        fontSize: 18,
        marginLeft: 8,
        textAlign: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 40,
    },
    backButton: {
        marginRight: 360,
        marginTop: -70,
    },
    header: {
        fontSize: 34,
        fontWeight: 'bold',
        marginBottom: 50,
        marginTop: -50,
        textAlign: 'center',
    },
});


export default EditProfile;
