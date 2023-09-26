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
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createProperty } from '../../utils/api'; // Import the createProperty function


export default function PropertyListing() {
  const [property, setProperty] = useState({
    title: 'Sample Title',
    description:
      'Sample Description (You can add a longer description here.)', // Adjust the initial description
    price: '100000',
    offeredPrice: '90000',
    bed: '2',
    bathroom: '2',
    size: '1200',
    tenure: 1,
    propertyType: 'RESALE',
    propertyStatus: 'ACTIVE',
    userId: 1,
  });

  const [images, setImages] = useState([]);

  const handleChoosePhoto = async () => {
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

  const removeImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  const handleSubmit = async () => {
    if (images.length === 0) {
      Alert.alert('No images selected', 'Please select at least one image.');
      return;
    }

    try {
      // Call the createProperty function to create the property listing
      const { success, data, message } = await createProperty(property, images);

      if (success) {
        // Property created successfully
        Alert.alert('Property Created', 'The property listing has been created successfully.');
      } else {
        // Property creation failed, show an error message
        Alert.alert('Error', `Failed to create property: ${message}`);
      }
    } catch (error) {
      console.log('Error uploading property:', error);
      Alert.alert('Error', 'An error occurred while creating the property listing.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageRow}>
        <TouchableOpacity onPress={handleChoosePhoto} style={styles.imagePicker}>
          <Icon name="camera" size={40} color="#aaa" />
        </TouchableOpacity>

        {images.map((image, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleImagePress(index)}
            style={styles.imageContainer}
          >
            <Image
              source={{ uri: image.uri }}
              style={styles.image}
            />
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        placeholder="Title"
        value={property.title}
        onChangeText={(text) => setProperty({ ...property, title: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Property Type (RESALE/NEW_LAUNCH)"
        value={property.propertyType}
        onChangeText={(text) => setProperty({ ...property, propertyType: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Bed"
        value={property.bed}
        onChangeText={(text) => setProperty({ ...property, bed: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Bathroom"
        value={property.bathroom}
        onChangeText={(text) => setProperty({ ...property, bathroom: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Size"
        value={property.size}
        onChangeText={(text) => setProperty({ ...property, size: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={property.description}
        onChangeText={(text) => setProperty({ ...property, description: text })}
        style={[styles.input, styles.largeTextInput]} // Larger TextInput
        multiline={true}
        numberOfLines={4}
      />
      <TextInput
        placeholder="Price"
        value={property.price}
        onChangeText={(text) => setProperty({ ...property, price: text })}
        style={styles.input}
      />

      <Button title="Submit" onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10, // Increased margin
    padding: 8,
    height: 40,
  },
  largeTextInput: {
    height: 120, // Increased height for larger input
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
  },
  image: {
    width: 100,
    height: 100,
  },
});
