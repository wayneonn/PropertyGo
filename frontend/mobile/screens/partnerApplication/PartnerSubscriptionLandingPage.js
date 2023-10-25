import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from "../../AuthContext";

const PartnerSubscriptionLandingPage = ({ navigation }) => {

    const colors = ['red', 'green', 'blue', 'orange']; // Define your desired colors
    const animationDuration = 1000; // Duration for each color change (in milliseconds)
    const [currentColor, setCurrentColor] = useState('blue'); // Initial color
    const { user } = useContext(AuthContext);
    const partnerSubscriptionEndDate = user.user.partnerSubscriptionEndDate;
    const endDate = new Date(user.user.partnerSubscriptionEndDate);
    const formattedEndDateString = endDate.toLocaleString('en-SG', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });

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

    function isExpired(dateToCompare) {
        const today = new Date();
        console.log("Today: ", today);
        console.log("Date to compare: ", dateToCompare);

        // Convert dateToCompare to a Date object
        const compareDate = new Date(dateToCompare);

        // Adjust the time zone offset for compareDate to match the local time zone
        compareDate.setMinutes(compareDate.getMinutes() - today.getTimezoneOffset());

        return compareDate < today;
    }



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
            {isExpired(partnerSubscriptionEndDate) && partnerSubscriptionEndDate != null ? (
                <>
                    <Text style={styles.title}>Your Subscription Has Expired 😢 </Text>

                    <Text style={styles.descriptionDate}>Your Subscription Expired on the:</Text>
                    <Text style={styles.descriptionDate}>{formattedEndDateString}</Text>

                    <Text style={styles.description}>
                        Rejoin our platform as a Partner and enjoy a range of exclusive benefits
                        to boost your business.
                    </Text>
                </>
            ) : (
                <>
                    <Text style={styles.title}>Unlock Exclusive Benefits</Text>
                    <Text style={styles.description}>
                        Join our platform as a Partner and enjoy a range of exclusive benefits
                        to boost your business.
                    </Text>
                </>
            )}


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
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 40,
        paddingHorizontal: 20,
        textAlign: 'center',
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
    descriptionDate: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
});

export default PartnerSubscriptionLandingPage;
