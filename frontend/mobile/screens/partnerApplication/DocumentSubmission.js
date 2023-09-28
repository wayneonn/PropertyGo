// This is a Document Submission screen.

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFormData } from '../../contexts/PartnerApplicationFormDataContext';
import {DocumentSelector} from "../../components/DocumentSelector";

const DocumentSubmissionScreen = () => {
    const navigation = useNavigation();
    const { formData, setFormData } = useFormData(); // Using your context
    const [selectedDocuments, setSelectedDocuments] = useState([]); // Local state to keep track of selected documents

    const handleSubmit = () => {
        // Update the context with the new values
        setFormData({ ...formData, documents: selectedDocuments });
        // Navigate to the next screen or submit the form
        navigation.navigate('NextScreen'); // Replace with your actual next screen
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Upload Documents</Text>
            <DocumentSelector /> {/* Replace onSelect with your actual prop if different */}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    button: {
        marginTop: 20,
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
    },
});

export default DocumentSubmissionScreen;