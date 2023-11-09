import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getImageUriById, addFavoriteProperty, removeFavoriteProperty, isPropertyInFavorites } from '../../../../utils/api';
import { AuthContext } from '../../../../AuthContext';
import DefaultImage from '../../../../assets/No-Image-Available-Small.jpg';

const PropertyCardRectangle = ({ property, onPress, seller, transaction }) => {
  const [propertyImageUri, setPropertyImageUri] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [cacheBuster, setCacheBuster] = useState(Date.now());
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  const formatPrice = (price) => {
    if (price !== null && !isNaN(price)) {
      const formattedPrice = price.toFixed(2); // Format to 2 decimal places
      return formattedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else {
      return 'N/A'; // Handle the case when price is null, undefined, or not a number
    }
  };

  useEffect(() => {
    loadPropertyDetails();
    setCacheBuster(Date.now());
  }, [property]);

  const loadPropertyDetails = async () => {
    // Retrieve and set the image URI based on the smallest imageId
    if (property.images && property.images.length > 0) {
      // Use the first image ID directly since it's an array of IDs
      const smallestImageId = property.images[0]; // Assuming the first image is the smallest
      const imageUri = getImageUriById(smallestImageId);
      setPropertyImageUri(imageUri);
    }

    // Check if the property is in favorites and update the isFavorite state
    checkIfPropertyIsFavorite();
  };

  const checkIfPropertyIsFavorite = async () => {
    const userId = user.user.userId;
    try {
      const { success, data } = await isPropertyInFavorites(userId, property.propertyListingId);

      if (success) {
        setIsFavorite(data.isLiked);
      } else {
        console.error('Error checking if property is in favorites:', data.message);
      }
    } catch (error) {
      console.error('Error checking if property is in favorites:', error);
    }
  };

  const getItem = (item) => {
    switch (item) {
      case 'OPTION_FEE':
        return 'Option Fee';
      case 'OPTION_EXERCISE_FEE':
        return 'Exercise Fee';
      case 'COMMISSION_FEE':
        return 'Commission Fee';
      default:
        return item; // Default color
    }
  };

  // Inside your PropertyCardRectangle component
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(property.propertyId)}>
      <View style={styles.imageContainer}>
        {propertyImageUri ? (
          <Image source={{ uri: `${propertyImageUri}?timestamp=${cacheBuster}` }} style={styles.propertyImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Image source={DefaultImage} style={styles.placeholderImageImage} />
          </View>
        )}
      </View>
      <View style={styles.propertyDetails}>
        <Text style={styles.propertyTitle}>{property.title}</Text>
        <Text></Text>
        <Text style={styles.soldBy}>Sold by: {seller.name}</Text>
        <Text></Text>
        <View style={styles.optionFeeContainer}>
          <Text style={styles.optionFeeLabel}>{getItem(transaction.transactionType)}: </Text>
          {/* <Text>{'             '}</Text> */}
          <Text style={styles.optionFeeAmount}>${formatPrice(
            transaction.onHoldBalance === 0 ?
              transaction.paymentAmount : transaction.onHoldBalance
          )}</Text>
        </View>
        <View style={styles.invoiceButtonContainer}>
          <View style={styles.invoiceButtonBorder}></View>
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() => {
              navigation.navigate('Transaction Screen', { transaction });
            }}
          >
            <Text style={styles.chatButtonText}>View Invoice</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Conditional rendering of favorite button */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#fff',
    margin: 10,
    padding: 10,
    width: '94%', // Adjust the width as needed
    aspectRatio: 2.5, // Adjust the aspect ratio to control the height
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    flex: 1.5,
    borderRadius: 10,
    overflow: 'hidden',
  },
  propertyImage: {
    width: '100%',
    aspectRatio: 1,
  },
  placeholderImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#ccc', // Background color for placeholder image
    justifyContent: 'center',
    alignItems: 'center',
  },
  propertyDetails: {
    flex: 3,
    paddingLeft: 10,
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  soldBy: {
    fontSize: 12,
    color: '#777',
    marginTop: -10,
  },
  optionFeeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: -10,
  },
  optionFeeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  optionFeeAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'dodgerblue',
  },
  propertyInfo: {
    fontSize: 12,
    color: '#555',
  },
  favoriteButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderImageImage: {
    width: '100%', // Adjust the width as needed to match the desired size
    height: '100%', // Adjust the height as needed to match the desired size
  },
  chatButton: {
    backgroundColor: 'dodgerblue',
    padding: 4,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 130,
    marginTop: 8,
  },
  chatButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  invoiceButtonContainer: {
    alignItems: 'center',
  },
  invoiceButtonBorder: {
    width: '80%',
    borderBottomWidth: 0.3, // Add a bottom border to create the line on top of the button
    borderBottomColor: 'grey', // You can change the color to your preference
    marginTop: 8,
    marginBottom: 2,
  },
});

export default PropertyCardRectangle;
