import React, {useContext, useEffect, useState} from 'react';
import {Platform, ScrollView} from 'react-native';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { Formik, useField } from 'formik';
import { useNavigation } from '@react-navigation/native';
import { useFormData } from '../../contexts/PartnerApplicationFormDataContext';
import * as Yup from 'yup';
import {AntDesign} from "@expo/vector-icons";
import {sendPartnerApplication} from "../../utils/partnerApplicationApi";
import {AuthContext} from "../../AuthContext";

Yup.addMethod(Yup.string, 'luhn', function (message) {
    return this.test('luhn', message || 'Invalid credit card number', function (value) {
        if (!value) return false;
        let nCheck = 0;
        let nDigit = 0;
        let bEven = false;
        value = value.replace(/\D/g, '');
        for (let n = value.length - 1; n >= 0; n--) {
            const cDigit = value.charAt(n);
            nDigit = parseInt(cDigit, 10);
            if (bEven) {
                if ((nDigit *= 2) > 9) nDigit -= 9;
            }
            nCheck += nDigit;
            bEven = !bEven;
        }
        return nCheck % 10 === 0;
    });
});

const getCardType = (cardNumber) => {
    if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(cardNumber)) {
        return 'Visa';
    } else if (/^5[1-5][0-9]{14}$/.test(cardNumber)) {
        return 'MasterCard';
    } else if (/^3[47][0-9]{13}$/.test(cardNumber)) {
        return 'AmericanExpress';
    } else if (/^6(?:011|5[0-9]{2})[0-9]{12}$/.test(cardNumber)) {
        return 'Discover';
    } else if (/^(?:2131|1800|35\d{3})\d{11}$/.test(cardNumber)) {
        return 'JCB';
    } else {
        return 'Unknown';
    }
};

const validationSchema = Yup.object().shape({
    cardNumber: Yup.string()
        .required('Card Number is required')
        .matches(/^[0-9]{16}$/, 'Card Number must be 16 digits')
        .luhn('Invalid credit card number'),
    cardHolderName: Yup.string()
        .required('Card Holder Name is required')
        .matches(/^[a-zA-Z\s]*$/, 'Only alphabets are allowed'),
    cvc: Yup.string()
        .required('CVC is required')
        .matches(/^[0-9]{3,4}$/, 'CVC must be 3 or 4 digits')
        .test('cvc-compatibility', 'Invalid CVC', function (value) {
            const cardNumber = this.parent.cardNumber;
            // Determine card type based on card number (you can use regex or any other method)
            const cardType = getCardType(cardNumber); // Implement this function
            if (cardType === 'AmericanExpress') {
                return /^[0-9]{4}$/.test(value);
            } else {
                return /^[0-9]{3}$/.test(value);
            }
        }),
    expiryDate: Yup.string()
        .required('Expiry Date is required')
        .matches(/^(0[1-9]|1[0-2])\/([0-9]{4})$/, 'Invalid expiry date format')
        // I strongly suspect that the test is screwed up.
        .test('is-future', 'The card has expired', (value) => {
            console.log(value)
            if (!value) return false;
            const [month, year] = value.split('/');
            const yearNum = Number.parseInt(year)
            const monthNum = Number.parseInt(month)
            const expiryDate = new Date(yearNum, monthNum - 1);
            return expiryDate > new Date();
        }),
});

// Slight issues with DatePicker. I need a DatePicker for it work.
const AnimatedInput = ({ fieldName, keyboardType, isDatePicker }) => {
    const [field, meta, helpers] = useField(fieldName);

    const handleDateChange = (input) => {
        // Optionally, you could add some immediate format validation here
        helpers.setValue(input);
    };

    return (
        <>
            {isDatePicker ? (
                <View>
                    <TextInput
                        style={styles.input}
                        onChangeText={helpers.setValue}
                        onBlur={field.onBlur(fieldName)}
                        value={field.value}
                        placeholder="MM/YYYY"
                        keyboardType="numeric"
                    />
                </View>
            ) : (
                <TextInput
                    style={styles.input}
                    onChangeText={helpers.setValue}
                    onBlur={field.onBlur(fieldName)}
                    value={field.value}
                    keyboardType={keyboardType}
                />
            )}
            {meta.touched && meta.error ? <Text style={styles.errorText}>{meta.error}</Text> : null}
        </>
    );
};



const CreditCardInfoScreen = () => {
    const navigation = useNavigation();
    const { formData, setFormData } = useFormData(); // Using the context
    const {user} = useContext(AuthContext);
    const USER_ID = user.user.userId;

    const handleSubmit = async (values) => {
        // Update the context with the new values
        console.log(USER_ID)
        setFormData({ ...formData, ...values });
        console.log(formData, values);
        // Submit the thing to create the Partner Application.
        const res = await sendPartnerApplication(USER_ID, formData)
        // If submission is successful, pass it on to the next screen, or just store it in the form data.
        // Also need to enforce creation?
        console.log(res)
        navigation.navigate('Document Selection')
        // Here you can add your final submission logic or navigate to another screen
    };

    useEffect(() => {
        // This will run whenever formData changes
        sendPartnerApplication(USER_ID, formData).then(res => {
            console.log(res);
        });
    }, [formData]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Credit Card Information</Text>
            <Formik
                initialValues={{
                    cardNumber: formData.cardNumber || '',
                    cardHolderName: formData.cardHolderName || '',
                    cvc: formData.cvc || '',
                    expiryDate: formData.expiryDate || '',
                }}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
            >
                {({ handleSubmit, isValid , values}) => (
                    <View>
                        <Text style={styles.label}>Card Number</Text>
                        <AnimatedInput fieldName="cardNumber" keyboardType="number-pad" />

                        <Text style={styles.label}>Card Holder Name</Text>
                        <AnimatedInput fieldName="cardHolderName" />

                        <Text style={styles.label}>CVC</Text>
                        <AnimatedInput fieldName="cvc" keyboardType="number-pad" />

                        <Text style={styles.label}>Expiry Date</Text>
                        <AnimatedInput fieldName="expiryDate" isDatePicker={true} />
                        <Text>&nbsp;&nbsp;</Text>
                        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={!isValid}>
                            <Text style={styles.buttonText}>Next</Text>
                            <AntDesign name="arrowright" size={20} color="black" />
                        </TouchableOpacity>
                    </View>
                )}
            </Formik>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        paddingBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        color: '#666',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
        width: '100%',
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 30,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        marginRight: 10,
    },
});

export default CreditCardInfoScreen;
