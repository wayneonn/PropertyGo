import React from 'react';
import {KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform     } from 'react-native';
import {AntDesign} from '@expo/vector-icons';
import {Formik, useField} from 'formik';
import {useNavigation} from '@react-navigation/native';
import {useFormData} from '../../contexts/PartnerApplicationFormDataContext';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    companyName: Yup.string()
        .required('Company Name is required'),
});
const AnimatedInput = ({fieldName}) => {
    const [field, meta] = useField(fieldName);
    return (
        <TextInput
            style={styles.input}
            onChangeText={field.onChange(fieldName)}
            onBlur={field.onBlur(fieldName)}
            value={field.value}
        />
    );
};

const CompanyInfoScreen = () => {
    const navigation = useNavigation();
    const {formData, setFormData} = useFormData(); // Using the context

    const handleSubmit = (values) => {
        // Update the context with the new values
        setFormData({...formData, ...values});
        console.log(formData)
        // Navigate to the next screen
        navigation.navigate('User Role');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <Text style={styles.title}>Company Name</Text>
            <Text style={styles.subtitle}>Tell us what your company is. </Text>
            <Formik
                initialValues={{companyName: formData.companyName || ''}}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
            >
                {({handleSubmit, isValid, errors, values, setFieldValue}) => (
                    <View>
                        <Text style={styles.label}>Company Name</Text>
                        {/* Custom TextInput with character limit */}
                        <TextInput
                            name="companyName"
                            maxLength={50}
                            onChangeText={(text) => {
                                setFieldValue('companyName', text);
                            }}
                            value={values.companyName}
                            style={styles.input}
                        />

                        {/* Character count indicator */}
                        <Text>{values.companyName.length}/50</Text>
                        {errors.companyName && <Text style={styles.errorText}>{errors.companyName}</Text>}
                        <Text>&nbsp;</Text>
                        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={!isValid}>
                            <Text style={styles.buttonText}>Next</Text>
                            <AntDesign name="arrowright" size={20} color="black"/>
                        </TouchableOpacity>
                    </View>
                )}
            </Formik>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: '#f2f2f2',
        paddingLeft: 70,
    },
    box: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 18,
        fontStyle: "italic",
        color: '#666',
        marginBottom: 20
    },
    label: {
        fontSize: 18,
        color: '#666',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderStyle: "dashed",
        borderRadius: 8,
        padding: 12,
        width: 160,
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
    buttonText: {
        color: '#fff',
        fontSize: 18,
        marginRight: 10,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});

export default CompanyInfoScreen;

