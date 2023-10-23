import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Alert, Linking, StyleSheet, TouchableOpacity } from 'react-native';
import { useStripe, StripeProvider } from '@stripe/stripe-react-native';
import { updateUserStripeCustomerId, initializePaymentSheet, createTokenTransactionRecord, fetchUpdatedUserDetails, handleDeepLink } from '../../services/StripeServices';
import { updateUserProfile } from '../../utils/api';
import { AuthContext } from '../../AuthContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome, Ionicons } from '@expo/vector-icons'; // Import the desired icon library
import { is } from 'date-fns/locale';

const TokenCheckoutScreen = ({ route }) => {
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

    // Use the route object to get the selected token package details
    const { tokens, tokenAmount, tokenName, currentTokenAmount } = route.params; // Make sure you pass the selected package from the previous screen

    const stripeCustomerId = user.user.stripeCustomerId;

    const initializePayment = async () => {
        await initializePaymentSheet(
            stripeCustomerId,
            user.user,
            `Purchase Tokens: ${tokenName}`,
            tokenAmount, 
            setStripeCustomerId,
            setEphemeralKey,
            setPaymentIntent,
            setPublishableKey,
            setCustIdExists,
            initPaymentSheet,
            setLoading,
            taxable = true,
        );
    };

    const handleSuccess = async () => {
        const updatedTokenAmount = currentTokenAmount + tokens;

        try {
            const formData = new FormData();
            formData.append('token', updatedTokenAmount);
            formData.append('email', user.user.email);

            const { success, data, message } = await updateUserProfile(user.user.userId, formData);

            if (success) {
                // Alert.alert('Purchase Successful', `You have purchased ${tokens} tokens.`);
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
                const transactionType = 'TOKEN_PURCHASE';

                // Calculate tax amount
                const taxAmount = tokenAmount * gst;

                // Calculate total amount including tax
                const totalAmount = tokenAmount + taxAmount;

                // Create a record for the token purchase transaction
                handleSuccess();
                createTokenTransactionRecord(user.user, paymentIntent, status, transactionType, tokenName, tokens, tokenAmount, gst);

                // Display the item, quantity, price, tax amount, and total amount
                Alert.alert('Purchase Successful', `You have purchased ${tokens} tokens.`);

                navigation.navigate('Token'); // Navigate back to the TokenScreen or any other desired screen
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

                <View style={styles.itemContainer}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.label}>Item:</Text>
                        <Text style={styles.info}>{tokenName}</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.label}>Quantity:</Text>
                        <Text style={styles.info}>{tokens}</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.label}>Price:</Text>
                        <Text style={styles.info}>SGD {tokenAmount.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.label}>GST (8%):</Text>
                        <Text style={styles.info}>SGD {(tokenAmount * 0.08).toFixed(2)}</Text>
                    </View>
                </View>

                <View style={styles.checkoutContainer}>
                    <View style={styles.totalAmountContainer}>
                        <Text style={styles.label}>Total Amount:</Text>
                        <Text style={styles.info}>SGD {(tokenAmount + tokenAmount * 0.08).toFixed(2)}</Text>
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
});

export default TokenCheckoutScreen;
