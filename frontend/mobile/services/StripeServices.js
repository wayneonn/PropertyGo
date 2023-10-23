// StripeServices.js
import React, { useContext } from 'react';
import { useStripe } from '@stripe/stripe-react-native';
import { paymentSheet } from "../utils/stripeApi";
import { updateUserProfile, loginUser } from "../utils/api";
import { createTransaction } from "../utils/transactionApi";
import { AuthContext } from '../AuthContext';

export const initializePaymentSheet = async (
    stripeCustomerId,
    user,
    description,
    amount,
    setStripeCustomerId,
    setEphemeralKey,
    setPaymentIntent,
    setPublishableKey,
    setCustIdExists,
    initPaymentSheet, // Pass initPaymentSheet as a parameter
    setLoading,
    isAService,
) => {
    try {
        // Use the paymentSheet function to fetch payment parameters
        console.log("stripeCustomerId: ", stripeCustomerId);
        if (stripeCustomerId !== null) {
            setCustIdExists(true);
        }

        const currency = 'sgd'; // Replace with the desired currency code

        const { data, success, message } = await paymentSheet({
            stripeCustomerId,
            amount: amount * 100,
            currency,
            email: user.email,
            name: user.name,
            description,
            isAService,
        });

        console.log("Data:", data, " success: ", success);

        if (!success) {
            console.error('Error fetching payment sheet data:', message);
            // Handle the error as needed (e.g., show an error message to the user)
            return;
        }

        if (stripeCustomerId === null) {
            setStripeCustomerId(data.customer);
        }
        setEphemeralKey(data.ephemeralKey);
        setPaymentIntent(data.paymentIntent);
        setPublishableKey(data.publishableKey);

        console.log("Data at StripeServices:", data, " success: ", success);
        const { error } = await initPaymentSheet({
            merchantDisplayName: 'PropertyGo, Pte. Ltd.',
            customerId: data.customer,
            customerEphemeralKeySecret: data.ephemeralKey,
            paymentIntentClientSecret: data.paymentIntent,
            allowsDelayedPaymentMethods: true,
            defaultBillingDetails: {
                name: user.name,
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


export const updateUserStripeCustomerId = async (stripeCustomerId, user, login) => {
    const formData = new FormData();
    console.log("stripeCustomerId: ", stripeCustomerId);
    formData.append('stripeCustomerId', stripeCustomerId);
    formData.append('email', user.email);
    formData.append('countryOfOrigin', user.countryOfOrigin);
    formData.append('dateOfBirth', user.dateOfBirth);

    const { success, data, message } = await updateUserProfile(user.userId, formData);
    console.log("updateUserStripeCustomerId success: ", success, " data: ", data, " message: ", message);
    fetchUpdatedUserDetails(user, login);
};

export const createTransactionRecord = async (propertyListing, user, paymentIntent, status, transactionType) => {
    const { data, success, message } = await createTransaction({
        onHoldBalance: propertyListing.optionFee,
        buyerId: user.userId,
        propertyId: propertyListing.propertyListingId,
        stripePaymentResponse: paymentIntent,
        invoiceId: 3,
        status,
        transactionType,
    });
    //  console.log("createTransactionRecord - success: ", success, " data: ", data, " message: ", message);
};

export const createTokenTransactionRecord = async (user, paymentIntent, status, transactionType, tokenName, tokens, tokenAmount, gst) => {
    const { data, success, message } = await createTransaction({
        buyerId: user.userId,
        transactionItem: tokenName,
        paymentAmount: tokenAmount,
        quantity: tokens,
        gst,
        stripePaymentResponse: paymentIntent,
        invoiceId: 3,
        status,
        transactionType,
    });
    //  console.log("createTransactionRecord - success: ", success, " data: ", data, " message: ", message);
};

export const fetchUpdatedUserDetails = async (user, login) => {
    console.log("fetchUpdatedUserDetails user: ", user);
    try {
        const { success, data, message } = await loginUser(user.userName, user.password);

        if (success) {
            console.log("success!: ");
            login(data);
        } else {
            Alert.alert('Error', message);
        }
    } catch (error) {
        console.error('Error fetching updated user details:', error);
    }
};

export const handleDeepLink = async (url, handleURLCallback) => {
    if (url) {
        const stripeHandled = await handleURLCallback(url);
        if (stripeHandled) {
            // This was a Stripe URL - you can return or add extra handling here as you see fit
        } else {
            // This was NOT a Stripe URL – handle as you normally would
        }
    }
};
