// TransactionScreen.js

import React, { useEffect, useState, useContext } from 'react';
import { View, ScrollView, FlatList, StyleSheet, Text, ActivityIndicator } from 'react-native'; // Import ScrollView from 'react-native'
import TransactionCard from './TransactionCard'; // Import the TransactionCard component
import OptionTransactionCard from './CardComponents/OptionTransactionCard';
// import SellerOptionTransactionDetailOrder from './SellerOptionTransactionDetailOrder';
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
            setTransactions(data);
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
                    <View style={styles.headerContainer}>
                        <Text style={styles.header}>Transactions</Text>
                    </View>
                    {transactions && transactions.length > 0 ? (
                        <FlatList
                            data={transactions}
                            keyExtractor={(item) => item.transactionId.toString()}
                            renderItem={({ item }) =>
                                (item.transactionType === 'OPTION_FEE' || item.transactionType === 'OPTION_EXERCISE_FEE') ? (
                                    (item.userId === userId) ? (
                                        <OptionTransactionCard transaction={item} propertyId={item.propertyId} onPress={() => {
                                            navigation.navigate('Seller Option Transaction Order Screen', { transactionId: item.transactionId });
                                        }} />) : (
                                        <OptionTransactionCard transaction={item} propertyId={item.propertyId} onPress={() => {
                                            navigation.navigate('Option Transaction Order Screen', { transactionId: item.transactionId });
                                        }} />
                                    )
                                ) : (
                                    <TransactionCard transaction={item} onPress={() => {
                                        navigation.navigate('Transaction Screen', { transaction: item });
                                    }} />
                                )
                            }
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
        marginLeft: 100,
        marginTop: 10,
        paddingBottom: 20,
    },
    noAvailabilityText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
    },
    headerContainer: {
        marginBottom: 20,
    },
    header: {
        fontSize: 25,
        fontWeight: 'bold',
        marginTop: 5,
        textAlign: 'center',
    },
});

export default TransactionScreen;
