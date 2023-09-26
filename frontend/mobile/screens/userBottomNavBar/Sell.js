import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert, // Import Alert from React Native
} from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Import from expo-image-picker
import Icon from 'react-native-vector-icons/FontAwesome';

export default function PropertyListing() {
  const [property, setProperty] = useState({
    title: 'Sample Title',
    description: 'Sample Description',
    price: '100000', // Add a sample price
    offeredPrice: '90000', // Add a sample offeredPrice
    bed: '2', // Add a sample bed count
    bathroom: '2', // Add a sample bathroom count
    size: '1200', // Add a sample size
    tenure: 1, // Add a sample tenure
    propertyType: 'RESALE', // Add a sample propertyType
    propertyStatus: "ACTIVE", // Add a sample propertyStatus
    userId: 1, // Add a sample userId
  });
  

  const [images, setImages] = useState([]); // Store selected images as an array

  const handleChoosePhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

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
      // Append the selected image to the images array
      setImages([...images, response]);
    }
  };

  const handleImagePress = (index) => {
    Alert.alert(
      'Choose an action',
      'Do you want to replace or remove this image?',
      [
        {
          text: 'Replace',
          onPress: () => replaceImage(index),
        },
        {
          text: 'Remove',
          onPress: () => removeImage(index),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const replaceImage = async (index) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

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

  const removeImage = (index) => {
    // Remove the image at the specified index
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  const handleSubmit = async () => {
    if (images.length === 0) {
      console.warn('No images selected');
      return;
    }

    // Convert images into blobs to send as FormData
    const formData = new FormData();

    images.forEach((image, index) => {
      const imageBlob = {
        uri: image.uri,
        type: 'image/jpeg',
        name: `propertyImage${index}.jpg`,
      };

      formData.append(`images`, imageBlob);
    });

    formData.append('property', JSON.stringify(property));

    try {
      const response = await fetch('http://localhost:3000/property', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log('Error uploading property:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.imageRow} // Added styling for the row
      >
        <TouchableOpacity onPress={handleChoosePhoto} style={styles.imagePicker}>
          <Icon name="camera" size={40} color="#aaa" />
        </TouchableOpacity>

        {images.map((image, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleImagePress(index)} // Handle image press with alert
            style={styles.imageContainer}
          >
            <Image
              source={{ uri: image.uri }}
              style={styles.image}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TextInput
        placeholder="Title"
        value={property.title}
        onChangeText={(text) =>
          setProperty((prevState) => ({ ...prevState, title: text }))
        }
        style={styles.input}
      />
      <TextInput
        placeholder="Property Type (RESALE/NEW_LAUNCH)"
        value={property.propertyType}
        onChangeText={(text) => setProperty(prevState => ({ ...prevState, propertyType: text }))}
        style={styles.input}
      />
      <TextInput
        placeholder="Bed"
        value={property.bed}
        onChangeText={(text) => setProperty(prevState => ({ ...prevState, bed: text }))}
        style={styles.input}
      />
      <TextInput
        placeholder="Bathroom"
        value={property.bathroom}
        onChangeText={(text) => setProperty(prevState => ({ ...prevState, bathroom: text }))}
        style={styles.input}
      />
      <TextInput
        placeholder="Size"
        value={property.size}
        onChangeText={(text) => setProperty(prevState => ({ ...prevState, size: text }))}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={property.description}
        onChangeText={(text) => setProperty(prevState => ({ ...prevState, description: text }))}
        style={styles.input}
      />
      <TextInput
        placeholder="Price"
        value={property.price}
        onChangeText={(text) => setProperty(prevState => ({ ...prevState, price: text }))}
        style={styles.input}
      />

      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderColor: 'gray',
    flex: 2, 
    borderWidth: 1,
    marginBottom: 5, // Reduce vertical margin
    padding: 8,
    height: 40,
  },
  imageRow: {
    flexDirection: 'row', // Arrange items horizontally
    marginBottom: 10, // Adjust margin as needed
    paddingVertical: 10, // Add some vertical padding to the row
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
  },
  image: {
    width: 100,
    height: 100,
  },
});