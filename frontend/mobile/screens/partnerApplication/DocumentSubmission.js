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
        navigation.navigate('Ending'); // Replace with your actual next screen
    };

    const uploadSucceed = () => {
        console.log("Upload done.")
    }

    // Do we still need to fetch data???
    // I think it just ignores it if it does not exist.
    // Probably just turn it into a free signal.
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Upload Documents</Text>
            <DocumentSelector documentFetch={uploadSucceed} isTransaction={false}/> {/* Replace onSelect with your actual prop if different */}
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