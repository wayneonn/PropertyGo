import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { AuthContext } from "../../AuthContext";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const SubscriptionPage = ({ navigation }) => {
    const [subscriptionEndDate, setSubscriptionEndDate] = useState(null); // Replace with actual subscription end date
    const { user } = React.useContext(AuthContext);
    const endDate = new Date(user.user.partnerSubscriptionEndDate);
    const formattedEndDateString = endDate.toLocaleString('en-SG', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });

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
            {isExpired(subscriptionEndDate) && !user.user.partnerSubscriptionPaid ? (
                <>
                    <View style={styles.image}>
                        <MaterialCommunityIcons
                            name="alert-circle-outline"
                            size={144}
                            color="black"
                        // style={{ marginRight: 4 }}
                        />
                    </View>
                    <Text style={styles.title}>You do not have an active subscription with us!</Text>
                    {isExpired(subscriptionEndDate) ? (
                        <>
                            <Text style={styles.descriptionDate}>Your Subscription Expired on the:</Text>
                            <Text style={styles.descriptionDate}>{formattedEndDateString}</Text>
                        </>

                    ) :
                        (
                            <Text style={styles.buttonText}>Subscribe</Text>
                        )}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Partner Subscription Checkout Screen', { quantity: '1', description: "Partner Subscription Fee", partnerSubscriptionCost: 5000 })}
                    >
                        <Text style={styles.buttonText}>Subscribe</Text>
                    </TouchableOpacity>
                </>

            ) : (
                <>
                    <View style={styles.image}>
                        <MaterialCommunityIcons
                            name="calendar-text-outline"
                            size={144}
                            color="black"
                        // style={{ marginRight: 4 }}
                        />
                    </View>


                    <Text style={styles.title}>Thank You For Being A Partner With Us!</Text>

                    <Text style={styles.endDateText}>
                        Your subscription ends on the:
                    </Text>
                    <Text style={styles.endDateText}>
                        {formattedEndDateString}
                    </Text>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Partner Subscription Checkout Screen', { quantity: '1', description: "Resubscription for Partner", partnerSubscriptionCost: 5000 })} // Navigate to the resubscribe screen
                    >
                        <Text style={styles.buttonText}>Renew Subscription</Text>
                    </TouchableOpacity>
                </>
            )}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#ffffff',
    },
    image: {
        marginBottom: 70,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        paddingHorizontal: 20,
        color: '#333333',
        textAlign: 'center',
    },
    endDateText: {
        fontSize: 18,
        marginBottom: 20,
        color: '#666666',
    },
    button: {
        marginTop: 40,
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
    image: {
        marginBottom: 70,
    },
    descriptionDate: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
});

export default SubscriptionPage;
