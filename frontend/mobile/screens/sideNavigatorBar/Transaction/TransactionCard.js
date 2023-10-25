import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';

const TransactionCard = ({ transaction, onPress }) => {
    console.log("transactionCard", transaction)
    const { transactionItem, createdAt, paymentAmount, gst } = transaction;
    const totalAmount = gst ? paymentAmount * 1.08 : paymentAmount;

    const transactionDate = new Date(createdAt);
    const localDate = transactionDate.toLocaleDateString();
    const localTime = transactionDate.toLocaleTimeString();

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            {transaction.transactionType === 'TOKEN_PURCHASE' ? (
                <View style={[styles.iconContainer]}>
                    <FontAwesome5 name="coins" size={24} color="black" />
                </View>
            ) : (
                <View style={styles.iconContainer}>
                    <FontAwesome5 name="file-invoice" size={24} color="black" />
                </View>
            )}

            <View style={styles.infoContainer}>
                <Text style={styles.transactionItem}>{transactionItem}</Text>
                <Text style={styles.dateTime}>
                    Date: {localDate} | Time: {localTime}
                </Text>
                {transaction.status === 'PENDING' ? (
                    <Text style={styles.totalAmount}>On Hold: SGD {transaction.onHoldBalance.toFixed(2)}</Text>
                ) : (
                    <Text style={styles.totalAmount}>Total Amount: SGD {totalAmount.toFixed(2)}</Text>
                )}
            </View>
        </TouchableOpacity>
    );
};


const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: '#fff',
        margin: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    iconContainer: {
        marginLeft: 10,
        marginRight: 26,
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
