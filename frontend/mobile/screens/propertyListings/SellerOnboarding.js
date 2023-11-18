import React, { useState, useEffect, useContext,  } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Button, TextInput, ScrollView, Alert, KeyboardAvoidingView} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { AuthContext } from "../../AuthContext";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { updateUserProfile, loginUser } from "../../utils/api";
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';

const SellerOnboarding = ({ }) => {
    const [subscriptionEndDate, setSubscriptionEndDate] = useState(null); // Replace with actual subscription end date
    const { user, login } = React.useContext(AuthContext);
    const [bankNameVisible, setBankNameVisible] = useState(false);
    const [bankName, setBankName] = useState('');
    const [bankAccount, setBankAccount] = useState('');
    const navigation = useNavigation();
    const endDate = new Date(user.user.partnerSubscriptionEndDate);

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

    const updateUser = async (user, login) => {
        const formData = new FormData();
        formData.append('bankName', bankName);
        formData.append('bankAccount', bankAccount);
        formData.append('email', user.email);
        formData.append('countryOfOrigin', user.countryOfOrigin);
        formData.append('dateOfBirth', user.dateOfBirth);

        const { success, data, message } = await updateUserProfile(user.userId, formData);
        // console.log("updateUserStripeCustomerId success: ", success, " data: ", data, " message: ", message);
        fetchUpdatedUserDetails(user, login);
    };

    const fetchUpdatedUserDetails = async (user, login) => {
        console.log("fetchUpdatedUserDetails user: ", user);
        try {
            const { success, data, message } = await loginUser(user.userName, user.password);

            if (success) {
                console.log("success!: ");
                login(data);
            } else {
                Alert.alert('Error', message);
            }
        } catch (error) {
            console.error('Error fetching updated user details:', error);
        }
    };

    const handleSubmit = async () => {
        if (bankName === '') {
            Alert.alert('Please select a Bank', 'Please choose a bank.');
            return;
        }

        if (bankAccount === '') {
            Alert.alert('Please enter Bank Account Number', 'Bank Account Number is required.');
            return;
        }

        if (!/^\d{9}$/.test(bankAccount)) {
            Alert.alert('Invalid Bank Account Number', 'Bank Account Number must be exactly 9 digits long.');
            return;
        }

        updateUser(user.user, login);
        navigation.navigate('List Property');
    }


    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.image}>
                    <MaterialCommunityIcons
                        name="alert-circle-outline"
                        size={144}
                        color="black"
                    />
                </View>
                <Text style={styles.title}>You do not have a Bank Account Registered with us!</Text>
                <Text style={styles.descriptionDate}>For first-time sellers, please input your Bank Name and Bank Account Number!</Text>
                <Text style={styles.descriptionDate}></Text>
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
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 180 : 0}
                // style={styles.keyboardContainer}
                >
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Bank Account Number</Text>
                        <TextInput
                            placeholder="123-456-789"
                            placeholderTextColor="gray"
                            maxLength={9}
                            keyboardType="numeric"
                            value={bankAccount}
                            onChangeText={(text) => setBankAccount(text)} // Fixed the onChangeText function
                            style={styles.input}
                        />
                    </View>
                    </KeyboardAvoidingView>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit}
                >
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#ffffff',
    },
    image: {
        marginTop: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        paddingHorizontal: 20,
        color: '#333333',
        textAlign: 'center',
    },
    endDateText: {
        fontSize: 18,
        marginBottom: 20,
        color: '#666666',
    },
    button: {
        marginTop: 40,
        backgroundColor: '#007BFF',
        width: '50%',
        alignSelf: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 8,
    },
    buttonText: {
        fontSize: 18,
        alignSelf: 'center',
        fontWeight: 'bold',
        color: 'white',
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
        marginBottom: 20,
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

export default SellerOnboarding;
