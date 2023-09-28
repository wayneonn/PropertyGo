import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getImageUriById } from '../../utils/api';

const PropertyCard = ({ property, onPress, onFavoritePress }) => {
    const [propertyImageUri, setPropertyImageUri] = useState('');

    const cardSize = Dimensions.get('window').width; // Make it equal to the screen width

    useEffect(() => {
        if (property.images && property.images.length > 0) {
            const smallestImageId = property.images[0];
            const imageUri = getImageUriById(smallestImageId);
            setPropertyImageUri(imageUri);
        }
    }, [property]);

    return (
        <TouchableOpacity style={[styles.card, { width: cardSize * 0.85, height: cardSize * 0.8}]} onPress={() => onPress(property.propertyId)}>
            <View style={styles.imageContainer}>
                {propertyImageUri ? (
                    <Image source={{ uri: propertyImageUri }} style={[styles.propertyImage, { borderRadius: 10 }]} />
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
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
      backgroundColor: '#fff',
      alignSelf: 'center', // Center the card
      marginVertical: 10, // A little margin top and bottom for spacing between cards
      borderRadius: 10,
      borderWidth: 0.5, // Light border
      borderColor: '#ddd', // Light gray color
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 7,
    },
    imageContainer: {
      width: '100%',
      height: '60%',
      overflow: 'hidden', // Hide overflow
    },
    propertyImage: {
      width: '100%',
      height: '100%',
    },
    placeholderImage: {
      width: '100%',
      height: '100%',
      backgroundColor: '#ccc',
      justifyContent: 'center',
      alignItems: 'center',
    },
    propertyDetails: {
      padding: 10,
      flex: 1, 
      justifyContent: 'space-between',
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
      alignSelf: 'flex-end',
    },
  });

export default PropertyCard;
