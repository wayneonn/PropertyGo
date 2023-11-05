import React, {useContext, useEffect, useState} from 'react';
import {Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Button} from 'react-native';
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
    const [bankName, setBankName] = useState(user.user.bankName);
    const [bankAccount, setBankAccount] = useState(user.user.bankAccount.toString() || '');

    const [bankNameVisible, setBankNameVisible] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [profileImageBase64, setProfileImageBase64] = useState(null);

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

    const bankNames = [
        { label: 'Select Bank Name', value: '' },
        { label: 'ANEXT BANK PTE LTD', value: 'ANEXT BANK PTE LTD' },
        { label: 'AUSTRALIA & NEW ZEALAND BANKING GROUP', value: 'AUSTRALIA & NEW ZEALAND BANKING GROUP' },
        { label: 'BANK OF CHINA LIMITED', value: 'BANK OF CHINA LIMITED' },
        { label: 'BNP PARIBAS', value: 'BNP PARIBAS' },
        { label: 'CIMB BANK BERHAD', value: 'CIMB BANK BERHAD' },
        { label: 'CITIBANK NA', value: 'CITIBANK NA' },
        { label: 'Citibank Singapore Limited', value: 'Citibank Singapore Limited' },
        { label: 'DEUTSCHE BANK AG', value: 'DEUTSCHE BANK AG' },
        { label: 'GPay Network (S) Pte Ltd', value: 'GPay Network (S) Pte Ltd' },
        { label: 'GXS Bank Pte Ltd', value: 'GXS Bank Pte Ltd' },
        { label: 'Green Link Digital Bank Pte Ltd', value: 'Green Link Digital Bank Pte Ltd' },
        { label: 'HL BANK', value: 'HL BANK' },
        { label: 'HSBC (Corporate)', value: 'HSBC (Corporate)' },
        { label: 'HSBC (Personal)', value: 'HSBC (Personal)' },
        { label: 'ICICI BANK LIMITED', value: 'ICICI BANK LIMITED' },
        { label: 'INDUSTRIAL AND COMMERCIAL BANK OF CHINA LIMITED', value: 'INDUSTRIAL AND COMMERCIAL BANK OF CHINA LIMITED' },
        { label: 'JPMorgan Chase Bank, N.A', value: 'JPMorgan Chase Bank, N.A' },
        { label: 'Liquid Group Pte Ltd', value: 'Liquid Group Pte Ltd' },
        { label: 'MIZUHO BANK LIMITED', value: 'MIZUHO BANK LIMITED' },
        { label: 'Malayan Banking Berhad, Singapore Branch', value: 'Malayan Banking Berhad, Singapore Branch' },
        { label: 'MariBank Singapore Private Limited', value: 'MariBank Singapore Private Limited' },
        { label: 'MatchMove Pay Pte Ltd', value: 'MatchMove Pay Pte Ltd' },
        { label: 'Maybank Singapore Limited', value: 'Maybank Singapore Limited' },
        { label: 'NIUM PTE LTD', value: 'NIUM PTE LTD' },
        { label: 'OVERSEA-CHINESE BANKING CORPN LTD', value: 'OVERSEA-CHINESE BANKING CORPN LTD' },
        { label: 'RHB BANK BERHAD', value: 'RHB BANK BERHAD' },
        { label: 'SUMITOMO MITSUI BANKING CORPORATION', value: 'SUMITOMO MITSUI BANKING CORPORATION' },
        { label: 'Sing Investments & Finance Limited', value: 'Sing Investments & Finance Limited' },
        { label: 'SingCash Pte Ltd', value: 'SingCash Pte Ltd' },
        { label: 'Standard Chartered Bank (Singapore) Limited', value: 'Standard Chartered Bank (Singapore) Limited' },
        { label: 'State Bank of India', value: 'State Bank of India' },
        { label: 'THE BANK OF TOKYO-MITSUBISHI UFJ, LTD', value: 'THE BANK OF TOKYO-MITSUBISHI UFJ, LTD' },
        { label: 'Trust Bank Singapore Limited', value: 'Trust Bank Singapore Limited' },
        { label: 'UNITED OVERSEAS BANK LTD', value: 'UNITED OVERSEAS BANK LTD' },
        { label: 'Wise Asia-Pacific Pte.Ltd.', value: 'Wise Asia-Pacific Pte.Ltd.' },
        { label: 'Xfers Pte Ltd', value: 'Xfers Pte Ltd' }
    ];

    const saveChanges = async () => {

        try {
            const formData = new FormData();
            formData.append('name', user.user.name);
            formData.append('email', user.user.email);
            formData.append('countryOfOrigin', user.user.countryOfOrigin);
            formData.append('dateOfBirth', user.user.dateOfBirth);
            formData.append('bankName', bankName);
            formData.append('bankAccount', bankAccount);

            const {success, data, message} = await updateUserProfile(user.user.userId, formData);

            if (success) {
                    if (success) {
                        fetchUpdatedUserDetails();
                        Alert.alert('Success', 'Bank Account updated successfully!');
                    } else {
                        Alert.alert('Error', response.message || 'Bank update failed.');
                    }
            } else {
                console.error('Failed to update user profile:', message);
                Alert.alert('Error', message || 'Profile update failed.');
            }
        } catch (error) {
            console.error('Error updating user profile:', error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerContainer}>
                {/* Back button */}
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black"/>
                </TouchableOpacity>
                <Text style={styles.header}>Edit Bank Account</Text>
            </View>

            <View style={styles.profileInfo}>


                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Bank Name</Text>
                    <TouchableOpacity
                        style={styles.propertyTypePickerButton}
                        onPress={() => setBankNameVisible(true)}
                    >
                        <Text style={styles.propertyTypePickerText}>
                            {bankName
                                ? bankName
                                : 'Select Bank Name'}
                        </Text>
                        <View style={styles.caretContainer}>
                            <Icon name="caret-down" size={20} color="black" style={styles.caret} />
                        </View>
                    </TouchableOpacity>
                </View>

                <Modal
                    transparent={true}
                    animationType="slide"
                    visible={bankNameVisible}
                    onRequestClose={() => setBankNameVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <Picker
                            selectedValue={bankName}
                            onValueChange={(value) => setBankName(value)}
                            style={styles.picker}
                        >
                            {bankNames.map((type, index) => (
                                <Picker.Item
                                    key={index}
                                    label={type.label}
                                    value={type.value}
                                />
                            ))}
                        </Picker>
                        <View style={styles.okButtonContainer}>
                            <Button
                                title="OK"
                                onPress={() => setBankNameVisible(false)}
                            />
                        </View>
                    </View>
                </Modal>


                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Bank Account Number:</Text>
                    <TextInput
                        style={styles.input}
                        value={bankAccount}
                        placeholder="Bank Account Number"
                        maxLength={9}
                        keyboardType="numeric"
                        onChangeText={(text) => setBankAccount(text)}
                    />
                </View>
            </View>

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
        marginLeft: 40,
        marginTop: 20,
        marginBottom: 40,
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
    },
    descriptionDate: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    propertyTypePickerButton: {
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
        position: 'relative',
        paddingRight: 30,
    },
    propertyTypePickerText: {
        fontSize: 14,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingBottom: 20, // Add padding to make the button visible
    },
    picker: {
        backgroundColor: 'white',
    },
    okButtonContainer: {
        backgroundColor: 'white',
    },
    label: {
        marginBottom: 5,
        fontWeight: 'bold',
    },
    caretContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        paddingRight: 10,
    },
    caret: {
        marginLeft: 5,
    },
    inputContainer: {
        marginBottom: 10,
    },
    label: {
        marginBottom: 5,
        fontWeight: 'bold',
    },
    input: {
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 8,
        height: 40,
        borderRadius: 5,
    },
});

export default EditProfile;
