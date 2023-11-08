import React, { useEffect, useState, useContext } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import Swiper from 'react-native-swiper';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  editProperty, getPropertyListing, getImageUriById,
  removeImageById, updateImageById, createImageWithPropertyId
} from '../../utils/api';
import DefaultImage from '../../assets/No-Image-Available.webp';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../AuthContext';
import base64 from 'react-native-base64';
import { getAreaAndRegion } from '../../services/GetAreaAndRegion';
import FullScreenImage from './FullScreenImage';

const EditPropertyListing = ({ route }) => {
  const { propertyListingId } = route.params;
  const [images, setImages] = useState([]);
  const [imageIdArray, setImageIdArray] = useState([]);
  const navigation = useNavigation();
  const [propertyTypeVisible, setPropertyTypeVisible] = useState(false);
  const { user } = useContext(AuthContext);
  const [propertyListing, setPropertyListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fullScreenImage, setFullScreenImage] = useState(null);

  const [propertyData, setPropertyData] = useState({
    title: '',
    description: '',
    price: '',
    optionFee: '',
    optionExerciseFee: '',
    bed: '',
    bathroom: '',
    tenure: '',
    size: '',
    postalCode: '',
    address: '',
    roomType: '',
    propertyType: '', // You should also initialize propertyType here if it's part of propertyData
  });

  // Function to format the price with dollar sign and commas
  const formatPrice = (price) => {
    return `$${price.replace(/\D/g, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`;
  };


  // Initialize formattedPrice and rawPrice with the initial price from propertyData
  const [formattedPrice, setFormattedPrice] = useState(
    formatPrice(propertyData.price.toString())
  );
  const [formattedOptionPrice, setFormattedOptionPrice] = useState(formatPrice(propertyData.optionFee.toString()));
  const [formattedOptionExercisePrice, setFormattedOptionExercisePrice] = useState(formatPrice(propertyData.optionExerciseFee.toString()));
  const [rawPrice, setRawPrice] = useState(propertyData.price.toString());
  const [rawOptionPrice, setOptionRawPrice] = useState(propertyData.optionFee.toString());
  const [rawOptionExercisePrice, setOptionExerciseRawPrice] = useState(propertyData.optionExerciseFee.toString());

  const handleOptionPriceChange = (text) => {
    const raw = text.replace(/[^0-9]/g, '');
    setFormattedOptionPrice(formatPrice(raw));
    setOptionRawPrice(raw);
  };

  const handleOptionExercisePriceChange = (text) => {
    const raw = text.replace(/[^0-9]/g, '');
    setFormattedOptionExercisePrice(formatPrice(raw));
    setOptionExerciseRawPrice(raw);
  };

  const [property, setProperty] = useState({
  });

  const propertyTypes = [
    { label: 'Select Property Type', value: '' },
    { label: 'Resale', value: 'Resale' },
    { label: 'New Launch', value: 'New Launch' },
  ]

  const [roomTypeVisible, setRoomTypeVisible] = useState(false);
  const roomTypes = [
    { label: 'Select Room Type', value: '' },
    { label: '1 Room', value: '1_ROOM' },
    { label: '2 Room', value: '2_ROOM' },
    { label: '3 Room', value: '3_ROOM' },
    { label: '4 Room', value: '4_ROOM' },
    { label: '5 Room', value: '5_ROOM' },
    { label: 'Executive', value: 'EXECUTIVE' },
  ]

  // Function to remove dollar sign and commas and save raw price
  const handlePriceChange = (text) => {
    // Remove dollar sign and commas
    const raw = text.replace(/[^0-9]/g, '');

    // Update rawPrice here
    setRawPrice(raw);

    // Format and update formattedPrice
    setFormattedPrice(formatPrice(raw));
  };



  const handleSubmit = async () => {
    // Validation checks
    console.log(propertyData)
    if (images.length === 0) {
      Alert.alert('No images selected', 'Please select at least one image.');
      return;
    }

    // Parse the formatted price to remove dollar sign and commas
    console.log(' price:', propertyData.price);
    console.log('Raw price:', rawPrice);
    let price = rawPrice ? parseInt(rawPrice, 10) : 0;
    let optionPrice = rawOptionPrice ? parseInt(rawOptionPrice, 10) : 0;
    let optionExercisePrice = rawOptionExercisePrice ? parseInt(rawOptionExercisePrice, 10) : 0;

    if (!rawPrice) {
      price = propertyData.price;
    } else if (!price || price <= 0) {
      Alert.alert('Invalid Price', 'Price must be a numeric value.');
      return;
    }

    if (!optionPrice) {
      optionPrice = propertyData.optionFee;
    } else if (!optionPrice || optionPrice <= 0) {
      Alert.alert('Invalid Option Price', 'Option Price must be a numeric value.');
      return;
    }

    if (!optionExercisePrice) {
      optionExercisePrice = propertyData.optionExerciseFee;
    } else if (!optionExercisePrice || optionExercisePrice <= 0) {
      Alert.alert('Invalid Option Exercise Price', 'Option Exercise Price must be a numeric value.');
      return;
    }

    if (!/^\d+$/.test(propertyData.size)) {
      Alert.alert('Invalid Size', 'Size must be a numeric value.');
      return;
    }

    if (!/^\d+$/.test(propertyData.bed)) {
      Alert.alert('Invalid Bed', 'Bed must be a numeric value.');
      return;
    }

    if (!/^\d+$/.test(propertyData.bathroom)) {
      Alert.alert('Invalid Bathroom', 'Bathroom must be a numeric value.');
      return;
    }

    if (propertyData.propertyType === '') {
      Alert.alert('Property Type Not Selected', 'Please select a property type.');
      return;
    }

    if (
      propertyData.title.trim() === '' ||
      propertyData.description.trim() === '' ||
      propertyData.unitNumber.trim() === '' ||
      propertyData.postalCode.trim() === '' ||
      propertyData.address.trim() === ''
    ) {
      Alert.alert('Missing Information', 'Please fill in all fields.');
      return;
    }

    // Check if propertyData.offeredPrice is defined before replacing characters
    // const offeredPrice = propertyData.offeredPrice ? propertyData.offeredPrice.replace(/\$/g, '') : '';

    // Other checks and API call
    try {

      let propertyTypeUpperCase = propertyData.propertyType.toUpperCase();
      if (propertyTypeUpperCase === 'NEW LAUNCH') {
        propertyTypeUpperCase = 'NEW_LAUNCH';
      }

      const { success, data, message } = await editProperty(
        propertyListingId, // Pass the propertyListingId
        {
          ...propertyData,
          price: price,
          optionFee: optionPrice,
          optionExerciseFee: optionExercisePrice,
          propertyType: propertyTypeUpperCase,
          flatType: property.roomType,
        }
      );

      if (success) {
        console.log('Property updated successfully:');
        Alert.alert(
          'Property Updated',
          'The property listing has been updated successfully.'
        );
        navigation.navigate('Property Listing', { propertyListingId });
      } else {
        Alert.alert('Error', `Failed to update property: ${message}`);
      }
    } catch (error) {
      console.log('Error updating property:', error);
      Alert.alert(
        'Error',
        'An error occurred while updating the property listing.'
      );
    }
  };




  // Function to fetch address based on postal code
  const fetchAddressByPostalCode = async (postalCode) => {
    if (postalCode.length === 6) {
      try {
        const response = await fetch(
          `https://developers.onemap.sg/commonapi/search?searchVal=${postalCode}&returnGeom=Y&getAddrDetails=Y`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.found === 1) {
            const address = data.results[0].ADDRESS;
            const { area, region } = await getAreaAndRegion(postalCode);

            // Update the postalCode field in the property state
            setPropertyData({
              ...propertyData,
              postalCode, // Update postalCode with the new value
              address,
              area,
              region,
            });
          } else {
            Alert.alert('Invalid Postal Code', 'No address found for the postal code.');
            setPropertyData({ ...propertyData, postalCode: '', address: '' }); // Clear postalCode and address
          }
        } else {
          console.error('API request failed.');
        }
      } catch (error) {
        console.error('Error fetching address:', error);
      }
    }
  };

  // Event listener for postal code input
  const handlePostalCodeChange = (text) => {
    // Restrict input to a maximum of 6 digits
    if (/^\d{0,6}$/.test(text)) {
      // Update the postalCode field in the property state
      setPropertyData({
        ...propertyData,
        postalCode: text, // Update postalCode with the new value
      });

      // Call the function to fetch the address
      if (text.length === 6) {
        fetchAddressByPostalCode(text);
      }
    }
  };


  useEffect(() => {
    // Fetch property listing details using propertyListingId from your API
    fetchPropertyListing(propertyListingId);
  }, [propertyListingId]);

  useEffect(() => {
    // Fetch images based on propertyListingId
    fetchImages(propertyListingId);
  }, [propertyListingId, images]); // You can keep images here if you want to refresh the images when it changes

  const fetchImages = async (propertyListingId) => {
    try {
      // Fetch images based on propertyListingId and update the images state
      const imageArray = await fetchImageArray(propertyListingId);
      setImageIdArray(imageArray);
    } catch (error) {
      console.error('Error fetching images:', error);
      // Handle the error appropriately, e.g., show an error message to the user
    }
  };

  const fetchPropertyListing = async (id) => {
    try {
      // Make an API call to fetch property listing details by id
      const response = await fetch(getPropertyListing(id));
      const data = await response.json();
      setPropertyListing(data); // Update state with the fetched data

      // Update the property data fields with fetched data
      setPropertyData({
        title: data.title,
        description: data.description,
        price: data.price.toString(),
        optionFee: data.optionFee.toString(),
        optionExerciseFee: data.optionExerciseFee.toString(),
        tenure: data.tenure.toString(),
        bed: data.bed.toString(),
        bathroom: data.bathroom.toString(),
        size: data.size.toString(),
        postalCode: data.postalCode.toString() || '', // Update postalCode (or provide a default value)
        address: data.address,
        unitNumber: data.unitNumber || '', // Update unitNumber (or provide a default value)
        propertyType: transformPropertyType(data.propertyType), // Transform propertyType label
        roomType: data.flatType,
      });

      // Update formattedPrice with the fetched price
      setFormattedPrice(formatPrice(data.price.toString()));
      setFormattedOptionPrice(formatPrice(data.optionFee.toString()));
      setFormattedOptionExercisePrice(formatPrice(data.optionExerciseFee.toString()));

      // Set the 'images' state with the fetched image URIs
      setImages(data.images.map((imageUri) => ({ uri: imageUri })));
      const imageArray = data.images.map((imageId) => ({ imageId, uri: getImageUriById(imageId) }));
      setImageIdArray(imageArray);

      // Set isLoading to false here
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching property listing:', error);
      setIsLoading(false); // Ensure that isLoading is set to false even on error
    }
  };

  const capitalizeWords = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\w/g, function (match) {
      return match.toUpperCase();
    });
  }

  // Function to transform property type label
  const transformPropertyType = (type) => {
    if (type === 'NEW_LAUNCH') {
      return 'New Launch';
    } else {
      return 'Resale'
    }
    // Handle other property type cases here if needed
    return type; // Return the type unchanged if not matched
  };

  const handleSaveChanges = async () => {
    try {
      const response = await editProperty(propertyListingId, propertyData, []);
      if (response.success) {
        // Property updated successfully, navigate back to the property listing screen
        navigation.navigate('Property Listing', { propertyListingId });
      } else {
        console.error('Error updating property:', response.message);
        // Handle the error appropriately, e.g., show an error message to the user
      }
    } catch (error) {
      console.error('Error updating property:', error);
      // Handle the error appropriately, e.g., show an error message to the user
    }
  };

  const handleChoosePhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      console.warn('Permission to access photos was denied');
      return;
    }

    if (images.length >= 10) {
      Alert.alert('Maximum Photos Reached', 'You cannot select more than 10 photos.');
      return;
    }

    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    };

    let response = await ImagePicker.launchImageLibraryAsync(options);

    if (!response.cancelled) {
      // Upload the selected image to the backend
      try {
        const { success, data, message } = await createImageWithPropertyId(
          propertyListingId, // Pass the propertyListingId
          response // Pass the whole response object
        );

        if (success) {
          // Add the newly uploaded image to the state
          const updatedImages = [...images, { uri: data.imageId }];
          setImages(updatedImages);

          // Show an alert for successful upload
          Alert.alert('Image Uploaded', 'The image has been successfully uploaded.');
        } else {
          console.error('Error uploading image:', message);
          // Handle the error appropriately, e.g., show an error message to the user
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        // Handle the error appropriately, e.g., show an error message to the user
      }
    }
  };



  const handleUpdateImage = async (index, imageId) => {
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
      // Create the updated image object
      const updatedImage = {
        uri: response.uri, // Use the uri field to specify the URI
        type: 'image/jpeg', // Modify the type according to your needs
        name: 'propertyImage.jpg',
      };

      // Call the updateImageById function with the imageId and updatedImage
      try {
        const { success, data, message } = await updateImageById(imageId, updatedImage);

        if (success) {
          // Show an alert for successful upload
          Alert.alert('Image Updated', 'The image has been successfully updated.');

          // Fetch the latest images from the API
          const updatedImages = await fetchLatestImages(propertyListingId);

          // Update the images state with the latest images
          setImages(updatedImages); // This should trigger a re-render
        } else {
          console.error('Error updating image:', message);
          // Handle the error appropriately, e.g., show an error message to the user
        }
      } catch (error) {
        console.error('Error updating image:', error);
        // Handle the error appropriately, e.g., show an error message to the user
      }
    }
  };

  // Function to fetch the latest images from the API
  const fetchLatestImages = async (propertyListingId) => {
    try {
      // Make an API call to fetch the latest property listing details
      const response = await fetch(getPropertyListing(propertyListingId));
      const data = await response.json();

      // Return the latest images from the fetched data
      return data.images.map((imageUri) => ({ uri: imageUri }));
    } catch (error) {
      console.error('Error fetching latest images:', error);
      return [];
    }
  };

  const viewImage = (index) => {
    console.log("View Image: ", images[index].uri)
    const imageUri = getImageUriById(images[index].uri);
    setFullScreenImage(`${imageUri}?timestamp=${new Date().getTime()}`)
  }

  const handleImagePress = async (index) => {
    // Display an alert with options to update or remove the image
    const imageId = imageIdArray[index].imageId;
    // console.log('imageId here ', imageId)
    Alert.alert(
      'Image Options',
      'Choose an action for this image:',
      [
        {
          text: 'View Image',
          onPress: () => viewImage(index),
        },
        {
          text: 'Update',
          onPress: () => handleUpdateImage(index, imageId),
        },
        {
          text: 'Remove',
          onPress: () => handleRemoveImage(index, imageId),
          style: 'destructive',
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const handleRemoveImage = async (index, imageId) => {
    try {
      const { success, message } = await removeImageById(
        imageId
      );

      if (success) {
        // Remove the image at the specified index from the 'images' state
        const updatedImages = [...images];
        updatedImages.splice(index, 1);
        setImages(updatedImages);
        Alert.alert('Image Removed', 'The image has been successfully removed.');
      } else {
        console.error('Error removing image:', message);
        // Handle the error appropriately, e.g., show an error message to the user
      }
    } catch (error) {
      console.error('Error removing image:', error);
      // Handle the error appropriately, e.g., show an error message to the user
    }
  };


  if (isLoading) {
    return <ActivityIndicator style={styles.loadingIndicator} />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled" // Add this prop
      >
        <View style={styles.headerContainer}>
          {/* Back button */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.header}>Edit Property Listing</Text>
        </View>
        <View style={styles.imageRow}>
          <ScrollView horizontal={true}>
            {/* Add a View to hold the Add Image button */}
            <View>
              <TouchableOpacity onPress={handleChoosePhoto} style={styles.imagePicker}>
                <Icon name="camera" size={40} color="#aaa" />
              </TouchableOpacity>
            </View>

            {/* Map over the images */}
            {images.map((image, index) => {
              const imageUri = getImageUriById(image.uri);
              // console.log('imageUri:', imageUri);
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleImagePress(index)}
                  style={styles.imageContainer}
                >
                  {imageUri ? (
                    <Image source={{ uri: `${imageUri}?timestamp=${new Date().getTime()}` }} style={styles.image} />

                  ) : (
                    <Image source={DefaultImage} style={styles.image} /> // Use a default image here
                  )}
                </TouchableOpacity>
              );
            })}


          </ScrollView>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            placeholder="Listing Title"
            placeholderTextColor="gray"
            value={propertyData.title}
            onChangeText={(text) =>
              setPropertyData({ ...propertyData, title: text }) // Fix the object reference to propertyData
            }
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Price</Text>
          <TextInput
            placeholder="$ Price"
            placeholderTextColor="gray"
            keyboardType="numeric"
            value={formattedPrice}
            onChangeText={handlePriceChange}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Option Fee</Text>
          <TextInput
            placeholder="$ Option Fee Price"
            placeholderTextColor="gray"
            value={formattedOptionPrice}
            keyboardType="numeric"
            onChangeText={handleOptionPriceChange}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Option Exercise Fee</Text>
          <TextInput
            placeholder="$ Option Exercise Fee Price"
            placeholderTextColor="gray"
            value={formattedOptionExercisePrice}
            keyboardType="numeric"
            onChangeText={handleOptionExercisePriceChange}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Size (sqm)</Text>
          <TextInput
            placeholder="Size (sqm)"
            placeholderTextColor="gray"
            keyboardType="numeric"
            value={propertyData.size}
            onChangeText={(text) =>
              setPropertyData({ ...propertyData, size: text }) // Fix the object reference to propertyData
            }
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Bedrooms</Text>
          <TextInput
            placeholder="Number of Bedrooms"
            placeholderTextColor="gray"
            keyboardType="numeric"
            value={propertyData.bed}
            onChangeText={(text) =>
              setPropertyData({ ...propertyData, bed: text }) // Fix the object reference to propertyData
            }
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Bathrooms</Text>
          <TextInput
            placeholder="Number of Bathrooms"
            placeholderTextColor="gray"
            keyboardType="numeric"
            value={propertyData.bathroom}
            onChangeText={(text) =>
              setPropertyData({ ...propertyData, bathroom: text }) // Fix the object reference to propertyData
            }
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Postal Code</Text>
          <TextInput
            placeholder="Postal Code"
            placeholderTextColor="gray"
            maxLength={6}
            keyboardType="numeric"
            value={propertyData.postalCode} // Display the postalCode from propertyData
            onChangeText={handlePostalCodeChange}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            placeholder="Address"
            placeholderTextColor="gray"
            value={propertyData.address}
            onChangeText={(text) =>
              setPropertyData({ ...propertyData, address: text }) // Fix the object reference to propertyData
            }
            style={[styles.input, styles.mediumTypeInput]}
            multiline={true}
            numberOfLines={2}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tenure</Text>
          <TextInput
            placeholder="Tenure (e.g. 99 years)"
            placeholderTextColor="gray"
            maxLength={3} // Restrict input to 6 characters
            keyboardType="numeric" // Show numeric keyboard
            value={propertyData.tenure}
            onChangeText={(text) => setPropertyData({ ...propertyData, tenure: text })}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Unit Number</Text>
          <TextInput
            placeholder="Unit Number (e.g. #17-360)"
            placeholderTextColor="gray"
            value={propertyData.unitNumber}
            onChangeText={(text) =>
              setPropertyData({ ...propertyData, unitNumber: text }) // Fix the object reference to propertyData
            }
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            placeholder="Description of Listing"
            placeholderTextColor="gray"
            value={propertyData.description}
            onChangeText={(text) =>
              setPropertyData({ ...propertyData, description: text }) // Fix the object reference to propertyData
            }
            style={[styles.input, styles.largeTextInput]}
            multiline={true}
            numberOfLines={4}
          />
        </View>


        <View style={styles.inputContainer}>
          <Text style={styles.label}>Property Type</Text>
          <TouchableOpacity
            style={styles.propertyTypePickerButton}
            onPress={() => setPropertyTypeVisible(true)}
          >
            <Text style={styles.propertyTypePickerText}>
              {propertyData.propertyType
                ? propertyData.propertyType.charAt(0).toUpperCase() +
                propertyData.propertyType.slice(1)
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
              selectedValue={propertyData.propertyType}
              onValueChange={(value) =>
                setPropertyData({ ...property, propertyType: value })
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

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Room Type</Text>
          <TouchableOpacity
            style={styles.propertyTypePickerButton}
            onPress={() => setRoomTypeVisible(true)}
          >
            <Text style={styles.propertyTypePickerText}>
              {propertyData.roomType
                ? capitalizeWords(propertyData.roomType.toLowerCase().replace(/_/g, ' '))
                : 'Select Room Type'}
            </Text>
            <Icon name="caret-down" size={20} color="black" />
          </TouchableOpacity>
        </View>

        <Modal
          transparent={true}
          animationType="slide"
          visible={roomTypeVisible}
          onRequestClose={() => setRoomTypeVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Picker
              selectedValue={propertyData.roomType}
              onValueChange={(value) =>
                setProperty({ ...property, roomType: value })
              }
              style={styles.picker}
            >
              {roomTypes.map((type, index) => (
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
                onPress={() => setRoomTypeVisible(false)}
              />
            </View>
          </View>
        </Modal>
      </ScrollView>

      <TouchableOpacity style={styles.saveChangesButton} onPress={handleSubmit}>
        <Ionicons name="save-outline" size={18} color="white" />
        <Text style={styles.saveChangesButtonText}>Update</Text>
      </TouchableOpacity>

      <FullScreenImage
        imageUrl={fullScreenImage}
        onClose={() => setFullScreenImage(null)} // Close the full-screen image view
      />

    </View>
  );
};

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
    marginLeft: 40,
  },
  scrollViewContent: {
    paddingBottom: 100, // Adjust this value as needed to ensure the input field is visible
  },
});

export default EditPropertyListing;
