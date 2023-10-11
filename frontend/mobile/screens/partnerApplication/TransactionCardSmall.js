import React, {useContext, useEffect, useState} from 'react';
import {Dimensions, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {getImageUriById,} from '../../utils/api';
import {AuthContext} from '../../AuthContext';

const TransactionCard = ({transactions}) => {

    const {user} = useContext(AuthContext);
    const cardSize = Dimensions.get('window').width;

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

    // Don't need image, don't need style, consistent animations.
    return (
        <TouchableOpacity
            style={[styles.card, {width: cardSize * 0.8, height: cardSize * 0.8}]}
        >
            <View style={styles.propertyDetails}>
                <Text style={styles.propertyTitle}>{transactions.status}</Text>
                <Text style={styles.propertyPrice}>{transactions.price}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles= StyleSheet.create({
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
        marginLeft: 10,
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
    propertyListing: {
        flexDirection: 'row',
        marginBottom: 20, // Adjust this value to control the spacing between cards
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    placeholderImage: {
        borderRadius: 20,

    },
    placeholderImageImage: {
        width: '100%', // Adjust the width as needed to match the desired size
        height: '80%', // Adjust the height as needed to match the desired size
        marginBottom: 80,
        borderRadius: 10,
    },
    favoriteContainer: {
        // flexDirection: 'row',
        // alignItems: 'left',
        // marginTop: 8, // Adjust the spacing as needed
    },
    favoriteCount: {
        marginTop: 40, // Adjust the spacing between icon and count as needed
        fontSize: 16,
    },
    favoriteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end', // Align to the right
    },
});

export default TransactionCard;
