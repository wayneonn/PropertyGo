// TokenCheckoutScreen.js
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, Alert, Linking } from 'react-native';
import { useStripe, StripeProvider } from '@stripe/stripe-react-native';
import { updateUserStripeCustomerId, initializePaymentSheet, createTokenTransactionRecord, fetchUpdatedUserDetails, handleDeepLink } from '../../services/StripeServices';
import { AuthContext } from '../../AuthContext';
import { useNavigation, useRoute } from '@react-navigation/native';

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

    // Use the route object to get the selected token package details
    const { tokens, tokenAmount, tokenName } = route.params; // Make sure you pass the selected package from the previous screen

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
            setLoading
        );
    };

    const handleSuccess = async () => {
        try {
            const formData = new FormData();
            formData.append('token', updatedTokenAmount);
            formData.append('email', user.user.email);
            console.log('user.user.userId', user.user.userId);
            console.log('formData', formData);
            const { success, data, message } = await updateUserProfile(user.user.userId, formData);

            if (success) {
                setTokenAmount(updatedTokenAmount);
                Alert.alert('Purchase Successful', `You have purchased ${tokens} tokens.`);
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
                const gst = true;

                // Create a record for the token purchase transaction
                createTokenTransactionRecord(user.user, paymentIntent, status, transactionType, tokenName, tokens, tokenAmount, gst);
                handleSuccess();
                Alert.alert('Success', `You have purchased ${tokens} tokens.`);
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
        <View>
            <StripeProvider publishableKey={publishableKey}>
                <Text style={{ fontSize: 20, marginVertical: 16 }}>
                    Purchase {tokenName} Tokens for SGD {tokenAmount}
                </Text>
                <Button
                    variant="primary"
                    disabled={!loading}
                    title="Checkout"
                    onPress={openPaymentSheet}
                />
            </StripeProvider>
        </View>
    );
};

export default TokenCheckoutScreen;
