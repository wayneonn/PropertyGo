import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, TouchableHighlight, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ImageGallery from './ImageGallery';

const EditForumCommentModal = ({ isVisible, onCancel, onSubmit, comment }) => {
    const [message, setMessage] = useState(comment.message);

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access camera roll is required!');
            }
        })();
    }, []);

    const handleMessageChange = (text) => {
        setMessage(text);
    };


    const handleSubmit = async () => {


        const commentDetails = {
            forumCommentId: comment.forumCommentId,
            message,
        };

        // console.log(commentDetails);

        onSubmit(commentDetails);

        // Close the modal
        onCancel();
    };

    const handleCancel = () => {
        setMessage(comment.message);

        // Close the modal
        onCancel();
    };

    return (
        <Modal transparent={true} animationType="slide" visible={isVisible}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Edit Forum Comment</Text>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Message:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Message"
                            value={message}
                            onChangeText={handleMessageChange}
                        />

                        <ImageGallery images={comment.images} />
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
                                { backgroundColor: '#FFD700' }, // Yellow background for submit button
                                (message.trim() === '') && styles.buttonDisabled, // disabled when topicName is empty
                            ]}
                            onPress={handleSubmit}
                            underlayColor="#EAEAEA"
                            disabled={(message.trim() === '')} // Disable the button if topicName is empty
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
        width: '80%',
        marginBottom: 70,
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
        textAlign: 'left',
        alignSelf: 'flex-start',
    },
    inputContainer: {
        width: '100%',
    },
    input: {
        height: 50,
        textAlignVertical: 'top',
        borderRadius: 5,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        paddingVertical: 12,
        width: '100%',
    },
    selectedImage: {
        width: 150,
        height: 150,
    },
    removeImageButton: {
        backgroundColor: '#ccc',
        padding: 5,
        borderRadius: 5,
        marginTop: 5,
        alignItems: 'center',
    },
    removeImageText: {
        color: 'white',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        marginTop: 10,
    },
    button: {
        width: '45%',
        borderRadius: 5,
        alignItems: 'center',
        padding: 10,
    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
    },
    buttonDisabled: {
        opacity: 0.5,
        backgroundColor: 'gray',
    },
});

export default EditForumCommentModal;
