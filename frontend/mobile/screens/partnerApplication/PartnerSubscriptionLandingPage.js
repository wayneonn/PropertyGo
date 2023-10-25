import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';

const PartnerSubscriptionLandingPage = ({ navigation }) => {

    const colors = ['red', 'green', 'blue', 'orange']; // Define your desired colors
    const animationDuration = 1000; // Duration for each color change (in milliseconds)
    const [currentColor, setCurrentColor] = useState('blue'); // Initial color

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

    return (
        <View style={styles.container}>

            <View style={styles.image}>
                <Animatable.View animation="swing" easing="ease-out" iterationCount="infinite">
                    <Ionicons
                        name="lock-open"
                        size={144}
                        color={currentColor}
                        style={{ marginRight: 4 }}
                    />
                </Animatable.View>
            </View>

            <Text style={styles.title}>Unlock Exclusive Benefits</Text>

            <Text style={styles.description}>
                Join our platform as a Partner and enjoy a range of exclusive benefits
                to boost your business.
            </Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Partner Subscription Checkout Screen', { quantity: '1', description: "Partner Subscription Fee", partnerSubscriptionCost: 5000 })}
            >
                <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    image: {
        marginBottom: 70,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 40,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 40,
    },
    button: {
        backgroundColor: '#007BFF',
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 8,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
});

export default PartnerSubscriptionLandingPage;
