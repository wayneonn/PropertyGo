import React, { useState } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableHighlight } from 'react-native';

const AddForumTopicModal = ({ isVisible, onCancel, onSubmit, forumTopics }) => {
    const [topicName, setTopicName] = useState('');

    const handleTopicNameChange = (text) => {
        setTopicName(text);
    };

    const handleSubmit = () => {
        // Call the onSubmit function with the topicName value
        onSubmit(topicName);

        // Clear the topicName input
        setTopicName('');

        // Close the modal
        onCancel();
    };

    const handleCancel = () => {

        // Clear the topicName input
        setTopicName('');

        // Close the modal
        onCancel();
    };

    return (
        <Modal transparent={true} animationType="slide" visible={isVisible}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Add a new Forum Topic</Text>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Topic Name:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter topic name"
                            value={topicName}
                            onChangeText={handleTopicNameChange}
                        />
                        {forumTopics && forumTopics.find((topic) => topic.topicName.trim().toUpperCase() === topicName.trim().toUpperCase()) ? <Text style={styles.warningLabel}>Topic Name Exist!</Text> : null }
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableHighlight
                            style={[styles.button, { backgroundColor: 'red' }]} // Red background for cancel button
                            onPress={handleCancel}
                            underlayColor="#EAEAEA"
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={[
                                styles.button,
                                { backgroundColor: '#FFD700' }, // Yellow background for submit button
                                forumTopics && (topicName.trim() === '' || forumTopics.find((topic) => topic.topicName.trim().toUpperCase() === topicName.trim().toUpperCase())) && styles.buttonDisabled, // disabled when topicName is empty
                            ]}
                            onPress={handleSubmit}
                            underlayColor="#EAEAEA"
                            disabled={(forumTopics && (topicName.trim() === '' || forumTopics.find((topic) => topic.topicName.trim().toUpperCase() === topicName.trim().toUpperCase())))}
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

export default AddForumTopicModal;
