import React, { useContext, useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { AuthContext } from '../../AuthContext';
import { getUserById, editProperty, getPropertyListing, updateUserProfile } from '../../utils/api';
import PropertyCard from './PropertyCardRectangle'; // Import your PropertyCard component
import BoostOptionCard from './BoostOptionCard';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';


const BoostListingScreen = ({ route, navigation }) => {
    const { user } = useContext(AuthContext);
    const { propertyListingId } = route.params;

    // State to hold user data and property listing data
    const [userData, setUserData] = useState(null);
    const [propertyListing, setPropertyListing] = useState(null);

    useFocusEffect(
        React.useCallback(() => {
            console.log('Home page gained focus');
            if (user && user.user) {
                fetchUserData(user.user.userId);
                fetchPropertyListingData(propertyListingId);
            }
        }, [])
    );

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
            // const { success, data, message } = await getPropertyListing(listingId);

            // if (success) {
            //     setPropertyListing(data);
            // } else {
            //     console.error('Error fetching property listing:', message);
            // }

            const response = await fetch(getPropertyListing(listingId));
            const data = await response.json();
            setPropertyListing(data); // Update state with the fetched data
        } catch (error) {
            console.error('Error fetching property listing:', error);
        }
    };

    useEffect(() => {
        if (user && user.user) {
            fetchUserData(user.user.userId);
            fetchPropertyListingData(propertyListingId);
        }
        console.log('Property Listing Data:', propertyListing);
    }, [user]);

    const [currentColor, setCurrentColor] = useState('blue'); // Initial color
    const colors = ['red', 'green', 'blue', 'orange']; // Define your desired colors
    const animationDuration = 1000; // Duration for each color change (in milliseconds)

    useEffect(() => {
        // Create a timer to change the color at regular intervals
        const colorChangeTimer = setInterval(() => {
            // Get the next color in the array
            const nextColorIndex = (colors.indexOf(currentColor) + 1) % colors.length;
            const nextColor = colors[nextColorIndex];
            setCurrentColor(nextColor);
        }, animationDuration);

        // Clear the timer when the component unmounts
        return () => clearInterval(colorChangeTimer);
    }, [currentColor]);

    // Define the boost options
    const boostOptions = [
        { days: 5, tokens: 5 },
        { days: 12, tokens: 10 },
        { days: 20, tokens: 18 },
        { days: 30, tokens: 35 },
        { days: 45, tokens: 60 },
        { days: 60, tokens: 110 },
        { days: 75, tokens: 150 },
        { days: 90, tokens: 200 },
        // Add more boost options as needed
    ];

    // Function to handle boosting property listing
    const handleBoostProperty = async (boostDays, requiredTokens) => {
        // Check if the user has enough tokens
        if (userData.token < requiredTokens) {
            Alert.alert(
                'Not Enough Tokens',
                'You do not have enough tokens to boost the listing.',
                [
                    {
                        text: 'Purchase Tokens',
                        onPress: () => {
                            // Navigate to the token purchase page (you can replace 'TokenPurchaseScreen' with the actual screen name)
                            navigation.navigate('Token');
                        },
                    },
                    {
                        text: 'OK',
                        style: 'cancel', // This makes it the default "Cancel" button
                    },
                ]
            );
            return;
        }

        // Fetch the current property data
        fetchPropertyListingData(propertyListingId);
        const currentProperty = propertyListing;

        if (currentProperty) {
            // Calculate new boost dates
            const currentDate = new Date();
            const boostStartDate = currentDate.toISOString();
            let formattedEndDate = null;
            console.log('currentProperty.boostListingEndDate: ', propertyListing);

            if (currentProperty.boostListingEndDate) {
                // If the property was previously boosted, extend the boost by adding `boostDays` to the current end date
                const currentEndDate = new Date(currentProperty.boostListingEndDate);
                currentEndDate.setHours(currentDate.getHours()); // Set hours to current hour
                currentEndDate.setMinutes(currentDate.getMinutes()); // Set minutes to current minute
                currentEndDate.setDate(currentEndDate.getDate() + boostDays);
                formattedEndDate = currentEndDate;
            } else {
                // If it wasn't previously boosted, set a new end date `boostDays` in the future
                const boostEndDate = new Date(currentDate);
                boostEndDate.setHours(currentDate.getHours()); // Set hours to current hour
                boostEndDate.setMinutes(currentDate.getMinutes()); // Set minutes to current minute
                boostEndDate.setDate(boostEndDate.getDate() + boostDays);
                formattedEndDate = boostEndDate;
            }

            // Format the end date in Singapore time (SGT) and the desired format
            const formattedEndDateString = formattedEndDate.toLocaleString('en-SG', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            });

            // Prepare the updated property data with new boost dates
            const updatedPropertyData = {
                propertyListingId: propertyListingId,
                boostListingStartDate: boostStartDate,
                boostListingEndDate: formattedEndDate,
            };

            // Determine whether the listing is extended or boosted
            const isExtended = !!currentProperty.boostListingEndDate;
            const actionVerb = isExtended ? 'extended' : 'boosted';
            const actionMessage = isExtended
                ? `Your listing has been extended by ${boostDays} days which ends on ${formattedEndDateString}.`
                : `Your listing has been boosted by ${boostDays} days which ends on ${formattedEndDateString}.`;

            // Update the property with new boost dates
            try {
                const { success, message } = await editProperty(propertyListingId, updatedPropertyData);

                if (success) {
                    // Update the user's token amount after a successful boost
                    const updatedTokenAmount = userData.token - requiredTokens;
                    const userId = user.user.userId;

                    const formData = new FormData();
                    formData.append('token', updatedTokenAmount);
                    formData.append('email', user.user.email);

                    const userProfileUpdateResponse = await updateUserProfile(userId, formData);

                    if (userProfileUpdateResponse.success) {
                        // Update the user's token amount and show a success message
                        setUserData({ ...userData, token: updatedTokenAmount });
                        Alert.alert('Boost Successful', actionMessage);
                        navigation.goBack();
                    } else {
                        // Handle the case where updating the user's token amount failed
                        Alert.alert('Error', 'An error occurred while updating your token amount.');
                    }
                } else {
                    Alert.alert('Error', `Failed to boost listing: ${message}`);
                }
            } catch (error) {
                console.error('Error boosting property listing:', error);
                Alert.alert('Error', 'An error occurred while boosting the property listing.');
            }
        } else {
            // Handle the case where fetching property data failed
            Alert.alert('Error', 'Failed to fetch property data. Please try again later.');
        }
    };

    const calculateBoostStatus = (property) => {
        const currentDate = new Date();
        const boostStartDate = property.boostListingStartDate ? new Date(property.boostListingStartDate) : null;
        const boostEndDate = property.boostListingEndDate ? new Date(property.boostListingEndDate) : null;

        if (boostStartDate && boostEndDate) {
            const isActive = boostStartDate <= currentDate && boostEndDate >= currentDate;

            return {
                isActive,
                validTill: boostEndDate,
            };
        } else {
            // If there are no boost dates, it's inactive
            return {
                isActive: false,
                validTill: null,
            };
        }
    };

    // Inside your BoostListingScreen component
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
                <>
                    <Text style={styles.tokenAmountText}>{"\nYour Token Amount: "}
                        <Text style={styles.bold}>{`${userData ? userData.token : 0}`}{" "}</Text><FontAwesome5 name="coins" size={20} color="black" />
                    </Text>
                    {/* <Text style={styles.tokenAmountText}>{`Your Tokens: ${userData ? userData.token : 0}`}</Text> */}

                    {/* Boost Status */}
                    {(
                        <View style={styles.boostStatusContainer}>
                            <Ionicons
                                name={calculateBoostStatus(propertyListing).isActive ? 'checkmark-circle' : 'close-circle'}
                                size={24}
                                color={calculateBoostStatus(propertyListing).isActive ? 'green' : 'red'}
                            />
                            <Text style={styles.boostStatusText}>
                                {calculateBoostStatus(propertyListing).isActive ? 'Active' : 'Inactive'}
                            </Text>
                        </View>
                    )}

                    {/* Boost Listing Date Valid Till */}
                    {propertyListing.boostListingEndDate && (
                        <Text style={styles.validTillText}>
                            {`Valid Till: ${calculateBoostStatus(propertyListing).validTill.toLocaleString(
                                'en-SG',
                                {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                }
                            )}`}
                        </Text>
                    )}

                    {!propertyListing.boostListingEndDate && (
                        <Text style={styles.description}>
                            {/* {"\nLooking to grab more attention for your listings? Introducing our new and exciting Bump Listing feature! 🌟"} */}
                            {"Here's why you should consider using the Bump Listing Feature: "}
                            <Text style={styles.headerDescription}>{"\n\n🚀 Boost Visibility: "}</Text>{"Listings with the Lightning Bolt are given premium placement, ensuring that your property is one of the first things users see when they browse our platform. Say goodbye to being buried in the search results!"}
                            <Text style={styles.headerDescription}>{"\n\n"}</Text>
                            <Text style={styles.headerDescription}>
                                <Animatable.View animation="jello" easing="ease-out" iterationCount="infinite">
                                    <Ionicons name="flash" size={24} color={currentColor} style={{}} />
                                </Animatable.View>{"Highlight Your Listing:  "}</Text>{"The striking lightning icon signals that your property is something special. It's a visual cue that your listing offers unique value, whether it's an incredible deal, a stunning location, or standout features."}
                            <Text style={styles.headerDescription}>{"\n\n💰 Maximize Your Earnings: "}</Text>{" In a competitive market, getting noticed is crucial. By using the Lightning Bolt, you're investing in the success of your listing, which can lead to quicker sales or rentals."}
                            {"\n\nDon't miss out on this opportunity to boost your listing's visibility. Try the Lightning Bolt feature today and see the results for yourself!  "}
                        </Text>
                    )}

                    {/* Property Card */}
                    {propertyListing && (
                        <PropertyCard
                            property={propertyListing}
                            disableFavButton={true}
                            onPress={() => { }}
                        />
                    )}

                    {/* Boost Options */}
                    {boostOptions.map((option, index) => (
                        <BoostOptionCard
                            key={index}
                            boostOption={option}
                            onPressBoost={(days, tokens) => handleBoostProperty(days, tokens)}
                        />
                    ))}
                </>
            )}
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
        marginTop: 15,
    },
    backButton: {
        position: 'absolute',
        top: 16, // Adjust the top position as needed
        left: 16, // Adjust the left position as needed
        zIndex: 1, // Place it above the swiper
    },
    boostStatusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Center horizontally
        marginVertical: 1,
        borderColor: 'lightgray', // Border color
        paddingVertical: 8, // Add vertical padding
        borderRadius: 5, // Add border radius for rounded corners
    },
    boostStatusText: {
        marginLeft: 8,
        fontSize: 18,
        fontWeight: 'bold',
    },
    validTillText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        fontSize: 13,
        // textAlign: 'center',
        // marginHorizontal: 20,
        marginRight: 20,
        marginLeft: 25,
        marginBottom: 16,
        letterSpacing: 0.4,
    },
    headerDescription: {
        fontSize: 13,
        fontWeight: 'bold',
        marginHorizontal: 20,
        marginBottom: 16,
    },
    bold: {
        fontWeight: 'bold',
    },
});

export default BoostListingScreen;
