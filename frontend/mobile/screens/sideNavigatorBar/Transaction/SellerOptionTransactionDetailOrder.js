import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, 
    TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CustomerCard from './CardComponents/CustomerCard';
import PropertyCardRectangle from './CardComponents/PropertyCardRectangle';
import TrackOrderCard from './CardComponents/TrackOrderCard';
import {
    getPropertyListing, getUserById
} from '../../../utils/api';
import {
    getTransactionByTransactionId
} from '../../../utils/transactionApi';
import StepIndicator from 'react-native-step-indicator';
import { useFocusEffect } from '@react-navigation/native';
import {
    sellerCancelledOTP,
} from '../../../utils/transactionApi';
import {
    editProperty
} from '../../../utils/api';

const OrderDetailScreen = ({ route }) => {
    const navigation = useNavigation();
    const [propertyListing, setPropertyListing] = useState(null);
    const [transaction, setTransaction] = useState(null);
    const [seller, setSeller] = useState(null);
    const { transactionId } = route.params;
    const [refreshKey, setRefreshKey] = useState(0);

    useFocusEffect(
        React.useCallback(() => {
            console.log('page gained focus');
            fetchTransaction(transactionId);
        }, [])
    );

    useEffect(() => {
        fetchTransaction(transactionId);
    }, [refreshKey, transactionId]);

    const fetchTransaction = async (id) => {
        try {
            const { success, data, message } = await getTransactionByTransactionId(id);
            console.log("data: ", data.transactions[0])
            setTransaction(data.transactions[0]); // Update state with the fetched data
            fetchPropertyListing(data.transactions[0].propertyId);
            fetchUser(data.transactions[0].userId);
        } catch (error) {
            console.error('Error fetching transaction:', error);
        }
    };

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

    const handleCancelOrder = () => {
        Alert.alert(
            'Confirm Cancellation',
            'Are you sure you want to place a cancellation for this property?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'Confirm', onPress: cancelOrder },
            ],
            { cancelable: false }
        );
    }

    const cancelOrder = async () => {
        await sellerCancelledOTP(transaction.transactionId, {
            optionToPurchaseDocumentId: transaction.optionToPurchaseDocumentId,
        });
        await editProperty(
            propertyListing.propertyListingId,
            {
                optionExpiryDate: null,
                offeredPrice: null,
            }
        );
        Alert.alert(
            'Cancel Successful',
            'You have successfully cancelled the order.'
        );
        setRefreshKey(prevKey => prevKey + 1);
        // navigation.navigate('Option Transaction Order Screen', { transactionId: transaction.transactionId});
    }

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

            {transaction && propertyListing && seller ? (
                <>
                    <CustomerCard sellerId={transaction.buyerId}
                        transaction={transaction}
                        property={propertyListing}
                    />

                    <PropertyCardRectangle
                        property={propertyListing}
                        transaction={transaction}
                        seller={seller}
                        onPress={() => {
                            navigation.navigate('Property Listing', { propertyListingId: propertyListing.propertyListingId })
                        }}
                    />

                    <TrackOrderCard
                        key={refreshKey}
                        optionFeeStatus={transaction.optionFeeStatusEnum}
                        paymentAmount={transaction.paymentAmount}
                        onHoldBalance={transaction.onHoldBalance}
                        transactionId={transaction.transactionId}
                        transactionDate={transaction.createdAt}
                        transactionUserId={transaction.userId}
                        taxable={transaction.gst}
                    />


                    {transaction && transaction.optionFeeStatusEnum == "REQUEST_PLACED" ? (
                        <TouchableOpacity style={styles.uploadButton}
                            onPress={() => {
                                navigation.navigate('Seller Upload OTP', { property: propertyListing, transaction: transaction });
                            }}>
                            <Text style={styles.cancelButtonText}>Upload OTP</Text>
                        </TouchableOpacity>
                    ) : (
                        <></>
                    )}

                    {transaction && transaction.optionFeeStatusEnum == "BUYER_REQUEST_REUPLOAD" ? (
                        <TouchableOpacity style={styles.uploadButton}
                            onPress={() => {
                                navigation.navigate('Seller Reupload OTP', { property: propertyListing, transaction: transaction });
                            }}>
                            <Text style={styles.cancelButtonText}>Reupload OTP</Text>
                        </TouchableOpacity>
                    ) : (
                        <></>
                    )}

                    {transaction && (transaction.optionFeeStatusEnum == "REQUEST_PLACED" || transaction.optionFeeStatusEnum == "SELLER_UPLOADED" || transaction.optionFeeStatusEnum == "BUYER_REQUEST_REUPLOAD") ? (
                        <TouchableOpacity style={styles.cancelButton} onPress={handleCancelOrder}>
                            <Text style={styles.cancelButtonText}>Cancel Order</Text>
                        </TouchableOpacity>
                    ) : (
                        <></>
                    )}
                </>
            ) : (
                <ActivityIndicator style={styles.loadingIndicator} size="large" color="#00adf5"/>
            )}

            <Text></Text>
            <Text></Text>
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
        marginTop: 40,
        paddingBottom: 20,
    },
    backButton: {
        position: 'absolute',
        top: 50,
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
        borderRadius: 10,
        margin: 20,
    },
    cancelButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    uploadButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        margin: 20,
        marginBottom: 2,
    },
    loadingIndicator: {
        flex: 2,
        paddingTop: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default OrderDetailScreen;
