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
} from '../../utils/api';
import { format } from 'date-fns';
import DefaultImage from '../../assets/No-Image-Available.webp';

const AppointmentCard = ({ schedule, onPress, propertyId }) => {
    const [currentColor, setCurrentColor] = useState('blue'); // Initial color
    const colors = ['red', 'green', 'blue', 'orange']; // Define your desired colors
    const animationDuration = 1000; // Duration for each color change (in milliseconds)
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

    // Helper function to format the date and time
    const formatDate = (dateString) => {
        return format(new Date(dateString), 'dd MMMM yyyy'); // e.g., 23 October 2023
    };

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        return format(date, 'h a'); // e.g., 2 PM
    };

    // Function to get the color based on status
    const getStatusColor = (status) => {
        switch (status) {
            case 'AWAIT_SELLER_CONFIRMATION':
                return 'yellow';
            case 'SELLER_CONFIRMED':
                return 'green';
            case 'SELLER_REJECT':
            case 'BUYER_CANCELLED':
            case 'SELLER_CANCELLED':
                return 'red';
            default:
                return 'blue'; // Default color
        }
    };

    // Function to get the status text based on status
    const getStatusText = (status) => {
        switch (status) {
            case 'AWAIT_SELLER_CONFIRMATION':
                return 'Awaiting Seller Response';
            case 'SELLER_CONFIRMED':
                return 'Confirmed';
            case 'SELLER_REJECT':
            case 'BUYER_CANCELLED':
            case 'SELLER_CANCELLED':
                return 'Cancelled';
            default:
                return status; // Default status text
        }
    };

    const getStatusTextColor = (status) => {
        switch (status) {
          case 'AWAIT_SELLER_CONFIRMATION':
            return 'black';
          default:
            return 'white'; // Default color
        }
      };

      if (!propertyListing) {
        return null; // Return null if propertyListing is not loaded
    }

    return (
        <TouchableOpacity style={[styles.card, { width: cardSize * 0.85, height: cardSize * 0.8 }]} onPress={() => onPress(schedule.scheduleId)}>
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
                <View style={styles.row}>
                    <Ionicons name="locate-outline" size={24} color="#6b7c93" />
                    <Text style={styles.scheduleDate}>{propertyListing?.area}</Text>
                </View>
                <View style={styles.row}>
                    <Ionicons name="calendar-outline" size={20} color="#6b7c93" />
                    <Text style={styles.scheduleDate}>{formatDate(schedule.meetupDate)}</Text>
                </View>
                {/* Status Indicator */}
                <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(schedule.ScheduleStatus) }]}>
                    <Text style={[styles.statusText, { color: getStatusTextColor(schedule.ScheduleStatus) }]}>{getStatusText(schedule.ScheduleStatus)}</Text>
                </View>
            </View>
            <View style={styles.timeSection}>
                <Text style={styles.scheduleTime}>{formatTime(schedule.meetupTime)}</Text>
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
        bottom: -55,
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
});

export default AppointmentCard;
