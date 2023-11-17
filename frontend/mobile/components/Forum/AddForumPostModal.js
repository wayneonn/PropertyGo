import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, TouchableHighlight, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AntDesign } from '@expo/vector-icons';

const AddForumPostModal = ({ forumTopicId, isVisible, onCancel, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [imageUris, setImageUris] = useState([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access camera roll is required!');
            }
        })();
    }, []);

    const handleTitleChange = (text) => {
        setTitle(text);
    };

    const handleMessageChange = (text) => {
        setMessage(text);
    };

    const handleImageUpload = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
            multiple: true,
        });

        if (!result.canceled) {
            const selectedImages = result.assets.map(asset => asset.uri);
            // Check the number of selected images before adding them
            if (imageUris.length + selectedImages.length <= 5) {
                setImageUris([...imageUris, ...selectedImages]);
            }
        }
    };

    const handleImageRemove = (index) => {
        const updatedImageUris = [...imageUris];
        updatedImageUris.splice(index, 1);
        setImageUris(updatedImageUris);

        // Clear the selected image if it was removed
        if (selectedImageIndex === index) {
            setSelectedImageIndex(null);
        }
    };

    const handleSubmit = async () => {


        const formData = new FormData();
        const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;


        // Append each image to the formData
        for (let i = 0; i < imageUris.length; i++) {
            const imageUri = imageUris[i];
            formData.append("images", {
                uri: imageUri,
                type: "image/jpeg",
                name: `image${uniqueId}_${i}.jpg`,
            });
        }
        formData.append('title', title);
        formData.append('message', message);
        formData.append('forumTopicId', forumTopicId);

        console.log(formData);

        // const postDetails = {
        //     forumTopicId,
        //     title,
        //     message,
        //     formData,
        // };

        // console.log(postDetails);

        onSubmit(formData);

        setTitle('');
        setMessage('');
        setImageUris([]);

        // Close the modal
        onCancel();
    };

    const handleCancel = () => {
        setTitle('');
        setMessage('');
        setImageUris([]);
        setSelectedImageIndex(null);

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
                            multiline
                        />
                        <Text style={styles.label}>Message:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Message"
                            value={message}
                            onChangeText={handleMessageChange}
                            multiline
                        />

                        {imageUris.length !== 0 ? <Text style={styles.warningLabel}>Upload Maximum of 5 Images!</Text> : null}
                        <ScrollView horizontal>
                            {imageUris.map((uri, index) => (
                                <View key={index} style={{ margin: 5, position: 'relative' }}>
                                    <Image source={{ uri }} style={styles.selectedImage} />
                                    <TouchableHighlight
                                        style={styles.removeImageButton}
                                        onPress={() => handleImageRemove(index)}
                                        underlayColor="#EAEAEA"
                                    >
                                        <AntDesign name="delete" size={24} color="black" />
                                    </TouchableHighlight>
                                </View>

                            ))}
                        </ScrollView>
                        {/* <Text style={styles.warningLabel}>Upload Maximum of 5 Images!</Text> */}
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
                            style={[
                                styles.button,
                                { backgroundColor: '#FFD700' }, // Yellow background for submit button
                                (title.trim() === '' || message.trim() === '') && styles.buttonDisabled, // disabled when topicName is empty
                            ]}
                            onPress={handleSubmit}
                            underlayColor="#EAEAEA"
                            disabled={(title.trim() === '' || message.trim() === '')} // Disable the button if topicName is empty
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
        marginBottom: 230,
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
    warningLabel: {
        fontSize: 12,
        // marginTop: 10,
        // marginBottom: 5,
        textAlign: 'left',
        alignSelf: 'flex-start',
        color: "red",
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

export default AddForumPostModal;
