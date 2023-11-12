// TransactionScreen.js

import React, { useEffect, useState, useContext } from 'react';
import { View, ScrollView, FlatList, StyleSheet, Text, ActivityIndicator } from 'react-native'; // Import ScrollView from 'react-native'
import TransactionCard from './TransactionCard'; // Import the TransactionCard component
import { useFocusEffect } from "@react-navigation/native";
import { fetchUserTransactions } from '../../../utils/transactionApi';
import { AuthContext } from '../../../AuthContext';
import { useNavigation } from '@react-navigation/native';

const TransactionScreen = () => {
    const [transactions, setTransactions] = useState([]);
    const { user } = useContext(AuthContext);
    const navigation = useNavigation();
    const [isScreenLoaded, setIsScreenLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const userId = user.user.userId;

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500); // 3 seconds in milliseconds

        // Clear the timer when the component unmounts
        return () => clearTimeout(timer);
    }, []);

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
            const tokenTransactions = data.filter(transaction => transaction.transactionType === "TOKEN_PURCHASE");
            setTransactions(tokenTransactions);
            console.log("fetchUserTransactions data:", data); // Log the fetched data
        } else {
            setTransactions([]);
            console.error('Error fetching transaction data for user:', message);
        }
    };

    console.log("transactions:", transactions); // Log the transactions state

    return (
        <View style={styles.container}>
            {isLoading ? ( // Show loading screen while isLoading is true
                <View style={styles.loadingContainer}>
                    <ActivityIndicator style={styles.activityIndicator} size="large" color="#00adf5" />
                </View>
            ) : ( // Show the main screen when isLoading is false
            <ScrollView>
                <Text style={styles.header}>Token Transaction</Text>
                {transactions && transactions.length > 0 ? (
                    <FlatList
                        data={transactions}
                        keyExtractor={(item) => item.transactionId.toString()}
                        renderItem={({ item }) =>
                            <TransactionCard transaction={item} onPress={() => {
                                navigation.navigate('Transaction Screen', { transaction: item });
                            }} />}
                    />
                ) : (
                    <Text style={styles.noAvailabilityText}>No transactions found.</Text>
                )}
            </ScrollView> 
            )}
        </View>
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
        marginLeft: 80,
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
