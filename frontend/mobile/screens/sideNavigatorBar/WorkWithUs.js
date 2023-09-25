import {SafeAreaView, Text, ScrollView, View } from 'react-native';
import React from 'react';
import { Button, TextInput, HelperText } from 'react-native-paper';
import { Formik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
    companyName: yup.string().required('Company name is required'),
    userRole: yup.string().required('User role is required'),
    cardNumber: yup.string().required('Card number is required'),
    cardHolderName: yup.string().required('Card holder name is required'),
    cvc: yup.string().required('CVC is required'),
    expiryDate: yup.date().required('Expiry date is required'),
});

const PartnerApplicationScreen = ({ navigation }) => {
    const handleSubmit = async (values) => {
        // Here, you would typically make a POST request to your API endpoint to create a new PartnerApplication
        console.log('Submitted Partner Application: ', values);

        // Navigate to another screen or show a success message as needed
    };

    return (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
            <Formik
                initialValues={{
                    companyName: '',
                    userRole: '',
                    cardNumber: '',
                    cardHolderName: '',
                    cvc: '',
                    expiryDate: '',
                }}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
            >
                {({ handleChange, handleSubmit, values, errors }) => (
                    <View>
                        <TextInput
                            label="Company Name"
                            value={values.companyName}
                            onChangeText={handleChange('companyName')}
                        />
                        <HelperText type="error" visible={!!errors.companyName}>
                            {errors.companyName}
                        </HelperText>

                        <TextInput
                            label="User Role"
                            value={values.userRole}
                            onChangeText={handleChange('userRole')}
                        />
                        <HelperText type="error" visible={!!errors.userRole}>
                            {errors.userRole}
                        </HelperText>

                        <TextInput
                            label="Card Number"
                            value={values.cardNumber}
                            onChangeText={handleChange('cardNumber')}
                            keyboardType="number-pad" // To show number keypad
                        />
                        <HelperText type="error" visible={!!errors.cardNumber}>
                            {errors.cardNumber}
                        </HelperText>

                        <TextInput
                            label="Card Holder Name"
                            value={values.cardHolderName}
                            onChangeText={handleChange('cardHolderName')}
                        />
                        <HelperText type="error" visible={!!errors.cardHolderName}>
                            {errors.cardHolderName}
                        </HelperText>

                        <TextInput
                            label="CVC"
                            value={values.cvc}
                            onChangeText={handleChange('cvc')}
                            keyboardType="number-pad" // To show number keypad
                        />
                        <HelperText type="error" visible={!!errors.cvc}>
                            {errors.cvc}
                        </HelperText>

                        <TextInput
                            label="Expiry Date"
                            value={values.expiryDate}
                            onChangeText={handleChange('expiryDate')}
                            placeholder="MM/YY"
                        />
                        <HelperText type="error" visible={!!errors.expiryDate}>
                            {errors.expiryDate}
                        </HelperText>

                        <Button onPress={handleSubmit}> Submit Application</Button>
                    </View>
                )}
            </Formik>
        </ScrollView>
    );
};

export default PartnerApplicationScreen;