import React, { useContext, useState, useEffect, ActivityIndicator } from 'react';
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
import { updateUserProfilePicture } from '../../utils/api';
import base64 from 'react-native-base64';


const countries = [
    { label: 'Select Country', value: '' },
    { label: 'Singapore', value: 'Singapore' },
    { label: 'Indonesia', value: 'Indonesia' },
    { label: 'Malaysia', value: 'Malaysia' },
];

function EditProfile({ navigation, route }) {
    const { user } = useContext(AuthContext);

    const [editedUser, setEditedUser] = useState({
        name: user.user.name,
        email: user.user.email,
        countryOfOrigin: user.user.countryOfOrigin,
        dateOfBirth: user.user.dateOfBirth,
    });

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isCountryPickerVisible, setCountryPickerVisibility] = useState(false);
    const [profileImage, setProfileImage] = useState(null);

    // Get the profileImageBase64 prop from route.params

    const [profileImageBase64, setProfileImageBase64] = useState(null);

    useEffect(() => {
        let profileImageBase64;
        if (user && user.user.profileImage && user.user.profileImage.data) {
            profileImageBase64 = base64.encodeFromByteArray(user.user.profileImage.data);
        }
        setProfileImageBase64(profileImageBase64);
    }, [user]);


    useEffect(() => {
        // Update profileImage when profileImageBase64 changes
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

    const saveChanges = async () => {
        try {
            const formData = new FormData();
            formData.append('name', editedUser.name);
            formData.append('email', editedUser.email);
            formData.append('countryOfOrigin', editedUser.countryOfOrigin);
            formData.append('dateOfBirth', editedUser.dateOfBirth);

            if (profileImage) {
                const response = await fetch(profileImage);
                const blob = await response.blob();
                formData.append('profileImage', blob, 'profile.jpg');
            }

            console.log('Profile Image:', formData);
            const { success, data, message } = await updateUserProfile(user.user.userId, formData);
            if (success) {
                console.log('User profile updated:', data);
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

                // Upload the image right after setting it
                try {
                    const response = await updateUserProfilePicture(user.user.userId, result.uri);

                    if (response.success) {
                        Alert.alert('Success', 'Image uploaded successfully!');
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
                <View style={styles.row}>
                    <Text style={styles.label}>Name:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        value={editedUser.name}
                        onChangeText={(text) => handleInputChange('name', text)}
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Email:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={editedUser.email}
                        onChangeText={(text) => handleInputChange('email', text)}
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Country:</Text>
                    <TouchableOpacity
                        style={styles.countryPickerButton}
                        onPress={() => setCountryPickerVisibility(true)}
                    >
                        <Text style={styles.value}>{editedUser.countryOfOrigin || 'Select Country'}</Text>
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
                <View style={styles.row}>
                    <Text style={styles.label}>Date Of Birth:</Text>
                    <TouchableOpacity onPress={openDatePicker}>
                        <Text style={styles.value}>{editedUser.dateOfBirth}</Text>
                    </TouchableOpacity>
                    <DateTimePicker
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleDateConfirm}
                        onCancel={() => setDatePickerVisibility(false)}
                    />
                </View>
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
    },
    profileHeader: {
        alignItems: 'center',
        justifyContent: 'center', // Center the content vertically
        marginTop: 50, // Add top margin to push it down from the top
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    defaultProfileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'lightgray',
        justifyContent: 'center',
        alignItems: 'center',
    },
    defaultProfileText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    profileInfo: {
        marginTop: 20,
        width: '100%',
    },
    input: {
        borderBottomWidth: 1,
        borderColor: 'gray',
        marginBottom: 20,
        fontSize: 18,
        padding: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    label: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'left',
        marginRight: 8,
    },
    value: {
        fontSize: 18,
    },
    datePickerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: '#1E90FF',
        padding: 12,
        borderRadius: 8,
        width: '90%',
        marginTop: 20,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
    },
    countryPickerButton: {
        flex: 1,
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 10,
        justifyContent: 'center',
        elevation: 1,
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
});

export default EditProfile;
