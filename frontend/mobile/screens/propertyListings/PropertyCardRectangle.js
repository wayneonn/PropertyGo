import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getImageUriById, addFavoriteProperty, removeFavoriteProperty, isPropertyInFavorites } from '../../utils/api';
import { AuthContext } from '../../AuthContext';
import DefaultImage from '../../assets/No-Image-Available-Small.jpg';


const PropertyCardRectangle = ({ property, onPress }) => {
  const [propertyImageUri, setPropertyImageUri] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Retrieve and set the image URI based on the smallest imageId
    console.log('property.images:', property.images);
    if (property.images && property.images.length > 0) {
      // Use the first image ID directly since it's an array of IDs
      const smallestImageId = property.images[0]; // Assuming the first image is the smallest
      console.log('smallestImageId:', smallestImageId);
      const imageUri = getImageUriById(smallestImageId); // Replace with your function to get image URI
      setPropertyImageUri(imageUri);
    }

    // Check if the property is in favorites and update the isFavorite state
    checkIfPropertyIsFavorite();
  }, [property]);

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

  const handleFavoriteToggle = async () => {
    const userId = user.user.userId;
    try {
      if (isFavorite) {
        // Remove the property from favorites
        console.log('Removing property from favorites...');
        const { success } = await removeFavoriteProperty(userId, property.propertyListingId); // Use property.propertyListingId

        if (success) {
          setIsFavorite(false);
        } else {
          console.error('Error removing property from favorites.');
        }
      } else {
        // Add the property to favorites
        console.log('Adding property to favorites...');
        const { success } = await addFavoriteProperty(userId, property.propertyListingId); // Use property.propertyListingId

        if (success) {
          setIsFavorite(true);
        } else {
          console.error('Error adding property to favorites.');
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(property.propertyId)}>
      <View style={styles.imageContainer}>
        {propertyImageUri ? (
          <Image source={{ uri: propertyImageUri }} style={styles.propertyImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Image source={DefaultImage} style={styles.placeholderImageImage} />
          </View>
        )}
      </View>
      <View style={styles.propertyDetails}>
        <Text style={styles.propertyTitle}>{property.title}</Text>
        <Text style={styles.propertyPrice}>${property.price}</Text>
        <Text style={styles.propertyInfo}>
          {property.bed} <Ionicons name="bed" size={16} color="#333" /> |
          {property.bathroom} <Ionicons name="water" size={16} color="#333" /> |
          {property.size} sqm <Ionicons name="cube-outline" size={16} color="#333" />
        </Text>
      </View>
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={handleFavoriteToggle}
      >
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={24}
          color={isFavorite ? '#f00' : '#333'}
        />
      </TouchableOpacity>
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
    flex: 1,
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
  propertyPrice: {
    fontSize: 16,
    color: '#333',
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
});

export default PropertyCardRectangle;
