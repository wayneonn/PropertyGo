import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CustomerCard from './CardComponents/CustomerCard';
import PropertyCardRectangle from './CardComponents/PropertyCardRectangle';
import TrackOrderCard from './CardComponents/TrackOrderCard';
import {
    getPropertyListing, getUserById
} from '../../../utils/api';
import StepIndicator from 'react-native-step-indicator';

const OrderDetailScreen = ({ route }) => {
    const navigation = useNavigation();
    const [propertyListing, setPropertyListing] = useState(null);
    const [seller, setSeller] = useState(null);
    const { transaction } = route.params;

    useEffect(() => {
        fetchPropertyListing(transaction.propertyId);
        fetchUser(transaction.userId)
    }, []);

    const fetchPropertyListing = async (id) => {
        try {
            const response = await fetch(getPropertyListing(id));
            const data = await response.json();
            setPropertyListing(data); // Update state with the fetched data
            console.log('Property Listing Data:', data)
        } catch (error) {
            console.error('Error fetching property listing:', error);
        }
    };

    const fetchUser = async (userId) => {
        try {
            console.log("userId: ", userId)
            const { success, data, message } = await getUserById(userId);

            if (success) {
                setSeller(data);
                return data;
            } else {
                // Handle the error here
                console.error('Error fetching user:', message);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.header}>Detail Order</Text>
            </View>

            {propertyListing && seller ? (   
                <>
                    <CustomerCard sellerId={transaction.userId} />

                    <PropertyCardRectangle
                        property={propertyListing}
                        seller={seller}
                        onPress={() => {
                            navigation.navigate('Property Listing', { propertyListingId: propertyListing.propertyListingId })
                        }}
                    />

                    <TrackOrderCard optionFeeStatus={transaction.optionFeeStatus}
                        optionFee={propertyListing.optionFee}
                        transactionId={transaction.transactionId}
                        transactionDate={transaction.createdAt}
                    />
                </>
            ) : (
                <Text>Loading...</Text>
            )}

            <TouchableOpacity style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel Order</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    header: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 120,
        marginTop: 10,
        paddingBottom: 20,
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    profileContainer: {
        alignItems: 'center',
        padding: 20,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    chatButton: {
        backgroundColor: '#1565c0',
        padding: 10,
        borderRadius: 20,
        marginTop: 10,
    },
    chatButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    orderInfo: {
        padding: 20,
    },
    productTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    productPrice: {
        fontSize: 16,
        color: '#d32f2f',
        fontWeight: 'bold',
        marginTop: 5,
    },
    units: {
        fontSize: 14,
        marginTop: 5,
    },
    orderTracking: {
        padding: 20,
        height: 400,
    },
    orderStatus: {
        fontSize: 14,
        marginTop: 5,
    },
    cancelButton: {
        backgroundColor: '#d32f2f',
        padding: 15,
        borderRadius: 20,
        margin: 20,
    },
    cancelButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default OrderDetailScreen;
