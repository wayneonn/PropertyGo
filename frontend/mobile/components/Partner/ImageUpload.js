import {Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import FullScreenImage from "../../screens/propertyListings/FullScreenImage";
import React, {useContext, useState} from "react";
import * as ImagePicker from "expo-image-picker";
import {Ionicons} from "@expo/vector-icons";
import {uploadCompanyPhotos} from "../../utils/partnerApi";
import {AuthContext} from "../../AuthContext";

export const ImageUpload = ({images, setImages}) => {
    const [fullScreenImage, setFullScreenImage] = useState(null);
    const { user } = useContext(AuthContext);
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

    const handleSubmit = async() => {
        // Validation checks
        if (images.length === 0) {
            Alert.alert('No images selected', 'Please select at least one image.');
            return;
        }

        try {
            const res = await uploadCompanyPhotos(user.user.userId, images)
            console.log("This is the result:", res)
            const result = res.json()
            if (res.success) {
                Alert.alert(
                    'Upload Succeeded',
                    'The photos has been created successfully.'
                );
            } else {
                Alert.alert(
                    "Some error occurred",
                    `Please try again. ${res.data}`
                )
            }
        } catch (error) {
            console.error("Error uploading photos. ", error)
        }

    }

    return (
        <>
        <View style={styles.imageRow}>
        <ScrollView horizontal={true}>
            {/* Add a View to hold the Add Image button */}
            <View>
                <TouchableOpacity onPress={handleChoosePhoto} style={styles.imagePicker}>
                    <Icon name="camera" size={40} color="#aaa" />
                </TouchableOpacity>
            </View>

            {/* Map over the images */}
            {images.map((image, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => handleImagePress(index)}
                    style={styles.imageContainer}
                >
                    <Image source={{ uri: image.uri }} style={[styles.image, {width: 100, height: 100}]} />
                </TouchableOpacity>
            ))}
        </ScrollView>
    </View>

    <FullScreenImage
        imageUrl={fullScreenImage}
        onClose={() => setFullScreenImage(null)} // Close the full-screen image view
    />
            <TouchableOpacity style={styles.saveChangesButton} onPress={handleSubmit}>
                <Ionicons name="save-outline" size={18} color="white" />
                <Text style={styles.saveChangesButtonText}>Submit</Text>
            </TouchableOpacity>

        </>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    scrollView: {
        flex: 1,
        marginBottom: 10, // Adjust this margin to avoid overlap with the navigation bar
    },
    inputContainer: {
        marginBottom: 10,
    },
    label: {
        marginBottom: 5,
        fontWeight: 'bold',
    },
    input: {
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 8,
        height: 40,
        borderRadius: 5,
    },
    largeTextInput: {
        height: 120,
    },
    mediumTypeInput: {
        height: 60,
    },
    imageRow: {
        flexDirection: 'row',
        marginBottom: 10,
        paddingVertical: 10,
    },
    imagePicker: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ddd',
        width: 100,
        height: 100,
        marginRight: 10,
    },
    imageContainer: {
        position: 'relative',
        marginRight: 10,
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
    propertyTypePickerButton: {
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        borderColor: 'gray',
        fontSize: 14,
        padding: 8,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    propertyTypePickerText: {
        fontSize: 14,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingBottom: 20, // Add padding to make the button visible
    },
    picker: {
        backgroundColor: 'white',
    },
    okButtonContainer: {
        backgroundColor: 'white',
    },
    saveChangesButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center', // Center horizontally
        flexDirection: 'row',
        justifyContent: 'center', // Center vertically
        width: '60%',
        marginLeft: 70,
    },
    saveChangesButtonText: {
        color: 'white',
        marginLeft: 10,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 90,
    },
    selectDocumentButton: {
        backgroundColor: '#3498db', // Change the background color as needed
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },

    selectDocumentButtonText: {
        color: 'white', // Change the text color as needed
        fontSize: 16,
        fontWeight: 'bold',
    },
    scrollViewContent: {
        paddingBottom: 100, // Adjust this value as needed to ensure the input field is visible
    },
    uploadDocumentButton: {
        backgroundColor: '#3498db', // Change the background color as per your design
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
        marginTop: 10,
        marginRight: 10,
    },
    uploadDocumentButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },

    // Style for Remove Document button
    removeDocumentButton: {
        backgroundColor: 'red', // Change the background color as per your design
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
        marginTop: 10, // Add some top margin for spacing
        marginRight: 10,
    },
    viewDocumentButton: {
        backgroundColor: 'green', // Change the background color as per your design
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
        marginTop: 10, // Add some top margin for spacing
        marginRight: 10,
    },
    removeDocumentButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },

    // Style for Selected Document container
    selectedDocumentContainer: {
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 8,
        padding: 10,
        marginTop: 10, // Add some top margin for spacing
    },
    selectedDocumentText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    selectedDocumentName: {
        fontSize: 16,
        marginTop: 0, // Add some top margin for spacing
    },
});