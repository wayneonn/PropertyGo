import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Button, Alert, Linking, Text } from 'react-native';
import { useStripe, StripeProvider } from '@stripe/stripe-react-native';
import { paymentSheet } from "../../utils/stripeApi"; // Import your new paymentSheet function
import { updateUserProfile, loginUser } from "../../utils/api";
import { AuthContext } from '../../AuthContext';
const PurchaseOptionFee = ({ route }) => {
    const { propertyListing } = route.params;
    const { user, login } = useContext(AuthContext);
    const { initPaymentSheet, presentPaymentSheet, handleURLCallback } = useStripe();
    const [loading, setLoading] = useState(false);
    const [newStripeCustomerId, setStripeCustomerId] = useState('');
    const [ephemeralKey, setEphemeralKey] = useState('');
    const [paymentIntent, setPaymentIntent] = useState('');
    const [publishableKey, setPublishableKey] = useState('');
    const [custIdExists, setCustIdExists] = useState(false);
    const [completedPaymentIntent, setCompletedPaymentIntent] = useState(null);
    const stripeCustomerId = user.user.stripeCustomerId;
    const amount = 1099; // Replace with the desired amount
    const currency = 'sgd'; // Replace with the desired currency code

    const initializePaymentSheet = async () => {
        try {
            // Use the paymentSheet function to fetch payment parameters
            console.log("stripeCustomerId: ", stripeCustomerId);
            if (stripeCustomerId !== null) {
                setCustIdExists(true);
            }

            const { data, success, message } = await paymentSheet({
                stripeCustomerId,
                amount,
                currency,
                email: user.user.email,
                name: user.user.name,
                description: "Purchase Option Fee",
                isAService: true,
            });

            console.log("Data:", data, " success: ", success);

            if (!success) {
                console.error('Error fetching payment sheet data:', message);
                // Handle the error as needed (e.g., show an error message to the user)
                return;
            }

            if (custIdExists === false) {
                setStripeCustomerId(data.customer);
            }
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
                if (custIdExists == false) {
                    updateUserStripeCustomerId(newStripeCustomerId);
                }
                Alert.alert('Success', 'Your order is confirmed!');
            }
        } catch (error) {
            console.error('Error opening payment sheet:', error);
        }
    };

    const updateUserStripeCustomerId = async (stripeCustomerId) => {
        const formData = new FormData();
        console.log("stripeCustomerId: ", stripeCustomerId);
        formData.append('stripeCustomerId', stripeCustomerId);
        formData.append('email', user.user.email);
        formData.append('countryOfOrigin', user.user.countryOfOrigin);
        formData.append('dateOfBirth', user.user.dateOfBirth);

        const { success, data, message } = await updateUserProfile(user.user.userId, formData);
        console.log("success: ", success, " data: ", data, " message: ", message);
        fetchUpdatedUserDetails();
    }

    const fetchUpdatedUserDetails = async () => {
        try {
            const { success, data, message } = await loginUser(user.user.userName, user.user.password);

            if (success) {
                login(data);
            } else {
                Alert.alert('Error', message);
            }
        } catch (error) {
            console.error('Error fetching updated user details:', error);
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
            //merchantIdentifier="merchant.identifier" // required for Apple Pay
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
