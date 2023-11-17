import React, { useState } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableHighlight } from 'react-native';

const MakeRequestModal = ({ isVisible, onCancel, onSubmit }) => {
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [amount, setAmount] = useState('');

    const handleJobTitleChange = (text) => {
        setJobTitle(text);
    };

    const handleJobDescriptionChange = (text) => {
        setJobDescription(text);
    };

    const handleAmountChange = (text) => {
        setAmount(text);
    };

    const handleSubmit = () => {
        // Call the onSubmit function with the jobTitle, jobDescription, and amount values
        onSubmit(jobTitle, jobDescription, amount);

        // Clear the input fields
        setJobTitle('');
        setJobDescription('');
        setAmount('');

        // Close the modal
        onCancel();
    };

    const handleCancel = () => {
        // Clear the input fields
        setJobTitle('');
        setJobDescription('');
        setAmount('');

        // Close the modal
        onCancel();
    };

    return (
        <Modal transparent={true} animationType="slide" visible={isVisible}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Make A Request</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Job Service Title:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Job Title"
                            value={jobTitle}
                            onChangeText={handleJobTitleChange}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Job Service Description:</Text>
                        <TextInput
                            style={[styles.input, {height: 100}]} // Increase height for description input
                            placeholder="Enter Job Description"
                            value={jobDescription}
                            onChangeText={handleJobDescriptionChange}
                            multiline={true} // Enable multiline input
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Offer Amount:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Amount"
                            value={amount}
                            onChangeText={handleAmountChange}
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableHighlight
                            style={[styles.button, { backgroundColor: 'red' }]}
                            onPress={handleCancel}
                            underlayColor="#EAEAEA"
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={[
                                styles.button,
                                { backgroundColor: '#FFD700' },
                                (jobTitle.trim() === '' || jobDescription.trim() === '' || amount.trim() === '' || !/^\d+(\.\d{1,2})?$/.test(amount)) && styles.buttonDisabled,
                            ]}
                            onPress={handleSubmit}
                            underlayColor="#EAEAEA"
                            disabled={jobTitle.trim() === '' || jobDescription.trim() === '' || amount.trim() === '' || !/^\d+(\.\d{1,2})?$/.test(amount)}
                        >
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        width: '80%', // Adjust the width of the modal content
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        marginTop: 10,
        marginBottom: 5,
        textAlign: 'left', // Align text to the left
        alignSelf: 'flex-start', // Align text to the left
    },
    inputContainer: {
        width: '100%', // Make the input container take full width
    },
    input: {
        height: 50,
        textAlignVertical: 'top',
        borderRadius: 5,
        borderColor: '#ccc',
        borderWidth: 1,
        // marginBottom: 10,
        paddingHorizontal: 10,
        paddingVertical: 12,
        width: '100%', // Make the input take full width
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        marginTop: 10,
    },
    button: {
        width: '45%', // Set button width
        borderRadius: 5,
        alignItems: 'center',
        padding: 10,
    },
    buttonText: {
        color: 'black', // Black text color for buttons
        fontWeight: 'bold',
    },
    buttonDisabled: {
        opacity: 0.5,
        backgroundColor: 'gray',
    },
    warningLabel: {
        fontSize: 14,
        // marginTop: 10,
        // marginBottom: 5,
        textAlign: 'left',
        alignSelf: 'flex-start',
        color: "red",
    },
});

export default MakeRequestModal;
