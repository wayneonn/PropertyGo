import React, { useContext, useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import TokenCard from './TokenCard'; // Import your TokenCard component
import { AuthContext } from '../../AuthContext';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { getUserById, updateUserProfile } from '../../utils/api';
import {useFocusEffect} from "@react-navigation/native";

const TokenScreen = ({ navigation }) => {
    const { user, login } = useContext(AuthContext);

    // State to hold user data and token amount
    const [userData, setUserData] = useState(null);
    const [tokenAmount, setTokenAmount] = useState(0);
    const [isHelpVisible, setHelpVisible] = useState(false);

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

    useFocusEffect(
        React.useCallback(() => {
            console.log('Home page gained focus');
            if (user && user.user) {
                fetchUserData(user.user.userId);
            }
        }, [])
    );

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

    const toggleHelpOverlay = () => {
        setHelpVisible(!isHelpVisible);
    };

    return (
        <ScrollView>
            <View style={styles.headerContainer}>
                {/* Back button */}
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.header}>Add Token</Text>
                {/* Help icon */}
                <TouchableOpacity style={styles.helpIcon} onPress={toggleHelpOverlay}>
                    <Ionicons name="help-circle-outline" size={26} color="black" />
                </TouchableOpacity>
            </View>

            <Text style={styles.tokenAmountText}>{"Your Token Amount: "}
                <Text style = {styles.bold}>{`${tokenAmount}`}{" "}</Text><FontAwesome5 name="coins" size={20} color="black"/>
            </Text>
            {tokenData.map((token, index) => (
                <TokenCard
                    key={index}
                    tokenData={token}
                    onPressBuy={() => handleBuyToken(token.tokens)}
                />
            ))}
            {/* Help Overlay */}
            <Modal
                visible={isHelpVisible}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modal}>
                    <ScrollView style={{ maxHeight: 600 }}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalHeaderText}>Help</Text>
                            <TouchableOpacity onPress={toggleHelpOverlay}>
                                <Ionicons name="close-circle" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.helpText}>
                            {"\nWelcome to the 'Add Tokens' page, your gateway to supercharging your listings and getting the exposure they deserve. 🚀"}
                            <Text style={styles.sectionDescription}>{"\n\nWhy Add Tokens?"}</Text>
                            {"\n\nTokens are your ticket to success in the world of online listings. By adding tokens to your account, you gain the power to boost your listings, increase visibility, and connect with more potential buyers or renters. Here's what you can achieve:"}
                            <Text style={styles.headerDescription}>{"\n\n🔥 Stand Out: "}</Text>{"When you add tokens to your account, you can use them to give your listings that extra edge. Stand out from the crowd with premium placement and eye-catching features."}
                            <Text style={styles.headerDescription}>{"\n\n🏆 Top Placement: "}</Text>{"Boosted listings are prioritized and displayed prominently at the top of search results, ensuring that your property gets maximum exposure."}
                            <Text style={styles.headerDescription}>{"\n\n💡 Highlight Your Listings: "}</Text>{"Tokens allow you to apply attention-grabbing features like flashy icons to your listings. These visual cues instantly communicate the unique value your property offers."}
                            <Text style={styles.headerDescription}>{"\n\n🌐 Reach a Wider Audience: "}</Text>{"Boosted listings attract more views and inquiries. With tokens, you can tap into a broader audience of potential buyers or renters, increasing your chances of closing deals faster."}
                            <Text style={styles.headerDescription}>{"\n\n💰 Maximize Your Returns: "}</Text>{"In today's competitive market, visibility is key. Adding tokens to your account is an investment in your success. The more visible your listings are, the faster you can secure transactions and maximize your earnings."}
                            <Text style={styles.sectionDescription}>{"\n\nHow to Add Tokens"}</Text>
                            {"\n\nAdding tokens is quick and easy:"}
                            <Text style={styles.headerDescription}>{"\n\n1. Choose Your Package: "}</Text>{"Select from a range of token packages to suit your needs and budget."}
                            <Text style={styles.headerDescription}>{"\n\n2. Secure Payment: "}</Text>{"Our secure payment gateway ensures your transactions are safe and hassle-free."}
                            <Text style={styles.headerDescription}>{"\n\n3. Boost Your Listings: "}</Text>{"Once your tokens are added, you can start boosting your listings right away. Customize your listings with eye-catching features and watch the magic happen!"}
                            <Text style={styles.sectionDescription}>{"\n\nTrack Your Tokens "}</Text>
                            {"\n\nKeep an eye on your token balance within your account. You can track your token usage and see the impact they're making on your listings."}
                            {"\n\nReady to take your listings to the next level? Start by adding tokens to your account today and experience the difference. Get ready for more inquiries, more interest, and more success!"}
                            {"\n\nInvest in your listings. Add tokens now and electrify your journey at PropertyGo!⚡✨"}
                        </Text>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
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
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 130,
        marginTop: 15,
    },
    backButton: {
        position: 'absolute',
        top: 16, // Adjust the top position as needed
        left: 16, // Adjust the left position as needed
        zIndex: 1, // Place it above the swiper
      },
      helpIcon: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 1,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    
    modal: {
        backgroundColor: 'white',
        width: '90%',
        borderRadius: 10,
        padding: 20,
    },
    
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    
    modalHeaderText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    helpText: {
        fontSize: 16,
        marginBottom: 20,
    },
    sectionDescription: {
        fontSize: 22,
        fontWeight: 'bold',
        marginHorizontal: 20,
        marginBottom: 16,
    },
    headerDescription: {
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 20,
        marginBottom: 16,
    },
    bold: {
        fontWeight: 'bold',
    },
});

export default TokenScreen;
