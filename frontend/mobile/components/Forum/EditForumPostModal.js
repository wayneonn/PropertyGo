import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, TouchableHighlight, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ImageGallery from './ImageGallery';

const EditForumPostModal = ({ isVisible, onCancel, onSubmit, post }) => {
    const [title, setTitle] = useState(post.title);
    const [message, setMessage] = useState(post.message);
    // const [images, setImages] = useState(post.images);
    // const [selectedImageIndex, setSelectedImageIndex] = useState(null);

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

    // const handleImageUpload = async () => {
    //     const result = await ImagePicker.launchImageLibraryAsync({
    //         mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //         allowsEditing: true,
    //         quality: 1,
    //     });

    //     if (!result.canceled) {
    //         const selectedImages = result.assets.map(asset => asset.uri);
    //         setImageUris([...imageUris, ...selectedImages]);
    //     }
    //     // console.log(imageUris);
    // };

    // const handleImageRemove = (index) => {
    //     const updatedImageUris = [...imageUris];
    //     updatedImageUris.splice(index, 1);
    //     setImageUris(updatedImageUris);

    //     // Clear the selected image if it was removed
    //     if (selectedImageIndex === index) {
    //         setSelectedImageIndex(null);
    //     }
    // };

    const handleSubmit = async () => {


        // const formData = new FormData();
        // const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;


        // // Append each image to the formData
        // for (let i = 0; i < imageUris.length; i++) {
        //     const imageUri = imageUris[i];
        //     formData.append("images", {
        //         uri: imageUri,
        //         type: "image/jpeg",
        //         name: `image${uniqueId}_${i}.jpg`,
        //     });
        // }
        // formData.append('title', title);
        // formData.append('message', message);
        // formData.append('forumTopicId', forumTopicId);

        // console.log(formData);

        const postDetails = {
            forumPostId: post.forumPostId,
            title,
            message,
        };

        // console.log(postDetails);

        onSubmit(postDetails);

        // Close the modal
        onCancel();
    };

    const handleCancel = () => {
        setTitle(post.title);
        setMessage(post.message);

        // Close the modal
        onCancel();
    };

    return (
        <Modal transparent={true} animationType="slide" visible={isVisible}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Edit Forum Post</Text>
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

                        <ImageGallery images={post.images} />
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

export default EditForumPostModal;
