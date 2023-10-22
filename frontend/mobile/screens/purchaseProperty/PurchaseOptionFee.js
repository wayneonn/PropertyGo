import React, { useState, useEffect, useCallback } from 'react';
import { View, Button, Alert, Linking } from 'react-native';
import { useStripe, StripeProvider } from '@stripe/stripe-react-native';
import { paymentSheet } from "../../utils/stripeApi"; // Import your new paymentSheet function

const PurchaseOptionFee = ({ route }) => {
    const { propertyListing } = route.params;
    const { initPaymentSheet, presentPaymentSheet, handleURLCallback } = useStripe();
    const [loading, setLoading] = useState(false);
    const [customer, setCustomer] = useState('');
    const [ephemeralKey, setEphemeralKey] = useState('');
    const [paymentIntent, setPaymentIntent] = useState('');
    const [publishableKey, setPublishableKey] = useState('');

    const userId = 1; // Replace with your user's ID
    const amount = 1099; // Replace with the desired amount
    const currency = 'sgd'; // Replace with the desired currency code

    const initializePaymentSheet = async () => {
        try {
            // Use the paymentSheet function to fetch payment parameters
            const { data, success, message } = await paymentSheet({
                // userId,
                amount,
                currency,
            });

            console.log("Data:", data, " success: ", success);

            if (!success) {
                console.error('Error fetching payment sheet data:', message);
                // Handle the error as needed (e.g., show an error message to the user)
                return;
            }

            setCustomer(data.customer);
            setEphemeralKey(data.ephemeralKey);
            setPaymentIntent(data.paymentIntent);
            setPublishableKey(data.publishableKey);


            console.log("Data:", data, " success: ", success);
            const { error } = await initPaymentSheet({
                merchantDisplayName: 'PropertyGo, Pte. Ltd.',
                customerId: data.customer,
                customerEphemeralKeySecret: data.ephemeralKey,
                paymentIntentClientSecret: data.paymentIntent,
                // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
                // methods that complete payment after a delay, like SEPA Debit and Sofort.
                allowsDelayedPaymentMethods: true,
                defaultBillingDetails: {
                    name: 'Jane Doe',
                },
            });

            if (!error) {
                setLoading(true);
            } else {
                console.error('Error initializing payment sheet:', error);
                throw error;
            }
        } catch (error) {
            console.error('Error setting up payment sheet:', error);
        }
    };

    const openPaymentSheet = async () => {
        try {
            const { error } = await presentPaymentSheet();

            if (error) {
                Alert.alert(`Error code: ${error.code}`, error.message);
            } else {
                Alert.alert('Success', 'Your order is confirmed!');
            }
        } catch (error) {
            console.error('Error opening payment sheet:', error);
        }
    };

    // Handle deep linking for Stripe
    const handleDeepLink = useCallback(async (url) => {
        if (url) {
            const stripeHandled = await handleURLCallback(url);
            if (stripeHandled) {
                // This was a Stripe URL - you can return or add extra handling here as you see fit
            } else {
                // This was NOT a Stripe URL – handle as you normally would
            }
        }
    }, [handleURLCallback]);

    useEffect(() => {
        initializePaymentSheet();

        // Handle deep linking
        const getUrlAsync = async () => {
            const initialUrl = await Linking.getInitialURL();
            handleDeepLink(initialUrl);
        };

        getUrlAsync();

        const deepLinkListener = Linking.addEventListener('url', (event) => {
            handleDeepLink(event.url);
        });

        return () => deepLinkListener.remove();
    }, [handleDeepLink]);

    return (
        <View>
            <StripeProvider
                publishableKey={publishableKey}
                // merchantIdentifier="merchant.identifier" // required for Apple Pay
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
