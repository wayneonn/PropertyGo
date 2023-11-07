import React, { useContext, useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert, Button } from 'react-native';
import { updateUserStripeCustomerId, initializePaymentSheet, createTransactionRecord, fetchUpdatedUserDetails, handleDeepLink } from '../../services/StripeServices';
import { AuthContext } from '../../AuthContext';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const PurchaseOptionFeeInfo = ({ route }) => {
    const { user } = useContext(AuthContext);
    const { propertyListing } = route.params;
    const navigation = useNavigation();
    const description = "Purchase Option Fee";

    const handleSubmit = () => {
        Alert.alert(
            'Confirm Request',
            'Are you sure you want to place a request for this property?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'Confirm', onPress: createTransaction },
            ],
            { cancelable: false }
        );
    }

    const createTransaction = async () => {
        const status = "PENDING"
        const transactionType = "OPTION_FEE"
        const gst = false;
        const paymentAmount = 0; //As payment is still processing
        const transaction = await createTransactionRecord(propertyListing, user.user, status, transactionType, description, 1, paymentAmount, gst);
        Alert.alert('Success', 'Your request is confirmed!');
        console.log("transaction: ", transaction);
        navigation.navigate('Option Transaction Order Screen', { transactionId: transaction.transactionId });
    }

    return (
        <ScrollView>
            <View style={styles.headerContainer}>
                {/* Back button */}
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.header}>Option Fee Process</Text>
            </View>


            <Text style={styles.headerTwo}>Process on Purchasing a Property with PropertyGo 😁🏠</Text>
            <Text style={styles.headerDescription}>Step 1: Payment of Option Fee via Stripe</Text>
            <Text style={styles.description}>1. Upon finding a property of interest, the buyer will initiate the property purchasing process by making a payment for the Option Fee via the provided Stripe payment gateway. This fee is required to secure the property and holds it for the buyer's consideration.</Text>
            <Text style={styles.description}>2. The paid amount will be placed on hold for a period of 3 days. During this time, the seller will be notified of the payment and given the opportunity to respond.</Text>
            <Text style={styles.description}>3. If the seller does not respond within the specified time frame, the Option Fee will be automatically refunded back to the buyer.</Text>
            <Text style={styles.headerDescription}>Step 2: Notification of Seller's Response</Text>
            <Text style={styles.description}>1. Once the seller responds by uploading the Option To Purchase document, the buyer will receive a notification informing them of the seller's action.</Text>
            <Text style={styles.description}>2. The buyer should review and sign the document as required.</Text>
            <Text style={styles.headerDescription}>Step 3: Admin Signature</Text>
            <Text style={styles.description}>1. After the buyer signs the document, it will be forwarded to the admin for their signature as a witness to the transaction.</Text>
            <Text style={styles.headerDescription}>Step 4: Setting the Option to Purchase Deadline</Text>
            <Text style={styles.description}>1. The seller will also specify an Option to Purchase deadline within the application. The buyer must sign the document before this deadline.</Text>
            <Text style={styles.headerDescription}>Step 5: Exercising the Purchase</Text>
            <Text style={styles.description}>1. If the buyer decides to proceed with the purchase, they will pay the Option Exercise Fee as specified by the seller. Otherwise if it's past the OTP Deadline, the property listing's status will be changed from 'ON HOLD' to 'ACTIVE' again, where the property will be available for other potential buyers to purchase again.</Text>
            <Text style={styles.description}>2. Subsequently, the buyer and seller can continue the transaction process, including arranging the down payment and housing financing through the Platform's chat.</Text>
            <Text></Text>
            {/* Button to proceed to checkout */}
            <TouchableOpacity style={styles.checkoutButton} onPress={handleSubmit}>
                <Text style={styles.checkoutButtonText}>Proceed To Request</Text>
                </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 95,
        marginTop: 55,
    },
    headerTwo: {
        marginLeft: 25,
        marginRight: 25,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 30,
        marginTop: 10,
    },
    backButton: {
        position: 'absolute',
        top: 55,
        left: 16,
        zIndex: 1,
    },
    description: {
        fontSize: 13,
        marginRight: 20,
        marginLeft: 25,
        marginBottom: 16,
        letterSpacing: 0.4,
    },
    bold: {
        fontWeight: 'bold',
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
        width: 300,
        alignSelf  : 'center',
        marginBottom: 50,
    },
    checkoutButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    headerDescription: {
        fontSize: 13,
        fontWeight: 'bold',
        marginHorizontal: 20,
        marginBottom: 16,
    },
    description: {
        fontSize: 13,
        marginRight: 20,
        marginLeft: 25,
        marginBottom: 16,
        letterSpacing: 0.4,
    },
});

export default PurchaseOptionFeeInfo;
