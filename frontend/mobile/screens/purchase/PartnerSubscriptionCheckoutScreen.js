import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Alert, Linking, StyleSheet, TouchableOpacity } from 'react-native';
import { useStripe, StripeProvider } from '@stripe/stripe-react-native';
import { updateUserStripeCustomerId, initializePaymentSheet, createTokenTransactionRecord, fetchUpdatedUserDetails, handleDeepLink } from '../../services/StripeServices';
import { updateUserProfile } from '../../utils/api';
import { AuthContext } from '../../AuthContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome, Ionicons } from '@expo/vector-icons'; // Import the desired icon library
import { is } from 'date-fns/locale';

const PartnerSubscriptionCheckoutScreen = ({ route }) => {
    const { user, login } = useContext(AuthContext);
    const navigation = useNavigation();
    const { initPaymentSheet, presentPaymentSheet, handleURLCallback } = useStripe();
    const [loading, setLoading] = useState(false);
    const [newStripeCustomerId, setStripeCustomerId] = useState('');
    const [ephemeralKey, setEphemeralKey] = useState('');
    const [paymentIntent, setPaymentIntent] = useState('');
    const [publishableKey, setPublishableKey] = useState('');
    const [custIdExists, setCustIdExists] = useState(false);
    const gst = 0.08;
    const taxable = true;
    const boostDays = 365;

    // Use the route object to get the selected token package details
    const { quantity, description, partnerSubscriptionCost } = route.params; // Make sure you pass the selected package from the previous screen

    const stripeCustomerId = user.user.stripeCustomerId;

    const initializePayment = async () => {
        await initializePaymentSheet(
            stripeCustomerId,
            user.user,
            description,
            partnerSubscriptionCost,
            setStripeCustomerId,
            setEphemeralKey,
            setPaymentIntent,
            setPublishableKey,
            setCustIdExists,
            initPaymentSheet,
            setLoading,
            taxable,
        );
    };

    const handleSuccess = async () => {

        try {
            const formData = new FormData();

            const currentDate = new Date();
            let formattedEndDate = null;

            if (user.user.partnerSubscriptionEndDate) {
                // If the property was previously boosted, extend the boost by adding `boostDays` to the current end date
                const currentEndDate = new Date(user.user.partnerSubscriptionEndDate);
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

            const isoFormattedEndDate = formattedEndDate.toISOString();


            formData.append('partnerSubscriptionPaid', true);
            formData.append('partnerSubscriptionEndDate', isoFormattedEndDate);
            formData.append('email', user.user.email);

            console.log("formattedEndDateString: ", formattedEndDateString)
            console.log("formattedEndDate: ", formattedEndDate)
            const { success, data, message } = await updateUserProfile(user.user.userId, formData);

            if (success) {
                fetchUpdatedUserDetails(user.user, login);
                Alert.alert('Purchase Successful', `You have subscribed at your subscription will end on the ${formattedEndDateString}!`);
            } else {
                Alert.alert('Error', message || 'Purchase failed.');
            }
        } catch (error) {
            console.error('Error updating user profile:', error);
            Alert.alert('Error', 'Purchase failed.');
        }

    }

    const openPaymentSheet = async () => {
        try {
            const { error } = await presentPaymentSheet();

            if (error) {
                Alert.alert(`Error code: ${error.code}`, error.message);
            } else {
                if (custIdExists == false) {
                    updateUserStripeCustomerId(newStripeCustomerId, user.user, login);
                }
                const status = 'PAID';
                const transactionType = 'PARTNER_SUBSCRIPTION';

                // Calculate tax amount
                const taxAmount = partnerSubscriptionCost * gst;
                // Calculate total amount including tax
                const totalAmount = partnerSubscriptionCost + taxAmount;

                // Create a record for the token purchase transaction
                handleSuccess();
                createTokenTransactionRecord(user.user, paymentIntent, status, transactionType, description, quantity, partnerSubscriptionCost, taxable);

                // Display the item, quantity, price, tax amount, and total amount
                // Alert.alert('Purchase Successful', `You have subscribed at your subscription will end on the ${formattedEndDateString}!`);
                if(description === "Partner Subscription Fee"){
                    navigation.navigate('List Property'); 
                }   else {
                    navigation.goBack();
                }
                
            }
        } catch (error) {
            console.error('Error opening payment sheet:', error);
        }
    };

    useEffect(() => {
        initializePayment();

        // Handle deep linking
        const getUrlAsync = async () => {
            const initialUrl = await Linking.getInitialURL();
            handleDeepLink(initialUrl, handleURLCallback);
        };

        getUrlAsync();

        const deepLinkListener = Linking.addEventListener('url', (event) => {
            handleDeepLink(event.url, handleURLCallback);
        });

        return () => deepLinkListener.remove();
    }, [handleURLCallback]);

        // Function to format currency
        const formatCurrency = (amount) => {
            return `SGD ${amount.toFixed(2)}`;
        };

    return (
        <View style={styles.container}>
            <StripeProvider publishableKey={publishableKey}>
                <View style={styles.headerContainer}>
                    {/* Back button */}
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.header}>Purchase Summary</Text>
                    {/* Help icon */}
                </View>

                <View style={styles.invoiceContainer}>
                    <View style={styles.invoiceItem}>
                        <Text style={styles.label}>Qty</Text>
                        <Text style={styles.label}>Description</Text>
                        <Text style={styles.label}>Amount</Text>
                    </View>
                    <View style={styles.descriptionLineContainer}></View>
                    <View style={styles.invoiceItem}>
                        <Text style={styles.info}>{quantity}{" Qty"}</Text>
                        <Text style={styles.info}>{description}</Text>
                        <Text style={styles.info}>{formatCurrency(partnerSubscriptionCost)}</Text>
                    </View>
                    <View style={(styles.invoiceItem)}>
                        <Text style={styles.info}></Text>
                        <Text style={styles.info}></Text>
                        <Text style={(styles.label)}>Subtotal:</Text>
                        <Text style={styles.info}>
                            {formatCurrency(partnerSubscriptionCost)}
                        </Text>
                    </View>

                    <View style={(styles.invoiceItem)}>
                        <Text style={styles.info}></Text>
                        <Text style={styles.info}></Text>
                        <Text style={(styles.label)}>GST (8%):</Text>
                        <Text style={styles.info}>
                            {formatCurrency((taxable ? partnerSubscriptionCost * 0.08 : 0))}
                        </Text>
                    </View>
                    <View style={styles.totalAmountContainer}>
                        <Text style={styles.label}>Total Amount:</Text>
                        <Text style={styles.info}>
                            {formatCurrency(
                                partnerSubscriptionCost +
                                (taxable ? partnerSubscriptionCost * 0.08 : 0)
                            )}
                        </Text>
                    </View>
                </View>

                <View style={styles.checkoutContainer}>
                    <View style={styles.totalAmountContainer}>
                       
                    </View>
                    {/* Styled Checkout Button */}
                    <TouchableOpacity
                        style={styles.checkoutButton}
                        onPress={openPaymentSheet}
                        disabled={!loading}
                    >
                        <FontAwesome name="shopping-cart" size={24} color="white" />
                        <Text style={styles.checkoutButtonText}>Checkout</Text>
                    </TouchableOpacity>
                </View>
            </StripeProvider>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 70,
        marginTop: 15,
        paddingBottom: 20,
    },
    itemContainer: {
        flex: 1,
        marginBottom: 20,
    },
    summaryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    checkoutContainer: {
        borderTopColor: '#ddd',
        borderTopWidth: 1,
        padding: 10,
    },
    totalAmountContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    checkoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4CAF50',
        borderRadius: 25,
        padding: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    checkoutButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    info: {
        fontSize: 16,
    },
    invoiceContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        padding: 20,
    },
    invoiceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    invoiceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    descriptionLineContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: -10,
        marginBottom: 0,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        paddingTop: 5,
        paddingBottom: 15,
    },
    info: {
        fontSize: 13,
    },
    label: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    totalAmountContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        paddingTop: 10,
        paddingBottom: 15,
    },
});

export default PartnerSubscriptionCheckoutScreen;
