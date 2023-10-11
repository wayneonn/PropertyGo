import React, { useState, useContext } from 'react';
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
  FlatList,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createProperty } from '../../utils/api';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from the correct library
import { AuthContext } from '../../AuthContext';
import { useNavigation } from '@react-navigation/native';
import PropertyListingScreen from '../propertyListings/PropertyListing';
import { getAreaAndRegion } from '../../services/GetAreaAndRegion';
import { DocumentSelector } from '../../components/PropertyDocumentSelector';
import * as DocumentPicker from 'expo-document-picker';
import { BASE_URL, fetchFolders, fetchTransactions } from "../../utils/documentApi";
import { Linking } from 'react-native';
import * as FileSystem from 'expo-file-system'; // Import FileSystem from expo-file-system
import * as Permissions from 'expo-permissions';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Sharing from 'expo-sharing';
import FullScreenImage from '../propertyListings/FullScreenImage';

const propertyTypes = [
  { label: 'Select Property Type', value: '' },
  { label: 'Resale', value: 'Resale' },
  { label: 'New Launch', value: 'New Launch' },
]

export default function PropertyListing() {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const updateAreaAndRegion = async (postalCode) => {
    const { area, region } = await getAreaAndRegion(postalCode);
    setProperty({ ...property, area, region });
  };
  const [documents, setDocuments] = useState([]);
  const [fullScreenImage, setFullScreenImage] = useState(null);

  const [property, setProperty] = useState({
    // title: 'Sample Title',
    // description:
    //   'Sample Description (You can add a longer description here.)',
    // price: '100000', // Add a dollar symbol to the price
    // offeredPrice: '90000', // Add a dollar symbol to the offered price
    // bed: '2',
    // bathroom: '2',
    // size: '1200',
    // tenure: 1,
    // propertyType: '',
    // propertyStatus: 'ACTIVE',
    // userId: user.user.userId,
    // postalCode: '822126',
    // address: '',
    // unitNumber: '17-360',
    // area: '',
    // region: '',
    // longitude: '',
    // latitude: '',
    title: '',
    description:'',
    price: '', // Add a dollar symbol to the price
    bed: '',
    bathroom: '',
    tenure: '',
    size: '',
    propertyType: '',
    propertyStatus: 'ACTIVE',
    userId: user.user.userId,
    postalCode: '',
    address: '',
    unitNumber: '',
    area: '',
    region: '',
    longitude: '',
    latitude: '',
  });

  const [images, setImages] = useState([]);
  const [propertyTypeVisible, setPropertyTypeVisible] = useState(false);
  const [formattedPrice, setFormattedPrice] = useState('');
  const [rawPrice, setRawPrice] = useState('');

  //For Document
  const [prevDocuments, setPrevDocuments] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState(prevDocuments);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isDocumentUploaded, setIsDocumentUploaded] = useState(false);


  // Function to format the price with dollar sign and commas
  const formatPrice = (price) => {
    return `$${price.replace(/\D/g, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`;
  };

  // Function to remove dollar sign and commas and save raw price
  const handlePriceChange = (text) => {
    const raw = text.replace(/[^0-9]/g, '');
    setFormattedPrice(formatPrice(raw));
    setRawPrice(raw);
  };

  const fetchData = async () => {
    try {
      const documents = await fetchDocuments(USER_ID);
      const folders = await fetchFolders(USER_ID);
      setFolders(folders);
      setPrevDocuments(documents);
      setFilteredDocs(documents);
      setSelectedFolder(defaultFolderId.toString());
      // console.log(user);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

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

  const handleSelectDocument = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
      console.log('Media library permission status:', status);
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf', // Set the desired document type
      });

      console.log('Result from DocumentPicker:', result);

      if (!result.cancelled) {
        // The user selected a document, you can now proceed with the upload logic
        console.log('Selected document:', result.assets[0].uri);

        // Update the selected document and clear the uploaded status
        setSelectedDocument(result);
        setIsDocumentUploaded(false);
      } else {
        console.log('Document selection canceled or failed.');
      }
    } catch (error) {
      console.error('Error selecting document:', error);
    }
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

  const viewImage = (index) => {
    console.log("View Image: ", images[index].uri)
    setFullScreenImage(images[index].uri)
  }

  const removeImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  // Function to fetch address based on postal code
  const fetchAddressByPostalCode = async (postalCode) => {
    if (postalCode.length === 6) { // Only fetch address when 6 digits are entered
      try {
        const response = await fetch(
          `https://developers.onemap.sg/commonapi/search?searchVal=${postalCode}&returnGeom=Y&getAddrDetails=Y`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.found === 1) {
            // Extract the address from the API response
            const address = data.results[0].ADDRESS;
            const latitude = parseFloat(data.results[0].LATITUDE);
            const longitude = parseFloat(data.results[0].LONGITUDE);
            const { area, region } = await getAreaAndRegion(postalCode);

            // Update the address in the property state
            setProperty({ ...property, address, postalCode, area, region, latitude, longitude });
            // console.log("address: ", address);
          } else {
            // No address found, alert the user and clear the address field
            Alert.alert('Invalid Postal Code', 'No address found for the postal code.');
            setProperty({ ...property, address: '', postalCode });
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
      setProperty({ ...property, postalCode: text });

      // Call the function to fetch the address
      if (text.length === 6) {
        fetchAddressByPostalCode(text);
        postalCode = text;
      }
    }
  };

  const handleSubmit = async () => {
    // Validation checks
    if (images.length === 0) {
      Alert.alert('No images selected', 'Please select at least one image.');
      return;
    }

    // Parse the formatted price to remove dollar sign and commas
    const price = rawPrice ? parseInt(rawPrice, 10) : 0;

    if (!price || price <= 0) {
      Alert.alert('Invalid Price', 'Price must be a numeric value.');
      return;
    }

    if (!/^\d+$/.test(property.size)) {
      Alert.alert('Invalid Size', 'Size must be a numeric value.');
      return;
    }

    if (!/^\d+$/.test(property.bed)) {
      Alert.alert('Invalid Bed', 'Bed must be a numeric value.');
      return;
    }

    if (!/^\d+$/.test(property.bathroom)) {
      Alert.alert('Invalid Bathroom', 'Bathroom must be a numeric value.');
      return;
    }

    if (property.propertyType === '') {
      Alert.alert('Property Type Not Selected', 'Please select a property type.');
      return;
    }

    if (
      property.title.trim() === '' ||
      property.description.trim() === '' ||
      property.unitNumber.trim() === '' ||
      property.postalCode.trim() === '' ||
      property.address.trim() === ''
    ) {
      Alert.alert('Missing Information', 'Please fill in all fields.');
      return;
    }

    // Other checks and API call
    let propertyTypeUpperCase = property.propertyType.toUpperCase();
    if (propertyTypeUpperCase === 'NEW LAUNCH') {
      propertyTypeUpperCase = 'NEW_LAUNCH';
    }

    try {
      const { success, data, message } = await createProperty(
        {
          ...property,
          price: price, // Use the parsed price here
          // offeredPrice: property.offeredPrice.replace(/\$/g, ''),
          propertyType: propertyTypeUpperCase,
        },
        images
      );

      if (success) {
        const propertyListingId = data.propertyListingId;
        console.log('Property created successfully:', propertyListingId);
        Alert.alert(
          'Property Created',
          'The property listing has been created successfully.'
        );

        if (selectedDocument) {
          try {
            // Create a FormData object to send the document as a Blob
            const documentData = new FormData();
            const fileUri = selectedDocument.assets[0].uri;

            // Use FileSystem to read the file and get a Blob representation
            const blob = await FileSystem.readAsStringAsync(fileUri, {
              encoding: FileSystem.EncodingType.Blob,
            });

            // Append the Blob to the FormData object
            documentData.append("documents",
              {
                uri: fileUri,
                name: selectedDocument.assets[0].name,
                type: "application/pdf"
              });

            // Add other necessary data to the FormData object
            documentData.append('propertyId', propertyListingId);
            documentData.append('folderId', 1);
            documentData.append('userId', user.user.userId);

            // Send the FormData object with the document to the server
            const response = await fetch(`${BASE_URL}/user/documents/upload`, {
              method: 'post',
              body: documentData,
            });

            if (response.ok) {
              const data = await response.json();
              console.log('Document upload response:', data);
            } else {
              console.log('Document upload failed');
            }
          } catch (error) {
            console.log('Error uploading document:', error);
          }
        }

        navigation.navigate('Property Listing', { propertyListingId });
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

  const openPdf = async (filePath) => {
    try {
      // Define a target URI for the file. This can be a directory in the app's 
      // document directory or any other appropriate location.
      const fileName = filePath.split('/').pop();
      const targetUri = `${FileSystem.documentDirectory}${fileName}`;

      // Copy the file from the source location to the target location.
      await FileSystem.copyAsync({
        from: filePath,
        to: targetUri,
      });

      if (!(await Sharing.isAvailableAsync())) {
        alert("Uh oh, sharing isn't available on your platform");
        return;
      }

      // Share the file with the user
      await Sharing.shareAsync(targetUri);
      console.log('File saved to:', targetUri);
    } catch (error) {
      console.error('Error while downloading the file:', error);
    }
  };



  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled" // Add this prop
      >
        <View style={styles.headerContainer}>
          <Text style={styles.header}>List A Property</Text>
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
            {images.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleImagePress(index)}
                style={styles.imageContainer}
              >
                <Image source={{ uri: image.uri }} style={styles.image} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <FullScreenImage
            imageUrl={fullScreenImage}
            onClose={() => setFullScreenImage(null)} // Close the full-screen image view
          />

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            placeholder="Listing Title"
            placeholderTextColor="gray"
            value={property.title}
            onChangeText={(text) => setProperty({ ...property, title: text })}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Price</Text>
          <TextInput
            placeholder="$ Price"
            placeholderTextColor="gray"
            value={formattedPrice}
            keyboardType="numeric"
            onChangeText={handlePriceChange}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Size (sqm)</Text>
          <TextInput
            placeholder="Size (sqm)"
            placeholderTextColor="gray"
            value={property.size}
            keyboardType="numeric"
            onChangeText={(text) => setProperty({ ...property, size: text })}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Bedrooms</Text>
          <TextInput
            placeholder="Number of Bedrooms"
            placeholderTextColor="gray"
            value={property.bed}
            keyboardType="numeric"
            onChangeText={(text) => setProperty({ ...property, bed: text })}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Bathrooms</Text>
          <TextInput
            placeholder="Number of Bathrooms"
            placeholderTextColor="gray"
            value={property.bathroom}
            keyboardType="numeric"
            onChangeText={(text) =>
              setProperty({ ...property, bathroom: text })
            }
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Postal Code</Text>
          <TextInput
            placeholder="Postal Code"
            placeholderTextColor="gray"
            maxLength={6} // Restrict input to 6 characters
            keyboardType="numeric" // Show numeric keyboard
            value={property.postalCode}
            onChangeText={handlePostalCodeChange} // Handle postal code changes
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            placeholder="Address"
            placeholderTextColor="gray"
            value={property.address}
            onChangeText={(text) => setProperty({ ...property, address: text })}
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
            value={property.tenure}
            onChangeText={(text) => setProperty({ ...property, tenure: text })}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Unit Number</Text>
          <TextInput
            placeholder="Unit Number (e.g. #17-360)"
            placeholderTextColor="gray"
            value={property.unitNumber}
            onChangeText={(text) => setProperty({ ...property, unitNumber: text })}
            style={styles.input}
          />
        </View>


        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            placeholder="Description of Listing"
            placeholderTextColor="gray"
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


        {/* Upload Document Section */}
        {/* <View style={styles.inputContainer}>
          <Text style={styles.label}>Select Document</Text>
          {selectedDocument ? (
            <View>
              <TouchableOpacity
                style={styles.selectedDocumentContainer}
                onPress={async () => {
                  if (selectedDocument && selectedDocument.assets[0].uri) {

                    const filePath = selectedDocument.assets[0].uri;
                    console.log('Opening document:', filePath);

                    // Check if the file exists
                    const fileInfo = await FileSystem.getInfoAsync(filePath);
                    // console.log('File exists:', fileInfo)
                    if (fileInfo.exists) {
                      // Request permission to access the file
                      console.log('File exists:', filePath)
                      const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
                      openPdf(filePath);
                    } else {
                      console.warn('Selected document file does not exist.');
                    }
                  } else {
                    console.warn('Selected document URI is not valid.');
                  }
                }}
              >
                <Text style={styles.selectedDocumentText}>Selected Document</Text>
                <Text style={styles.selectedDocumentName}>
                  {selectedDocument.assets[0].name}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.uploadDocumentButton}
                onPress={handleSelectDocument}
              >
                <Text style={styles.uploadDocumentButtonText}>
                  {isDocumentUploaded ? 'Replace Document' : 'Upload Document'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeDocumentButton}
                onPress={() => {
                  // Handle removing the selected document
                  setSelectedDocument(null);
                  setIsDocumentUploaded(false);
                }}
              >
                <Text style={styles.removeDocumentButtonText}>Remove Document</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.selectDocumentButton}
              onPress={handleSelectDocument}
            >
              <Text style={styles.selectDocumentButtonText}>Select Document</Text>
            </TouchableOpacity>
          )}
        </View> */}


      </ScrollView>
      <TouchableOpacity style={styles.saveChangesButton} onPress={handleSubmit}>
        <Ionicons name="save-outline" size={18} color="white" />
        <Text style={styles.saveChangesButtonText}>Submit</Text>
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
});
