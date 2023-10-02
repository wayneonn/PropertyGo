import React, { useContext, useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import TokenCard from './TokenCard'; // Import your TokenCard component
import { AuthContext } from '../../AuthContext';
import { getUserById, updateUserProfile } from '../../utils/api';

const TokenScreen = ({ navigation }) => {
    const { user, login } = useContext(AuthContext);

    // State to hold user data and token amount
    const [userData, setUserData] = useState(null);
    const [tokenAmount, setTokenAmount] = useState(0);

    // Fetch user data by userId
    const fetchUserData = async (userId) => {
        try {
            const { success, data, message } = await getUserById(userId);

            if (success) {
                setUserData(data);
                setTokenAmount(data.token || 0);
            } else {
                console.error('Error fetching user:', message);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    useEffect(() => {
        if (user && user.user) {
            fetchUserData(user.user.userId);
        }
    }, [user]);

    const tokenData = [
        { tokenName: '5 Tokens', tokenPrice: 1.0, tokenAmount: 5.0, tokens: 5 },
        { tokenName: '10 Tokens', tokenPrice: 1.0, tokenAmount: 10.0, tokens: 10 },
        { tokenName: '20 Tokens', tokenPrice: 1.0, tokenAmount: 20.0, tokens: 20 },
        { tokenName: '50 Tokens', tokenPrice: 1.0, tokenAmount: 50.0, tokens: 50 },
        { tokenName: '100 Tokens', tokenPrice: 1.0, tokenAmount: 100.0, tokens: 100 },
        { tokenName: '200 Tokens', tokenPrice: 1.0, tokenAmount: 200.0, tokens: 200 },
        // Add more token data as needed
    ];

    const handleBuyToken = (tokens) => {
        // Implement your buy token logic here
        // For example, you can show an alert to confirm the purchase
        Alert.alert(
            'Confirm Purchase',
            `Do you want to purchase ${tokens} tokens for SGD ${tokens}?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Purchase',
                    onPress: async () => {
                        // Update the user's token amount and save it to the API
                        const updatedTokenAmount = tokenAmount + tokens;

                        try {
                            const formData = new FormData();
                            formData.append('token', updatedTokenAmount);
                            formData.append('email', user.user.email);
                            console.log('user.user.userId', user.user.userId);
                            console.log('formData', formData);
                            const { success, data, message } = await updateUserProfile(user.user.userId, formData);

                            if (success) {
                                setTokenAmount(updatedTokenAmount);
                                Alert.alert('Purchase Successful', `You have purchased ${tokens} tokens.`);
                            } else {
                                Alert.alert('Error', message || 'Purchase failed.');
                            }
                        } catch (error) {
                            console.error('Error updating user profile:', error);
                            Alert.alert('Error', 'Purchase failed.');
                        }
                    },
                },
            ]
        );
    };

    return (
        <ScrollView>
            <Text style={styles.screenTitle}>Add Token</Text>
            <Text style={styles.tokenAmountText}>{`Token Amount: ${tokenAmount}`}</Text>
            {tokenData.map((token, index) => (
                <TokenCard
                    key={index}
                    tokenData={token}
                    onPressBuy={() => handleBuyToken(token.tokens)}
                />
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 16,
    },
    tokenAmountText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 16,
    },
});

export default TokenScreen;
