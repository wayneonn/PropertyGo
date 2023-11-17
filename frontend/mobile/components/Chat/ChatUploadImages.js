import {Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import FullScreenImage from "../../screens/propertyListings/FullScreenImage";
import React, {useContext, useState} from "react";
import * as ImagePicker from "expo-image-picker";
import {Ionicons} from "@expo/vector-icons";
import {uploadCompanyPhotos} from "../../utils/partnerApi";
import {AuthContext} from "../../AuthContext";
import {BASE_URL} from "../../utils/documentApi";

const MAX_HORIZONTAL_IMAGES = 10;

const ChatUploadImages = ({isVisible, onClose, chatId, sendMessage}) => {
    const [images, setImages] = useState([])
    const [fullScreenImage, setFullScreenImage] = useState(null);
    const [description, setDescription] = useState("")
    const {user} = useContext(AuthContext);
    const handleChoosePhoto = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            console.warn('Permission to access photos was denied');
            return;
        }

        // Check if the number of selected photos is already 10 or more
        if (images.length >= 10) {
            Alert.alert('Limit Exceeded', 'You can only select up to 10 photos.');
            return;
        }

        const options = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            // allowsEditing: true,
            quality: 1,
        };

        let response = await ImagePicker.launchImageLibraryAsync(options);

        if (!response.cancelled) {
            setImages([...images, response]);
        }
    };

    const handleImagePress = (index) => {
        Alert.alert(
            'Choose an action',
            'Do you want to replace or remove this image?',
            [
                {
                    text: 'View Image',
                    onPress: () => viewImage(index),
                },
                {
                    text: 'Replace',
                    onPress: () => replaceImage(index),
                },
                {
                    text: 'Remove',
                    onPress: () => removeImage(index),
                    style: 'destructive',
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ]
        );
    };

    const viewImage = (index) => {
        console.log("View Image: ", images[index].uri)
        setFullScreenImage(images[index].uri)
    }

    const removeImage = (index) => {
        const updatedImages = [...images];
        updatedImages.splice(index, 1);
        setImages(updatedImages);
    };

    const replaceImage = async (index) => {
        const permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            console.warn('Permission to access photos was denied');
            return;
        }

        const options = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        };

        let response = await ImagePicker.launchImageLibraryAsync(options);

        if (!response.cancelled) {
            const updatedImages = [...images];
            updatedImages[index] = response;
            setImages(updatedImages);
        }
    };

    const uploadChatPhotos = async () => {
            try {
                const formData = new FormData();

                images.forEach((image, index) => {
                    console.log("URI: ", image.uri)
                    const imageBlob = {
                        uri: image.uri,
                        type: 'image/jpeg',
                        name: `companyImage${index}.jpg`,
                    };

                    formData.append(`images`, imageBlob);
                })

                console.log(chatId)

                // I am boosted.
                const response = await fetch(`${BASE_URL}/user/${chatId}/addChatPhotos`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data)
                    return {success: true, data: data};
                } else {
                    const errorData = await response.json();
                    console.log("Image upload error data: ", errorData)
                    return {success: false, message: errorData.error};
                }
            } catch (error) {
                return {success: false, message: error.message};
            }
        }

    const handleSubmit = async () => {
        // Validation checks
        if (images.length === 0) {
            Alert.alert('No images selected', 'Please select at least one image.');
            return;
        }

        try {
            const res = await uploadChatPhotos()
            if (res.success) {
                Alert.alert(
                    'Upload Succeeded',
                    'The photos has been created successfully.'
                );
                res.data.successImages.forEach((item, index, array) => {
                    if (Object.is(array.length - 1, index)) {
                        setTimeout(() => {
                            sendMessage(`Image ID: ${item} sent. \nImage Description: \n${description}`);
                        }, 300);
                    } else {
                        sendMessage(`Image ID: ${item} sent.`)
                    }
                })
                onClose();
            } else {
                Alert.alert(
                    "Some error occurred",
                    `Please try again. ${res}`
                )
            }
        } catch (error) {
            console.error("Error uploading photos. ", error)
        }

    }

    const handleDescriptionChange = (text) => {
        setDescription(text);
    };

    return (
        <>
            <Modal
                animationType="slide"
                transparent={false}
                visible={isVisible}
                onRequestClose={onClose}
            >
                <View style={styles.container}>
                        <ScrollView>
                            <View style={styles.imageRow}>
                                {/* Add a View to hold the Add Image button */}
                                <View>
                                    <TouchableOpacity onPress={handleChoosePhoto} style={styles.imagePicker}>
                                        <Icon name="camera" size={40} color="#aaa"/>
                                    </TouchableOpacity>
                                </View>

                                {/* Map over the images */}
                                {images.map((image, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => handleImagePress(index)}
                                        style={styles.imageContainer}
                                    >
                                        <Image source={{uri: image.uri}} style={styles.image}/>
                                    </TouchableOpacity>
                                ))}
                                {images && images.length > 0 ? <TextInput
                                    style={styles.input}
                                    placeholder="Enter Image Description"
                                    value={description}
                                    onChangeText={handleDescriptionChange}
                                />: null}
                            </View>
                        </ScrollView>

                    <FullScreenImage
                        imageUrl={fullScreenImage}
                        onClose={() => setFullScreenImage(null)} // Close the full-screen image view
                    />
                    <TouchableOpacity style={[styles.saveChangesButton, {marginBottom: 10, marginHorizontal: 5}]} onPress={handleSubmit}>
                        <Ionicons name="save-outline" size={18} color="white"/>
                        <Text style={styles.saveChangesButtonText}>Submit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.selectDocumentButton, {marginBottom: 10, marginHorizontal: 5}]}
                        onPress={onClose}
                    >
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Ionicons name="close-circle" size={24} color="white"/>
                            <Text style={styles.buttonText}>Hide</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </Modal>
        </>
        )
}

const styles = StyleSheet.create({
    // General container style
    container: {
        flex: 1,
        backgroundColor: '#f4f4f8', // Lighter shade for a cleaner look
        padding: 20,
    },
    // Adjusted for better readability and spacing
    imageRow: {
        flexDirection: 'row',
        flexWrap: "wrap",
        justifyContent: "flex-start",
        marginBottom: 15,
        paddingVertical: 12,
    },
    // Enhanced button for adding images
    imagePicker: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e7e7eb', // Soft grey for a subtle look
        width: 100,
        height: 100,
        borderRadius: 10, // Rounded corners
        marginRight: 10,
        marginTop: 10
    },
    // Image container with improved visibility
    imageContainer: {
        position: 'relative',
        marginRight: 10,
        marginTop: 10,
        borderRadius: 10, // Rounded corners for images
        overflow: 'hidden', // Ensures the rounded corners effect
        shadowColor: "#000", // Shadow for depth
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    image: {
        width: 100,
        height: 100,
    },
    input: {
        height: 50,
        marginTop: 10,
        textAlignVertical: 'top',
        borderRadius: 5,
        borderColor: '#ccc',
        borderWidth: 1,
        // marginBottom: 10,
        paddingHorizontal: 10,
        paddingVertical: 12,
        width: '100%', // Make the input take full width
    },
    // Submit button with enhanced styling
    saveChangesButton: {
        backgroundColor: '#4CAF50', // More vibrant green
        padding: 12,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    saveChangesButtonText: {
        color: 'white',
        marginLeft: 10,
        fontWeight: 'bold', // Bold text for emphasis
    },
    // Close button styling
    selectDocumentButton: {
        backgroundColor: '#3498db',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20, // Increased margin for better spacing
        marginHorizontal: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ChatUploadImages;