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

                        {/* Add other input fields similarly */}
                        <TextInput
                            label="User Role"
                            value={values.userRole}
                            onChangeText={handleChange('userRole')}
                        />
                        {/* ... other fields ... */}

                        <Button onPress={handleSubmit}>Submit Application</Button>
                    </View>
                )}
            </Formik>
        </ScrollView>
    );
};

export default PartnerApplicationScreen;