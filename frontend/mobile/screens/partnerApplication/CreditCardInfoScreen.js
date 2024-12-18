import React, {useContext, useEffect} from 'react';
import {KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform} from 'react-native';
import {Formik, useField} from 'formik';
import {useNavigation} from '@react-navigation/native';
import {useFormData} from '../../contexts/PartnerApplicationFormDataContext';
import * as Yup from 'yup';
import {AntDesign} from "@expo/vector-icons";
import {sendPartnerApplication} from "../../utils/partnerApplicationApi";
import {AuthContext} from "../../AuthContext";

// This whole screen is very, very, problematic. Like...wow.
// We should just make this either a) Stripe or b) Bank-Account, PayLah etc.
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

/**
 * CC Card Info details.
 * 1. Input in the CC No., CVC checker, and Expiry Date checker.
 * 2. Submit the required info into the database.
 * 3. TODO: Hashing the damn thing so I don't get complained.
 *
 *
 * */
const AnimatedInput = ({fieldName, keyboardType, isDatePicker}) => {
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
                        style={[styles.input, {width: 100}]}
                        onChangeText={helpers.setValue}
                        onBlur={field.onBlur(fieldName)}
                        value={field.value}
                        placeholder="MM/YYYY"
                        keyboardType="default"
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
    const {formData, setFormData} = useFormData(); // Using the context
    const {user} = useContext(AuthContext);
    const USER_ID = user.user.userId;

    const handleSubmit = async (values) => {
        setFormData({...formData, ...values});
        console.log(formData, values);
        // Submit the thing to create the Partner Application.
        const res = await sendPartnerApplication(USER_ID, formData)
        // If submission is successful, pass it on to the next screen, or just store it in the form data.
        // Also need to enforce creation?
        console.log(res)
        setFormData({});
        navigation.navigate('Document Submission')
        // Here you can add your final submission logic or navigate to another screen
    };

    useEffect(() => {
        // This will run whenever formData changes
        sendPartnerApplication(USER_ID, formData).then(res => {
            console.log(res);
        });
    }, [formData]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={Platform.OS === 'ios' && {flex: 1, alignItems: 'center', justifyContent: "center"}}
            keyboardVerticalOffset={30}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Payment Details</Text>
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
                    {({handleSubmit, isValid, values}) => (
                        <View>
                            <Text style={styles.label}>Card Number</Text>
                            <AnimatedInput fieldName="cardNumber" keyboardType="number-pad"/>

                            <Text style={styles.label}>Card Holder Name</Text>
                            <AnimatedInput fieldName="cardHolderName"/>

                            <View style={{justifyContent: "space-between", alignItems:"flex-start"}}>
                                <Text style={styles.label}>CVC</Text>
                                <AnimatedInput fieldName="cvc" keyboardType="number-pad"/>

                                <Text style={styles.label}>Expiry Date</Text>
                                <AnimatedInput fieldName="expiryDate" isDatePicker={true}/>
                            </View>
                            <Text>&nbsp;&nbsp;</Text>
                            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={!isValid}>
                                <Text style={styles.buttonText}>Next</Text>
                                <AntDesign name="arrowright" size={20} color="black"/>
                            </TouchableOpacity>
                        </View>
                    )}
                </Formik>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: '#f2f2f2',
        paddingBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    label: {
        fontSize: 18,
        color: '#666',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
        width: 250,
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#5F5859',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 30,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 8,
        marginTop: -8
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        marginRight: 10,
    },
});

export default CreditCardInfoScreen;
