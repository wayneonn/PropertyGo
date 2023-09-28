import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Picker } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { useFormData } from '../../contexts/PartnerApplicationFormDataContext'; // Update the path to your FormDataContext

const validationSchema = Yup.object().shape({
    userRole: Yup.string()
        .oneOf(["GENERAL", "SUPPORT", "FEEDBACK", "OTHERS"], 'Invalid role')
        .required('User Role is required'),
});

const UserRoleScreen = () => {
    const navigation = useNavigation();
    const { formData, setFormData } = useFormData(); // Using the context

    const handleSubmit = (values) => {
        // Update the context with the new values
        setFormData({ ...formData, ...values });
        console.log(formData)
        navigation.navigate('Credit Card Info');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>User Role</Text>
            <Formik
                initialValues={{ userRole: formData.userRole || '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ handleSubmit, isValid, errors, values  }) => (
                    <View>
                        <Text style={styles.label}>User Role</Text>
                        <Field name="userRole" as={Picker}>
                            <Picker.Item label="Select role" value="" />
                            <Picker.Item label="General" value="GENERAL" />
                            <Picker.Item label="Support" value="SUPPORT" />
                            <Picker.Item label="Feedback" value="FEEDBACK" />
                            <Picker.Item label="Others" value="OTHERS" />
                        </Field>
                        {errors.userRole && <Text style={styles.errorText}>{errors.userRole}</Text>}
                        <Text>&nbsp;</Text>
                        <TouchableOpacity style={styles.button} onPress={() => handleSubmit(values)} disabled={!isValid}>
                            <Text style={styles.buttonText}>Submit</Text>
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
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 8,
        marginLeft: 4,
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
    buttonText: {
        color: '#fff',
        fontSize: 18,
        marginRight: 10,
    },
});

export default UserRoleScreen;

