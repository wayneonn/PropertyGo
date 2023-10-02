import React, { useContext, useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { AuthContext } from '../../AuthContext';
import { getUserById, updatePropertyBoostDates, getPropertyListing } from '../../utils/api';
import PropertyCard from './PropertyCard'; // Import your PropertyCard component
import BoostOptionCard from './BoostOptionCard';
import { Ionicons } from '@expo/vector-icons';


const BoostListingScreen = ({ route, navigation }) => {
    const { user } = useContext(AuthContext);
    const { propertyListingId } = route.params;

    // State to hold user data and property listing data
    const [userData, setUserData] = useState(null);
    const [propertyListing, setPropertyListing] = useState(null);

    // Fetch user data by userId
    const fetchUserData = async (userId) => {
        try {
            const { success, data, message } = await getUserById(userId);

            if (success) {
                setUserData(data);
            } else {
                console.error('Error fetching user:', message);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    // Fetch property listing data
    const fetchPropertyListingData = async (listingId) => {
        try {
            const { success, data, message } = await getPropertyListing(listingId);

            if (success) {
                setPropertyListing(data);
            } else {
                console.error('Error fetching property listing:', message);
            }
        } catch (error) {
            console.error('Error fetching property listing:', error);
        }
    };

    useEffect(() => {
        if (user && user.user) {
            fetchUserData(user.user.userId);
            fetchPropertyListingData(propertyListingId);
        }
    }, [user]);

    // Define the boost options
    const boostOptions = [
        { days: 5, tokens: 5 },
        { days: 12, tokens: 10 },
        { days: 20, tokens: 18 },
        { days: 30, tokens: 35 },
        { days: 45, tokens: 60 },
        { days: 60, tokens: 110 },
        // Add more boost options as needed
    ];

    // Function to handle boosting property listing
    const handleBoostProperty = async (boostDays, requiredTokens) => {
        // Check if the user has enough tokens
        if (userData.token < requiredTokens) {
            Alert.alert('Not Enough Tokens', 'You do not have enough tokens to boost the listing.');
            return;
        }

        // Calculate new boost dates
        const currentDate = new Date();
        const boostStartDate = currentDate.toISOString();
        const boostEndDate = new Date(currentDate);
        boostEndDate.setDate(boostEndDate.getDate() + boostDays);
        const formattedEndDate = boostEndDate.toISOString();

        // Update property listing with new boost dates
        try {
            const { success, message } = await updatePropertyBoostDates(propertyListingId, boostStartDate, formattedEndDate);

            if (success) {
                Alert.alert('Boost Successful', `Your listing has been boosted for ${boostDays} days.`);
                navigation.goBack();
            } else {
                Alert.alert('Error', `Failed to boost listing: ${message}`);
            }
        } catch (error) {
            console.error('Error boosting property listing:', error);
            Alert.alert('Error', 'An error occurred while boosting the property listing.');
        }
    };

    return (
        <ScrollView>
            <View style={styles.headerContainer}>
                {/* Back button */}
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.header}>Boost Listing</Text>
            </View>
            {propertyListing && (
                <PropertyCard
                    propertyData={propertyListing}
                    onPress={() => { }}
                />
            )}
            <Text style={styles.tokenAmountText}>{`Your Tokens: ${userData ? userData.token : 0}`}</Text>
            {boostOptions.map((option, index) => (
                <BoostOptionCard
                    key={index}
                    boostOption={option}
                    onPressBoost={(days, tokens) => handleBoostProperty(days, tokens)}
                />
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 16,
    },
    tokenAmountText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 120,
        marginTop: 10,
    },
    backButton: {
        position: 'absolute',
        top: 16, // Adjust the top position as needed
        left: 16, // Adjust the left position as needed
        zIndex: 1, // Place it above the swiper
      },
});

export default BoostListingScreen;
