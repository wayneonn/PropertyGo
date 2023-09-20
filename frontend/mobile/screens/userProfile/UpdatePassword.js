import React, { useContext, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { AuthContext } from '../../AuthContext';
import { updateUserProfile, loginUser } from '../../utils/api';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome
import { Ionicons } from '@expo/vector-icons';

function UpdatePassword({ navigation }) {
    const { user, login } = useContext(AuthContext);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

    const updateUserPassword = async () => {
        try {
            const formData = new FormData();
            formData.append('password', newPassword);
            formData.append('email', user.user.email);

            const { success, data, message } = await updateUserProfile(
                user.user.userId,
                formData
            );

            if (success) {
                fetchUpdatedUserDetails();
                Alert.alert('Success', 'Password changed successfully!', [
                    { text: 'OK', onPress: () => navigation.goBack() },
                ]);
            } else {
                Alert.alert('Error', message || 'Failed to update password');
            }
        } catch (error) {
            console.error('Error updating password:', error);
            Alert.alert('Error', 'An error occurred while updating the password');
        }
    };

    const handleSaveChanges = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'All fields are required');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New password and confirm password do not match');
            return;
        }

        try {
            if (currentPassword !== user.user.password) {
                Alert.alert('Error', 'Current password is incorrect');
                return;
            }

            updateUserPassword();
        } catch (error) {
            console.error('Error updating password:', error);
            Alert.alert('Error', 'An error occurred while updating the password');
        }
    };

    const fetchUpdatedUserDetails = async () => {
        try {
            const { success, data, message } = await loginUser(
                user.user.userName,
                newPassword
            );

            if (success) {
                login(data);
            } else {
                Alert.alert('Error', message);
            }
        } catch (error) {
            console.error('Error fetching updated user details:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <Text style={styles.header}>Update Password</Text>

            <Text style={styles.label}>Current Password:</Text>
            <View style={styles.passwordInputContainer}>
                <TextInput
                    secureTextEntry={!showPassword}
                    style={styles.passwordInput}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="Current Password"
                />
                <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                >
                    <FontAwesome
                        name={showPassword ? 'eye' : 'eye-slash'}
                        size={20}
                        color="#555"
                    />
                </TouchableOpacity>
            </View>

            <Text style={styles.label}>New Password:</Text>
            <View style={styles.passwordInputContainer}>
                <TextInput
                    secureTextEntry={!showPassword}
                    style={styles.passwordInput}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="New Password"
                />
                <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                >
                    <FontAwesome
                        name={showPassword ? 'eye' : 'eye-slash'}
                        size={20}
                        color="#555"
                    />
                </TouchableOpacity>
            </View>

            <Text style={styles.label}>Confirm New Password:</Text>
            <View style={styles.passwordInputContainer}>
                <TextInput
                    secureTextEntry={!showPassword}
                    style={styles.passwordInput}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm New Password"
                />
                <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                >
                    <FontAwesome
                        name={showPassword ? 'eye' : 'eye-slash'}
                        size={20}
                        color="#555"
                    />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
            <Ionicons name="save-outline" size={18} color="white" />
                <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 40,
    },
    backButton: {
        marginLeft: 15,
        marginTop: -50,
    },
    header: {
        fontSize: 34,
        fontWeight: 'bold',
        marginBottom: 75,
        marginTop: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 18,
        marginBottom: 10,
        width: '100%',
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    passwordInput: {
        flex: 1,
        width: '90%',
        padding: 8,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 26,
        borderRadius: 8,
        marginLeft: 15,
        height: 40,
    },
    eyeIcon: {
        position: 'absolute',
        top: 12,
        right: 10,
    },
    button: {
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
    buttonText: {
        color: 'white',
        fontSize: 16,
        marginLeft: 10,
    },
    buttonIcon: {
        marginRight: 10,
    },
});

export default UpdatePassword;
