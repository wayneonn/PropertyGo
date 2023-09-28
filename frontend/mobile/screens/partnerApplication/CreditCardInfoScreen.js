import React, {useState} from 'react';
import { Platform } from 'react-native';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Formik, useField } from 'formik';
import { useNavigation } from '@react-navigation/native';
import { useFormData } from '../../contexts/PartnerApplicationFormDataContext';
import * as Yup from 'yup';
import { isFuture, parse } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import {AntDesign} from "@expo/vector-icons";

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
        .matches(/^[0-9]{3,4}$/, 'CVC must be 3 or 4 digits'),
    expiryDate: Yup.string()
        .required('Expiry Date is required')
        .matches(/^(0[1-9]|1[0-2])\/([0-9]{4})$/, 'Invalid expiry date format')
        .test('is-future', 'The card has expired', (value) => {
            if (!value) return false;
            const [month, year] = value.split('/');
            const expiryDate = new Date(year, month - 1);
            return expiryDate > new Date();
        }),
});
const AnimatedInput = ({ fieldName, keyboardType, isDatePicker }) => {
    const [field, meta, helpers] = useField(fieldName);

    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i);

    const onChangeMonthYear = (month, year) => {
        helpers.setValue(`${month}/${year}`);
    };

    return (
        <>
            {isDatePicker ? (
                <View style={{ flexDirection: 'row' }}>
                    <Picker
                        selectedValue={field.value ? field.value.split('/')[0] : ''}
                        onValueChange={(itemValue) => onChangeMonthYear(itemValue, field.value ? field.value.split('/')[1] : '')}
                    >
                        <Picker.Item label="Month" value="" />
                        {months.map((month) => (
                            <Picker.Item key={month} label={String(month)} value={String(month)} />
                        ))}
                    </Picker>
                    <Picker
                        selectedValue={field.value ? field.value.split('/')[1] : ''}
                        onValueChange={(itemValue) => onChangeMonthYear(field.value ? field.value.split('/')[0] : '', itemValue)}
                    >
                        <Picker.Item label="Year" value="" />
                        {years.map((year) => (
                            <Picker.Item key={year} label={String(year)} value={String(year)} />
                        ))}
                    </Picker>
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

    const handleSubmit = (values) => {
        // Update the context with the new values
        setFormData({ ...formData, ...values });
        console.log(formData);
        navigation.navigate('Document Submission')
        // Here you can add your final submission logic or navigate to another screen
    };

    return (
        <View style={styles.container}>
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
                        <Text>&nbsp;</Text>
                        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={!isValid}>
                            <Text style={styles.buttonText}>Next</Text>
                            <AntDesign name="arrowright" size={20} color="black" />
                        </TouchableOpacity>
                    </View>
                )}
            </Formik>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
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
        fontSize: 14,
        marginBottom: 8,
        marginLeft: 4,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        marginRight: 10,
    },
});

export default CreditCardInfoScreen;
