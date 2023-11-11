import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Alert, Linking, StyleSheet, TouchableOpacity } from 'react-native';
import { useStripe, StripeProvider } from '@stripe/stripe-react-native';
import { updateUserStripeCustomerId, initializePaymentSheet, createTransactionRecord, fetchUpdatedUserDetails, handleDeepLink } from '../../services/StripeServices';
import { updateUserProfile } from '../../utils/api';
import { AuthContext } from '../../AuthContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome, Ionicons } from '@expo/vector-icons'; // Import the desired icon library
import { is } from 'date-fns/locale';

const PurchaseOptionFee = ({ route }) => {
    const { propertyListing, quantity } = route.params;
    const navigation = useNavigation();
    const { user, login } = useContext(AuthContext);
    const { initPaymentSheet, presentPaymentSheet, handleURLCallback } = useStripe();
    const [loading, setLoading] = useState(false);
    const [newStripeCustomerId, setStripeCustomerId] = useState('');
    const [ephemeralKey, setEphemeralKey] = useState('');
    const [paymentIntent, setPaymentIntent] = useState('');
    const [publishableKey, setPublishableKey] = useState('');
    const [custIdExists, setCustIdExists] = useState(false);
    const stripeCustomerId = user.user.stripeCustomerId;
    const description = "Purchase Option Fee";
    const amount = propertyListing.optionFee;
    const taxable = false;

    const initializePayment = async () => {
        // console.log("amount at purchaseOptionFee: ", amount);
        // await initializePaymentSheet(stripeCustomerId, user.user, description, amount, setStripeCustomerId, setEphemeralKey, setPaymentIntent, setPublishableKey, setCustIdExists, initPaymentSheet, setLoading, isAService);
        await initializePaymentSheet(
            stripeCustomerId,
            user.user,
            description,
            amount, 
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

    const openPaymentSheet = async () => {
        try {
            const { error } = await presentPaymentSheet();

            if (error) {
                Alert.alert(`Error code: ${error.code}`, error.message);
            } else {
                if (custIdExists == false) {
                    updateUserStripeCustomerId(newStripeCustomerId, user.user, login);
                }
                const status = "PENDING"
                const transactionType = "OPTION_FEE"
                const gst = false;
                const paymentAmount = 0; //As payment is still processing
                createTransactionRecord(propertyListing, user.user, paymentIntent, status, transactionType, description, 1, paymentAmount, gst);
                Alert.alert('Success', 'Your order is confirmed!');
                navigation.navigate('Home Page');
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
                        <Text style={styles.info}>{formatCurrency(amount)}</Text>
                    </View>
                    <View style={(styles.invoiceItem)}>
                        <Text style={styles.info}></Text>
                        <Text style={styles.info}></Text>
                        <Text style={(styles.label)}>Subtotal:</Text>
                        <Text style={styles.info}>
                            {formatCurrency(amount)}
                        </Text>
                    </View>

                    <View style={(styles.invoiceItem)}>
                        <Text style={styles.info}></Text>
                        <Text style={styles.info}></Text>
                        <Text style={(styles.label)}>GST (8%):</Text>
                        <Text style={styles.info}>
                            {formatCurrency((taxable ? amount * 0.08 : 0))}
                        </Text>
                    </View>
                    <View style={styles.totalAmountContainer}>
                        <Text style={styles.label}>Total Amount:</Text>
                        <Text style={styles.info}>
                            {formatCurrency(
                                amount +
                                (taxable ? amount * 0.08 : 0)
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

export default PurchaseOptionFee;
