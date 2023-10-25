import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Alert, Linking, StyleSheet, TouchableOpacity } from 'react-native';
import { useStripe, StripeProvider } from '@stripe/stripe-react-native';
import { AuthContext } from '../../../AuthContext';
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
    const { transaction } = route.params; // Make sure you pass the selected package from the previous screen

    return (
        <View style={styles.container}>
            <StripeProvider publishableKey={publishableKey}>
                <View style={styles.headerContainer}>
                    {/* Back button */}
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.header}>Invoice</Text>
                    {/* Help icon */}
                </View>

                <View style={styles.itemContainer}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.label}>Item:</Text>
                        <Text style={styles.info}>{transaction.transactionItem}</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.label}>Quantity:</Text>
                        <Text style={styles.info}>{transaction.quantity}</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.label}>Price:</Text>
                        <Text style={styles.info}>SGD {transaction.paymentAmount.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.label}>GST (8%):</Text>
                        <Text style={styles.info}>SGD {(transaction.paymentAmount * 0.08).toFixed(2)}</Text>
                    </View>
                </View>

                <View style={styles.checkoutContainer}>
                    <View style={styles.totalAmountContainer}>
                        <Text style={styles.label}>Total Amount:</Text>
                        <Text style={styles.info}>SGD {(transaction.paymentAmount + transaction.paymentAmount * 0.08).toFixed(2)}</Text>
                    </View>
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
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 120,
        marginTop: 10,
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

export default PartnerSubscriptionCheckoutScreen;
