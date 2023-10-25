import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const TransactionCard = ({ transaction, onPress }) => {
    console.log("transactionCard", transaction)
    const { transactionItem, createdAt, paymentAmount, gst } = transaction;
    const totalAmount = gst ? paymentAmount * 1.08 : paymentAmount;

    const transactionDate = new Date(createdAt);
    const localDate = transactionDate.toLocaleDateString();
    const localTime = transactionDate.toLocaleTimeString();

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.iconContainer}>
                <FontAwesome name="shopping-cart" size={24} color="black" />
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.transactionItem}>{transactionItem}</Text>
                <Text style={styles.dateTime}>
                    Date: {localDate} | Time: {localTime}
                </Text>
                <Text style={styles.totalAmount}>Total Amount: SGD {totalAmount.toFixed(2)}</Text>
            </View>
        </TouchableOpacity>
    );
};


const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2, // Increased shadow opacity for a stronger effect
        shadowRadius: 4, // Increased shadow radius for a stronger effect
        width: '95%', // Adjust the card width to fit 85% of the screen
        alignSelf: 'center', // Center the card horizontally
        elevation: 4, // Android elevation for a shadow effect
    },
    iconContainer: {
        marginRight: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoContainer: {
        flex: 1,
    },
    transactionItem: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    dateTime: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 8,
    },
    totalAmount: {
        fontSize: 16,
    },
});

export default TransactionCard;
