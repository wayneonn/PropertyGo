import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Button, Alert, Linking, Text } from 'react-native';
import { useStripe, StripeProvider } from '@stripe/stripe-react-native';
import { updateUserStripeCustomerId, initializePaymentSheet, createTransactionRecord, fetchUpdatedUserDetails, handleDeepLink } from "../../services/StripeServices";
import { AuthContext } from '../../AuthContext';
import { useNavigation } from '@react-navigation/native';

const PurchaseOptionFee = ({ route }) => {
    const { propertyListing } = route.params;
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

    return (
        <View>
            <StripeProvider
                publishableKey={publishableKey}
            >
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

export default PurchaseOptionFee;
