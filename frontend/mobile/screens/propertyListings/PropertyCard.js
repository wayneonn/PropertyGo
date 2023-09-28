import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getImageUriById } from '../../utils/api';

const PropertyCard = ({ property, onPress, onFavoritePress }) => {
  const [propertyImageUri, setPropertyImageUri] = useState('');

  useEffect(() => {
    // Retrieve and set the image URI based on the smallest imageId
    console.log('property.images:', property.images);
    if (property.images && property.images.length > 0) {
      const smallestImageId = property.images[0].imageId; // Assuming the first image is the smallest
      const imageUri = getImageUriById(smallestImageId); // Replace with your function to get image URI
      setPropertyImageUri(imageUri);
    }
  }, [property]);

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(property.propertyId)}>
      <View style={styles.imageContainer}>
        {propertyImageUri ? (
          <Image source={{ uri: propertyImageUri }} style={styles.propertyImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text>No Image</Text>
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
        onPress={() => onFavoritePress(property.propertyId)}
      >
        <Ionicons
          name={property.isFavorite ? 'heart' : 'heart-outline'}
          size={24}
          color={property.isFavorite ? '#f00' : '#333'}
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
});

export default PropertyCard;
