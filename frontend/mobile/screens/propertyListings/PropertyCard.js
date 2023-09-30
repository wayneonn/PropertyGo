import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getImageUriById, addFavoriteProperty, removeFavoriteProperty, isPropertyInFavorites } from '../../utils/api';
import { AuthContext } from '../../AuthContext';
import DefaultImage from '../../assets/No-Image-Available.webp';

const PropertyCard = ({ property, onPress }) => {
    const [propertyImageUri, setPropertyImageUri] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);
    const { user } = useContext(AuthContext);
    const cardSize = Dimensions.get('window').width;

    useEffect(() => {
        if (property.images && property.images.length > 0) {
            const smallestImageId = property.images[0];
            const imageUri = getImageUriById(smallestImageId);
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
        <TouchableOpacity style={[styles.card, { width: cardSize * 0.85, height: cardSize * 0.8 }]} onPress={() => onPress(property.propertyId)}>
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
                <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={handleFavoriteToggle}
                >
                    <Ionicons
                        name={isFavorite ? 'heart' : 'heart-outline'}
                        size={24}
                        color={isFavorite ? 'red' : '#333'}
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
        borderRadius: 10
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
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
    placeholderImage: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    placeholderImageImage: {
        width: '100%', // Adjust the width as needed to match the desired size
        height: '100%', // Adjust the height as needed to match the desired size
        borderRadius: 10,
    },
});

export default PropertyCard;
