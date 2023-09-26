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
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createProperty } from '../../utils/api';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from the correct library

const propertyTypes = [
  { label: 'Select Property Type', value: '' },
  { label: 'Resale', value: 'Resale' },
  { label: 'New Launch', value: 'New Launch' },
];

export default function PropertyListing() {
  const [property, setProperty] = useState({
    title: 'Sample Title',
    description:
      'Sample Description (You can add a longer description here.)',
    price: '100000', // Add a dollar symbol to the price
    offeredPrice: '90000', // Add a dollar symbol to the offered price
    bed: '2',
    bathroom: '2',
    size: '1200',
    tenure: 1,
    propertyType: '',
    propertyStatus: 'ACTIVE',
    userId: 1,
  });

  const [images, setImages] = useState([]);
  const [propertyTypeVisible, setPropertyTypeVisible] = useState(false);

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

    // Convert property type to uppercase
    let propertyTypeUpperCase = property.propertyType.toUpperCase();

    // Check if propertyType is 'New Launch' and convert it to 'NEW_LAUNCH'
    if (propertyTypeUpperCase === 'NEW LAUNCH') {
      propertyTypeUpperCase = 'NEW_LAUNCH';
    }

    try {
      const { success, data, message } = await createProperty(
        {
          ...property,
          price: property.price.replace(/\$/g, ''), // Remove dollar symbol
          offeredPrice: property.offeredPrice.replace(/\$/g, ''), // Remove dollar symbol
          propertyType: propertyTypeUpperCase, // Set property type to uppercase
        },
        images
      );

      if (success) {
        Alert.alert(
          'Property Created',
          'The property listing has been created successfully.'
        );
      } else {
        Alert.alert('Error', `Failed to create property: ${message}`);
      }
    } catch (error) {
      console.log('Error uploading property:', error);
      Alert.alert(
        'Error',
        'An error occurred while creating the property listing.'
      );
    }
  };


  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
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
              <Image source={{ uri: image.uri }} style={styles.image} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            placeholder="Title"
            value={property.title}
            onChangeText={(text) => setProperty({ ...property, title: text })}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Bed</Text>
          <TextInput
            placeholder="Bed"
            value={property.bed}
            onChangeText={(text) => setProperty({ ...property, bed: text })}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Bathroom</Text>
          <TextInput
            placeholder="Bathroom"
            value={property.bathroom}
            onChangeText={(text) =>
              setProperty({ ...property, bathroom: text })
            }
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Size</Text>
          <TextInput
            placeholder="Size"
            value={property.size}
            onChangeText={(text) => setProperty({ ...property, size: text })}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            placeholder="Description"
            value={property.description}
            onChangeText={(text) =>
              setProperty({ ...property, description: text })
            }
            style={[styles.input, styles.largeTextInput]}
            multiline={true}
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Price</Text>
          <TextInput
            placeholder="$ Price"
            value={property.price}
            onChangeText={(text) => setProperty({ ...property, price: text })}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Property Type</Text>
          <TouchableOpacity
            style={styles.propertyTypePickerButton}
            onPress={() => setPropertyTypeVisible(true)}
          >
            <Text style={styles.propertyTypePickerText}>
              {property.propertyType
                ? property.propertyType.charAt(0).toUpperCase() +
                property.propertyType.slice(1)
                : 'Select Property Type'}
            </Text>
            <Icon name="caret-down" size={20} color="black" />
          </TouchableOpacity>
        </View>

        <Modal
          transparent={true}
          animationType="slide"
          visible={propertyTypeVisible}
          onRequestClose={() => setPropertyTypeVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Picker
              selectedValue={property.propertyType}
              onValueChange={(value) =>
                setProperty({ ...property, propertyType: value })
              }
              style={styles.picker}
            >
              {propertyTypes.map((type, index) => (
                <Picker.Item
                  key={index}
                  label={type.label}
                  value={type.value}
                />
              ))}
            </Picker>
            <View style={styles.okButtonContainer}>
              <Button
                title="OK"
                onPress={() => setPropertyTypeVisible(false)}
              />
            </View>
          </View>
        </Modal>
      </ScrollView>

      <TouchableOpacity style={styles.saveChangesButton} onPress={handleSubmit}>
        <Ionicons name="save-outline" size={18} color="white" />
        <Text style={styles.saveChangesButtonText}>Save Changes</Text>
      </TouchableOpacity>

    </View>
  );
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
  },
  largeTextInput: {
    height: 120,
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
});
