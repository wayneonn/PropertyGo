// TransactionScreen.js

import React, { useEffect, useState, useContext } from 'react';
import { View, ScrollView, FlatList, StyleSheet, Text } from 'react-native'; // Import ScrollView from 'react-native'
import TransactionCard from './TransactionCard'; // Import the TransactionCard component
import {useFocusEffect} from "@react-navigation/native";
import { fetchUserTransactions } from '../../../utils/transactionApi';
import { AuthContext } from '../../../AuthContext';

const TransactionScreen = () => {
    const [transactions, setTransactions] = useState([]);
    const { user } = useContext(AuthContext);
    const userId = user.user.userId;

    useEffect(() => {
        // Fetch user transactions when the component mounts
        getUserTransactions();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            console.log('Transaction page gained focus');
            getUserTransactions();
        }, [])
    );

    const getUserTransactions = async () => {
        const { success, data, message } = await fetchUserTransactions(
            userId
        );

        if (success) {
            setTransactions(data);
            console.log("fetchUserTransactions data:", data); // Log the fetched data
        } else {
            setTransactions([]);
            console.error('Error fetching transaction data for user:', message);
        }
    };

    console.log("transactions:", transactions); // Log the transactions state

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Transactions</Text>
            {transactions && transactions.length > 0 ? (
                <FlatList
                    data={transactions}
                    keyExtractor={(item) => item.transactionId.toString()}
                    renderItem={({ item }) => <TransactionCard transaction={item} />}
                />
            ) : (
                <Text style={styles.noAvailabilityText}>No transactions found.</Text>
            )}
        </ScrollView> // Wrap your content with ScrollView
    );

};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 100,
        marginTop: 10,
        paddingBottom: 20,
    },
    noAvailabilityText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
    },
});

export default TransactionScreen;
