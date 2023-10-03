import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, TouchableHighlight, Image } from 'react-native';
import ImagePicker from 'react-native-image-picker';

const AddForumPostModal = ({ forumTopicId, isVisible, onCancel, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [imageUri, setImageUri] = useState(null);

    const handleTitleChange = (text) => {
        setTitle(text);
    };

    const handleMessageChange = (text) => {
        setMessage(text);
    };

    const handleImageUpload = () => {
        // Configure options for the image picker
        // const options = {
        //     title: 'Select Image',
        //     storageOptions: {
        //         skipBackup: true,
        //         path: 'images',
        //     },
        // };

        // // Show the image picker
        // ImagePicker.showImagePicker(options, (response) => {
        //     if (response.didCancel) {
        //         // User cancelled image selection
        //     } else if (response.error) {
        //         // Handle error
        //     } else {
        //         // Image selected, set the image URI
        //         setImageUri(response.uri);
        //     }
        // });
    };

    const handleSubmit = () => {
        const postDetails = {
            forumTopicId,
            title,
            message,
            imageUri,
        };

        onSubmit(postDetails);

        setTitle('');
        setMessage('');
        setImageUri(null);

        // Close the modal
        onCancel();
    };

    const handleCancel = () => {
        setTitle('');
        setMessage('');
        setImageUri(null);

        // Close the modal
        onCancel();
    };

    return (
        <Modal transparent={true} animationType="slide" visible={isVisible}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Add a new Forum Post</Text>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Title:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Title"
                            value={title}
                            onChangeText={handleTitleChange}
                        />
                        <Text style={styles.label}>Message:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Message"
                            value={message}
                            onChangeText={handleMessageChange}
                        />
                        {imageUri && <Image source={{ uri: imageUri }} style={styles.selectedImage} />}
                        <Button title="Upload Image" onPress={handleImageUpload} />
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
                            style={[styles.button, { backgroundColor: '#FFD700' }]}
                            onPress={handleSubmit}
                            underlayColor="#EAEAEA"
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
        width: 200, // Adjust the width of the selected image
        height: 200, // Adjust the height of the selected image
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
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
});

export default AddForumPostModal;
