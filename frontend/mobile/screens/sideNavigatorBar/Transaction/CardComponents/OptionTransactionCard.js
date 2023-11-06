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
import * as Animatable from 'react-native-animatable';
import {
    getPropertyListing
} from '../../../../utils/api';
import { format } from 'date-fns';
import DefaultImage from '../../../../assets/No-Image-Available.webp';

const OptionTransactionCard = ({ transaction, onPress, propertyId }) => {
    const [propertyListing, setPropertyListing] = useState(null);
    const [propertyImageUri, setPropertyImageUri] = useState('');
    const [cacheBuster, setCacheBuster] = useState(Date.now());
    const cardSize = Dimensions.get('window').width;

    const fetchPropertyListing = async (id) => {
        try {
            // Make an API call to fetch property listing details by id
            const response = await fetch(getPropertyListing(id));
            const data = await response.json();
            setPropertyListing(data); // Update state with the fetched data
            if (data.images && data.images.length > 0) {
                const imageIds = data.images.map(Number);
                const smallestImageId = Math.min(...imageIds);
                const imageUri = getImageUriById(smallestImageId.toString());
                setPropertyImageUri(imageUri);
            }
            console.log('Property Listing Data:', data);
        } catch (error) {
            console.error('Error fetching property listing:', error);
        }
    };

    useEffect(() => {
        setCacheBuster(Date.now());
    }, [propertyListing]);

    useEffect(() => {
        fetchPropertyListing(propertyId);
    }, []);

    const transactionDate = new Date(transaction.createdAt);
    const localDate = transactionDate.toLocaleDateString();
    const localTime = transactionDate.toLocaleTimeString();

    // Function to get the color based on status
    const getStatusColor = (status) => {
        switch (status) {
            case 'REQUEST_PLACED':
            case 'BUYER_UPLOADED':
            case 'SELLER_UPLOADED':
            case 'ADMIN_UPLOADED':
                return 'yellow';
            case 'COMPLETED':
                return 'green';
            case 'SELLER_DID_NOT_RESPOND':
                return 'red';
            default:
                return 'blue'; // Default color
        }
    };

    // Function to get the status text based on status
    const getStatusText = (status) => {
        switch (status) {
            case 'REQUEST_PLACED':
                return 'Pending';
            case 'BUYER_UPLOADED':
                return 'Buyer Uploaded OTP';
            case 'SELLER_UPLOADED':
                return 'Seller Uploaded OTP';
            case 'ADMIN_UPLOADED':
                return 'Admin Uploaded OTP';
            case 'COMPLETED':
                return 'Confirmed';
            case 'SELLER_DID_NOT_RESPOND':
                return 'Seller Did Not Respond';
            default:
                return status; // Default status text
        }
    };

    const getStatusTextColor = (status) => {
        switch (status) {
            case 'SELLER_DID_NOT_RESPOND':
                return 'white';
            default:
                return 'black'; // Default color
        }
    };

    if (!propertyListing) {
        return null; // Return null if propertyListing is not loaded
    }

    return (
        <TouchableOpacity style={[styles.card, { width: cardSize * 0.85, height: cardSize * 0.65 }]} onPress={onPress}>
            <View style={styles.imageContainer}>
                {/* Property Image */}
                {propertyImageUri ? (
                    <Image source={{ uri: `${propertyImageUri}?timestamp=${cacheBuster}` }} style={styles.propertyImage} />
                ) : (
                    <View style={styles.placeholderImage}>
                        <Image source={DefaultImage} style={styles.placeholderImageImage} />
                    </View>
                )}
            </View>
            <View style={styles.propertyDetails}>
                {/* Property Details */}
                <View style={styles.row}>
                    <Ionicons name="home-outline" size={24} color="#6b7c93" />
                    <Text style={styles.propertyTitle}>{propertyListing?.title}</Text>
                </View>
                <Text style={styles.transactionItem}>{transaction.transactionItem}</Text>
                <Text style={styles.dateTime}>
                    Date: {localDate} | Time: {localTime}
                </Text>
                {/* Status Indicator */}
                <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(transaction.optionFeeStatusEnum) }]}>
                    <Text style={[styles.statusText, { color: getStatusTextColor(transaction.optionFeeStatusEnum) }]}>{getStatusText(transaction.optionFeeStatusEnum)}</Text>
                </View>
            </View>
            <View style={styles.timeSection}>
                <Text style={styles.scheduleTime}>{''}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        alignSelf: 'center',
        marginVertical: 10,
        borderRadius: 12,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 7,
        width: Dimensions.get('window').width * 0.85,
        justifyContent: 'space-between',
    },
    infoSection: {
        flex: 3,
    },
    timeSection: {
        flex: 1,
        alignItems: 'flex-end',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    propertyTitle: {
        fontSize: 17,
        color: '#424f68',
        marginLeft: 8,
        fontWeight: '600',
    },
    scheduleDate: {
        fontSize: 15,
        color: '#000',
        marginLeft: 8,
    },
    scheduleTime: {
        fontSize: 30,
        color: '#424f68',
        fontWeight: '700',
        marginTop: 20,
        marginRight: 10,
    },
    imageContainer: {
        width: '100%',
        height: '50%',
        overflow: 'hidden', // Hide overflow
    },
    propertyImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    placeholderImageImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    propertyDetails: {
        padding: 10,
        flex: 1,
        justifyContent: 'space-between',
    },
    statusIndicator: {
        position: 'absolute',
        bottom: -40,
        left: 10,
        borderWidth: 0.18,
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 5,
        backgroundColor: 'yellow', // Default color
    },
    statusText: {
        fontSize: 12,
        letterSpacing: 1,
        fontWeight: 'bold',
        color: '#000',
        padding: 2,
    },
    dateTime: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 4,
    },
    transactionItem: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
});

export default OptionTransactionCard;
