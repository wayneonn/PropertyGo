import React, { useContext, useState, useLayoutEffect } from 'react'; // Import the useLayoutEffect
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { AuthContext } from '../../AuthContext';
import { updateUserProfile } from '../../utils/api'; // Import the function from your API utils
import { Ionicons } from '@expo/vector-icons';

function UpdatePassword({ navigation }) {
    const { user, login } = useContext(AuthContext);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

   

    const updateUserPassword = async () => {
        try {
            const formData = new FormData();
            formData.append('name', user.user.name); // Reusing name here as it's not being updated
            formData.append('email', user.user.email); // Reusing email here as it's not being updated
            formData.append('countryOfOrigin', user.user.countryOfOrigin); // Reusing country here as it's not being updated
            formData.append('dateOfBirth', user.user.dateOfBirth); // Reusing dateOfBirth here as it's not being updated
            formData.append('password', newPassword); // Set the new password

            // Call the updateUserProfile function to update user profile data, including the password
            const { success, data, message } = await updateUserProfile(user.user.userId, formData);

            if (success) {
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
            // Here, you can add a check to verify the current password, and if it's correct,
            // then call the updateUserPassword function to update the password.
            
            // Example: You can compare currentPassword with user.user.password here.
            if (currentPassword !== user.user.password) {
                Alert.alert('Error', 'Current password is incorrect');
                return;
            }

            // If the current password is correct, proceed to update the password
            updateUserPassword();
        } catch (error) {
            console.error('Error updating password:', error);
            Alert.alert('Error', 'An error occurred while updating the password');
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
            <Text style={styles.header}>Update Password</Text>
            <Text style={styles.label}>Current Password:</Text>
            <TextInput
                secureTextEntry
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Current Password"
            />

            <Text style={styles.label}>New Password:</Text>
            <TextInput
                secureTextEntry
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="New Password"
            />

            <Text style={styles.label}>Confirm New Password:</Text>
            <TextInput
                secureTextEntry
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm New Password"
            />

            <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
                <Text style={styles.buttonText}>Update </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        fontSize: 34,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        marginTop: 150,
        marginBottom: 100,
    },
    label: {
        fontSize: 18,
        marginBottom: 12,
        alignSelf: 'flex-start',
        marginLeft: 16,

    },
    input: {
        width: '90%',
        padding: 8,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 26,
        borderRadius: 8,
        marginLeft: 15,
        height: 40,
    },
    button: {
        backgroundColor: '#1E90FF',
        padding: 12,
        borderRadius: 8,
        width: '90%',
        alignSelf: 'center',
        marginTop: 200,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 40,
    },
    backButton: {
        marginLeft: 15,
        marginTop: 20,
    },
    header: {
        fontSize: 34,
        fontWeight: 'bold',
        marginBottom: 75,
        marginTop: 50,
        textAlign: 'center',
    },
});

export default UpdatePassword;
