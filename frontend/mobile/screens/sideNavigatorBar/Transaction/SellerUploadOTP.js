import React, { useState, useContext, useEffect } from 'react';
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
  Linking
} from 'react-native';
import Swiper from 'react-native-swiper';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  getImageUriById, editProperty
} from '../../../utils/api';
import {
  sellerUploadedOTP,
} from '../../../utils/transactionApi';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { MaterialCommunityIcons, Ionicons, FontAwesome } from '@expo/vector-icons'; // Import Ionicons from the correct library
import { AuthContext } from '../../../AuthContext';
import { useNavigation } from '@react-navigation/native';
import { getAreaAndRegion } from '../../../services/GetAreaAndRegion';
import { DocumentSelector } from '../../../components/PropertyDocumentSelector';
import * as DocumentPicker from 'expo-document-picker';
import { BASE_URL, fetchFolders, createFolder, fetchTransactions } from "../../../utils/documentApi";
import * as FileSystem from 'expo-file-system'; // Import FileSystem from expo-file-system
import * as Permissions from 'expo-permissions';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Sharing from 'expo-sharing';
import FullScreenImage from '../../propertyListings/FullScreenImage';
import DefaultImage from '../../../assets/No-Image-Available.webp';
import { useFocusEffect } from '@react-navigation/native';
import { tr } from 'date-fns/locale';

const propertyTypes = [
  { label: 'Select Property Type', value: '' },
  { label: 'Resale', value: 'Resale' },
  { label: 'New Launch', value: 'New Launch' },
]


export default function SellerUploadOTP({ route }) {
  const { property, transaction } = route.params;
  const propertyListing = property;
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const updateAreaAndRegion = async (postalCode) => {
    const { area, region } = await getAreaAndRegion(postalCode);
    setProperty({ ...property, area, region });
  };
  const [documentId, setDocumentId] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [images, setImages] = useState([]);
  const userId = user.user.userId;

  //For Document
  const [prevDocuments, setPrevDocuments] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState(prevDocuments);
  const [folders, setFolders] = useState([]);
  const [propertyFolderId, setFolderId] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedDocuments, setSelectedDocuments] = useState([]); // Documents to upload
  const [isDocumentUploaded, setIsDocumentUploaded] = useState(false);
  const [optionExpiryDate, setOptionExpiryDate] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const openHDBLink = () => {
    const url = 'https://services2.hdb.gov.sg/webapp/BB24OTPDlWeb/BB24POptionToPurchase.jsp';

    // Use the Linking.openURL method to open the URL in Safari
    Linking.openURL(url).catch((err) => console.error('An error occurred: ', err));
  };

  useEffect(() => {
    fetchFolderData();
  }, []);

  const fetchFolderData = async () => {
    try {
      // const documents = await fetchDocuments(USER_ID);
      const { success, data, message } = await createFolder(userId, { folderTitle: 'Property' });
      if (success) {
        setFolderId(data.folderId);
      } else {
        setFolderId(data.folderId);
      }

      // console.log(user);
    } catch (error) {
      console.error('Error fetching Folder data:', error);
    }
  };

  const handleSelectDocument = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
      console.log('Media library permission status:', status);

      if (status === 'granted') {
        const results = await DocumentPicker.getDocumentAsync({
          multiple: true,
          type: 'application/pdf', // Set the desired document type
        });

        console.log('Result from DocumentPicker:', results);

        if (!results.cancelled) {
          // The user selected a document, you can now proceed with the upload logic
          const newSelectedDocuments = results.assets;
          setSelectedDocuments([...newSelectedDocuments]);
          console.log('Selected document:', results.assets[0].uri);

          // Check if the file exists
          const fileInfo = await FileSystem.getInfoAsync(results.assets[0].uri);

          if (fileInfo.exists) {
            // Update the selected document and clear the uploaded status
            // setSelectedDocuments(results);
            setIsDocumentUploaded(false);
          } else {
            console.warn('Selected document file does not exist.');
          }
        } else {
          console.log('Document selection canceled or failed.');
        }
      } else {
        console.warn('Media library permission denied.');
      }
    } catch (error) {
      console.error('Error selecting document:', error);
    }
  };

  const handleSubmit = async () => {
    try {

      // Check if optionExpiryDate is not today or before today

      console.log("optionExpiryDate: ", (optionExpiryDate && optionExpiryDate <= new Date()) )

      if (selectedDocuments.length === 0 && !optionExpiryDate) {
        Alert.alert(
          'Missing Document and Option Expiry Date',
          'Please select a document to upload and choose a valid option expiry date.'
        );
        return;
      } else if (selectedDocuments.length === 0) {
        Alert.alert(
          'Missing Document',
          'Please select a document to upload.'
        );
        return;
      } else if (!optionExpiryDate) {
        Alert.alert(
          'Option Expiry Date',
          'Choose a valid option expiry date.'
        );
        return;
      }

      if ( optionExpiryDate && optionExpiryDate <= new Date()) {
        Alert.alert(
          'Invalid Option Expiry Date',
          'Please select a valid option expiry date that is not today or in the past.'
        );
        return;
      }

      console.log("property: ", property)
      const propertyListingId = property.propertyListingId;
      const title = property.title;
      console.log('Property created successfully:', propertyListingId);

      await fetchFolderData();

      const otpDocumentId = await createDocument(propertyListingId, title);

      console.log("otpDocumentId: ", otpDocumentId)

      await sellerUploadedOTP(transaction.transactionId, {
        optionToPurchaseDocumentId: otpDocumentId,
      });

      const { success, data, message } = await editProperty(
        propertyListingId,
        {
          optionExpiryDate: new Date(
            optionExpiryDate.getFullYear(),
            optionExpiryDate.getMonth(),
            optionExpiryDate.getDate(),
            16, // Set the time to 16:00:00 (4PM)
            0,  // Minutes
            0   // Seconds
          ),
        }
      );

      navigation.navigate('Seller Option Transaction Order Screen', { transactionId: transaction.transactionId });

      Alert.alert(
        'Document Uploaded',
        'The OTP Document has been uploaded successfully.'
      );

    } catch (error) {
      console.log('Error uploading document:', error);
      Alert.alert(
        'Error',
        'An error occurred while uploading the document.'
      );
    }
  };


  const createDocument = async (propertyListingId, title) => {
    console.log("createDocument", selectedDocuments);
    try {
      const fileData = new FormData();

      selectedDocuments.forEach((document) => {
        const fileUri = document.uri;
        const fileType = document.mimeType;
        const fileName = document.name;
        const folderId = propertyFolderId;

        fileData.append("documents", {
          uri: fileUri,
          name: fileName,
          type: fileType,
        });

        console.log("File URI: ", fileUri);

        // Append other required data to the FormData object
        fileData.append("propertyId", propertyListingId);
        fileData.append("description", `Intent To Sell Document (${title})`);
        fileData.append("folderId", folderId);
        fileData.append("userId", user.user.userId);
      });

      const response = await fetch(`${BASE_URL}/user/documents/upload`, {
        method: "post",
        body: fileData,
      });

      // Check the response status and log the result
      if (response.ok) {
        const data = await response.json();
        const firstDocumentId = data.documentIds[0];
        console.log("Upload response:", data, "documentId: ", firstDocumentId);
        return firstDocumentId;
        // await documentFetch();
      } else {
        console.log("File upload failed ", response);
        return null
      }
    } catch (error) {
      console.log("Error upload:", error);
      return null;
    }

  }

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

  const formatPriceWithCommas = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const formatPricePerSqm = (price, size) => {
    if (price !== null && size !== null && !isNaN(price) && !isNaN(size) && size !== 0) {
      const pricePerSqm = (price / size).toFixed(2); // Format to 2 decimal places
      return pricePerSqm;
    } else {
      return 'N/A'; // Handle the case when price or size is null, undefined, or 0
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled" // Add this prop
      >

        <View style={styles.imageGalleryContainer}>
          {/* Back button */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Swiper style={styles.wrapper} showsButtons={false} loop={false} autoplay={true} autoplayTimeout={5}>
            {propertyListing.images.length > 0 ? (
              propertyListing.images.map((imageId, index) => {
                const imageUri = getImageUriById(imageId);
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setFullScreenImage(imageUri)} // Set the fullScreenImage state when tapped
                    style={styles.slide} // Apply styles to TouchableOpacity
                  >
                    <Image source={{ uri: `${imageUri}?timestamp=${cacheBuster}` }} style={styles.image} />
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={styles.slide}>
                <Image source={DefaultImage} style={styles.image} />
              </View>
            )}
          </Swiper>

          <FullScreenImage
            imageUrl={fullScreenImage}
            onClose={() => setFullScreenImage(null)} // Close the full-screen image view
          />

          {/* Add your square boxes for images here. You might need another package or custom UI for this. */}
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.propertyDetailsTop}>
            <View style={styles.propertyDetailsTopLeft}>
              <Text style={styles.forSaleText}>For Sales</Text>
              <Text style={styles.title}>{propertyListing.title}</Text>
              <Text style={styles.priceLabel}>${formatPriceWithCommas(propertyListing.price)}</Text>
              <Text style={styles.pricePerSqm}>
                ${formatPricePerSqm(propertyListing.price, propertyListing.size)} psm{' '}
              </Text>
              <Text style={styles.roomsAndSize}>
                {propertyListing.bed} <Ionicons name="bed" size={16} color="#333" />  |
                {'  '}{propertyListing.bathroom} <Ionicons name="water" size={16} color="#333" />  |
                {'  '}{propertyListing.size} sqm  <Ionicons name="cube-outline" size={16} color="#333" /> {/* Added cube icon */}
              </Text>
            </View>
          </View>

          <View style={styles.dateContainer}>
            <FontAwesome name="calendar" size={16} color="#333" />
            <Text style={styles.dateText}>{"Listed on: "}{formatDate(propertyListing.createdAt)}</Text>
          </View>

          <Text style={styles.dateContainer}>
            <Ionicons name="time-outline" size={17} color="#333" />
            {" "}
            <Text style={styles.dateText}>{"Tenure: "}{propertyListing.tenure}{" Years"}</Text>
          </Text>

          <Text style={styles.locationTitle}>Description</Text>
          <Text style={styles.description}>{propertyListing.description}</Text>
          <Text style={styles.description}>{"\n"}</Text>

          {/* Upload Document */}
          <View>
            <Text style={styles.locationTitle}>Upload OTP Document</Text>
            <Text style={styles.description}>
              1. Click on the{' '}
              <Text
                style={{ color: 'blue', textDecorationLine: 'underline' }}
                onPress={openHDBLink}
              >
                HDB Option To Purchase Download Link
              </Text>{' '}
              to access the OTP document.
            </Text>

            {/* Instruction 2: Provide instructions for downloading and filling the PDF */}
            <Text style={styles.description}>
              2. Download the PDF document from the provided link and save it to your device.
            </Text>

            <Text style={styles.description}>
              3. Fill in the necessary details in the PDF document as required.
            </Text>

            <Text style={styles.description}>
              4. Upload the document in the blue button below and select the Option Expiry Date.
            </Text>

            <View style={styles.inputRow}>
              <Text style={styles.label}>Option Expiry Date:</Text>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setDatePickerVisibility(true)}
              >
                <Text style={styles.pickerText}>
                  {optionExpiryDate ? optionExpiryDate.toDateString() : 'Option Expiry'}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="black" />
              </TouchableOpacity>
              <Modal
                transparent={true}
                animationType="slide"
                visible={isDatePickerVisible}
                onRequestClose={() => setDatePickerVisibility(false)}
              >
                <View style={styles.modalView}>
                  <DateTimePicker
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={(date) => {
                      setOptionExpiryDate(date);
                      setDatePickerVisibility(false);
                    }}
                    onCancel={() => setDatePickerVisibility(false)}
                  />
                </View>
              </Modal>
            </View>

            {selectedDocuments.length > 0 ? (
              <View style={styles.documentContainer}>
                <TouchableOpacity
                  style={styles.selectedDocumentContainer}
                  onPress={async () => {
                    if (selectedDocuments && selectedDocuments[0].uri) {

                      const filePath = selectedDocuments[0].uri;
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
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="document-text-outline" size={24} color="blue" />
                    <Text style={styles.selectedDocumentText}> Selected Document: </Text>
                    <Text style={styles.selectedDocumentName}>
                      {selectedDocuments[0].name}
                    </Text>
                  </View>

                </TouchableOpacity>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    style={styles.replaceDocumentButton}
                    onPress={handleSelectDocument}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons name="repeat-outline" size={24} color="white" />
                      <Text style={styles.removeDocumentButtonText}> Replace</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removeDocumentButton}
                    onPress={() => {
                      // Handle removing the selected document
                      setSelectedDocuments([]);
                      setIsDocumentUploaded(false);
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons name="trash-bin-outline" size={24} color="white" />
                      <Text style={styles.removeDocumentButtonText}> Remove</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.viewDocumentButton}
                    onPress={async () => {
                      if (selectedDocuments && selectedDocuments[0].uri) {

                        const filePath = selectedDocuments[0].uri;
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
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons name="eye-outline" size={24} color="white" />
                      <Text style={styles.removeDocumentButtonText}>   View    </Text>
                    </View>
                  </TouchableOpacity>

                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.selectDocumentButton}
                onPress={handleSelectDocument}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="add-outline" size={24} color="white" />
                  <Text style={styles.selectDocumentButtonText}>Select OTP Document</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>

        </View>
      </ScrollView>
      <View style={styles.invoiceButtonBorder}></View>
      <TouchableOpacity style={styles.saveChangesButton} onPress={handleSubmit}>
        <Ionicons name="save-outline" size={18} color="white" />
        <Text style={styles.saveChangesButtonText}>Upload</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  documentContainer: {
    marginBottom: -80,
    paddingHorizontal: 2,
    alignItems: 'center',
  },
  label: {
    marginBottom: 10,
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
  selectDocumentButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 25,
    alignItems: 'center',
    width: '60%',
    justifyContent: 'center',
    marginLeft: 70,
    marginTop: 20,
    marginBottom: -40,
  },
  selectDocumentButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveChangesButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '60%',
    marginLeft: 70,
  },
  saveChangesButtonText: {
    fontSize: 18,
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
  uploadDocumentButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    width: '60%',
    marginTop: 10,
    marginRight: 10,
  },
  uploadDocumentButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  replaceDocumentButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 10,
    paddingHorizontal: 17,
    alignItems: 'center',
    marginTop: 10,
    marginRight: 10,
  },
  removeDocumentButton: {
    backgroundColor: 'red',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    paddingHorizontal: 17,
    marginTop: 10,
    marginRight: 10,
  },
  viewDocumentButton: {
    backgroundColor: 'green',
    borderRadius: 8,
    padding: 10,
    paddingLeft: 20,
    alignItems: 'center',
    marginTop: 10,
    marginRight: 10,
  },
  removeDocumentButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  selectedDocumentContainer: {
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 8,
    padding: 10,
    width: '93%',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 10,
  },
  selectedDocumentText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedDocumentName: {
    fontSize: 16,
    marginTop: 0,
  },
  imageGalleryContainer: {
    position: 'relative',
    height: 300,
    width: '100%',
  },
  imageGallery: {
    height: 300,
  },
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
  },
  propertyDetailsTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  propertyDetailsTopLeft: {
    flex: 3,
  },
  forSaleText: {
    fontSize: 20,
    color: '#333',
    letterSpacing: 2,
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    color: '#333',
    letterSpacing: 2,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  priceLabel: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#333',
    letterSpacing: 2,
  },
  selectDocumentButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollViewContent: {
    paddingBottom: 100,
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
  imageRow: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingVertical: 10,
  },
  propertyTypePickerText: {
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingBottom: 20,
  },
  picker: {
    backgroundColor: 'white',
  },
  okButtonContainer: {
    backgroundColor: 'white',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    marginBottom: 10,
    marginTop: -5,
  },
  dateText: {
    fontSize: 13,
    marginLeft: 5,
    color: '#333',
  },
  locationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingLeft: 16,
  },
  description: {
    paddingLeft: 16,
    marginBottom: 20,
  },
  invoiceButtonBorder: {
    width: '100%',
    borderBottomWidth: 0.4, // Add a bottom border to create the line on top of the button
    borderBottomColor: 'grey', // You can change the color to your preference
    marginTop: 8,
    marginBottom: 2,
  },
  datePickerButton: {
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
  modalView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerText: {
    fontSize: 14,
    color: 'black',
  },
  icon: {
    marginLeft: 10,
  },
  inputRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
    width: '90%',
  },
});

