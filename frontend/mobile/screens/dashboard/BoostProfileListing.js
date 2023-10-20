import React, { useContext, useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { AuthContext } from '../../AuthContext';
import { getUserById, editProperty, getPropertyListing, updateUserProfile } from '../../utils/api';
import PropertyCard from '../propertyListings/PropertyCard'; // Import your PropertyCard component
import BoostOptionCard from '../propertyListings/BoostOptionCard';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';


const BoostListingScreen = ({ route, navigation }) => {
    const { user } = useContext(AuthContext);

    // State to hold user data and property listing data
    const [userData, setUserData] = useState(null);
    const [propertyListing, setPropertyListing] = useState(null);

    useFocusEffect(
        React.useCallback(() => {
            console.log('Home page gained focus');
            if (user && user.user) {
                fetchUserData(user.user.userId);
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



    useEffect(() => {
        if (user && user.user) {
            fetchUserData(user.user.userId);
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
        }
        // Remove the entirety of property. Adding in logic for the user itself.
    };

    // Inside your BoostListingScreen component
    return (
        <ScrollView>
            <View style={styles.headerContainer}>
                {/* Back button */}
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.header}>Boost Partner</Text>
            </View>
            <Text style={styles.description}>
                {/* {"\nLooking to grab more attention for your listings? Introducing our new and exciting Bump Listing feature! 🌟"} */}
                {"Here's why you should consider using the Bump Profile Feature: "}
                <Text style={styles.headerDescription}>{"\n\n🚀 Boost Visibility: "}</Text>{"Profile with the Lightning Bolt are given premium placement, ensuring that your profile is one of the first things users see when they browse our platform. Say goodbye to being buried in the search results!"}
                <Text style={styles.headerDescription}>{"\n\n"}</Text>
                <Text style={styles.headerDescription}>
                    <Animatable.View animation="jello" easing="ease-out" iterationCount="infinite">
                        <Ionicons name="flash" size={24} color={currentColor} style={{}} />
                    </Animatable.View>{"Highlight Your Profile:  "}</Text>{"The striking lightning icon signals that your profile is something special. It's a visual cue that your profile offers unique value, whether it's an incredible deal, a stunning service, or standout features."}
                <Text style={styles.headerDescription}>{"\n\n💰 Maximize Your Earnings: "}</Text>{" In a competitive market, getting noticed is crucial. By using the Lightning Bolt, you're investing in the success of your partnership, which can lead to quicker sales or rentals."}
                {"\n\nDon't miss out on this opportunity to boost your profile's visibility. Try the Lightning Bolt feature today and see the results for yourself!  "}
            </Text>

            {/* Boost Options */}
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
