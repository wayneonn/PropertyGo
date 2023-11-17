// This should be based off the Property Listing screen.
import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {BASE_URL} from "../../utils/documentApi";
import {useFocusEffect} from "@react-navigation/native";
import axios from "axios";
import { MaterialIcons } from '@expo/vector-icons';

// I should fix this first.
// What else do I need to do here?
// a. Navigate to here from the Chat Screen?
// b. Add in options to upload documents and transactions?
const SingleRequestScreen = ({ navigation, route }) => {
    const { requestId } = route.params;
    const [requestDetails, setRequestDetails] = useState(null);

    useEffect(() => {
        fetchRequestDetails(requestId);
    }, [requestId]);

    const useParentCallback = useCallback(() => {
        const fetchRequestDetails = async (id) => {
            try {
                // Replace with your API call to fetch request details
                const response = await fetch(`${BASE_URL}/request/${id}`);
                const data = await response.json();
                console.log(data)
                setRequestDetails(data);
            } catch (error) {
                console.error('Error fetching request details:', error);
            }
        };
        fetchRequestDetails(requestId);
    }, [])

    useFocusEffect(useParentCallback);

    const fetchRequestDetails = async (id) => {
        try {
            // Replace with your API call to fetch request details
            const response = await fetch(`${BASE_URL}/request/${id}`);
            const data = await response.json();
            setRequestDetails(data);
        } catch (error) {
            console.error('Error fetching request details:', error);
        }
    };

    if (!requestDetails) {
        return <Text>Loading...</Text>; // Or any loading indicator
    }

    const handleRequestPaid = async() => {
        try {
            const updatedTransactionData = { status: 'PAID', paymentAmount:requestDetails.transactions[0].onHoldBalance }; // New status
            const response = await axios.put(`${BASE_URL}/user/transactions/${requestDetails.transactions[0].transactionId}`, updatedTransactionData);
            console.log('Transaction updated:', response.data);
            Alert.alert("Transaction changed from pending to paid.");
            navigation.goBack();
        } catch (error) {
            console.error('Error updating transaction:', error);
            // Handle error (e.g., show an error message to the user)
            Alert.alert("Transaction error occurred.", error)
        }
    }

    const handleChatAccess = async() => {
        navigation.navigate("Message Partner", { chatId: requestDetails.chatId });
    }

    const handleDocumentUpload = async() => {
        navigation.navigate("Documents");
    }

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <View style={styles.detailCard}>
                <Text style={styles.title}>{requestDetails.jobTitle}</Text>
                <Text style={[styles.description, {fontSize: 14}]}>Request ID: {requestDetails.requestId} Transaction ID: {requestDetails.transactions[0].transactionId}</Text>
                <Text style={[styles.description, styles.descriptionStyle]}>Description:</Text>
                <Text style={styles.description}>{requestDetails.jobDescription}</Text>
                <Text style={styles.amount}>Amount: ${requestDetails.price}</Text>
                {/* Include more details as required */}
            </View>

            {/* Additional Actions */}
            <TouchableOpacity style={styles.actionButton} onPress={handleChatAccess}>
                <MaterialIcons name="contact-phone" size={24} color="black"/>
                <Text style={styles.actionText}>  Contact Client</Text>
            </TouchableOpacity>

            {/*Is there even a need for a handle document upload? */}
            <TouchableOpacity style={styles.actionButton} onPress={handleDocumentUpload}>
                <MaterialIcons name="file-upload" size={24} color="black" />
                <Text style={styles.actionText}>  Upload Documents</Text>
            </TouchableOpacity>

            {requestDetails.transactions[0].status.startsWith("PENDING") &&
                <TouchableOpacity style={[styles.actionButton, {backgroundColor: "#519872"}]} onPress={handleRequestPaid}>
                    <MaterialIcons name="check-circle" size={24} color="black" />
                    <Text style={styles.actionText}>  Mark Request as Done </Text>
                </TouchableOpacity>
            }
            {/* Add more actions as needed */}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 16,
    },
    detailCard: {
        backgroundColor: '#f9f9f9',
        padding: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        marginBottom: 10,
    },
    descriptionStyle: {
        fontStyle: "italic"
    },
    amount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    actionButton: {
        backgroundColor: '#FFD700',
        padding: 12,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent:'center',
        marginBottom: 10,
    },
    actionText: {
        color: 'black',
        fontWeight: 'bold',
    },
    // Add more styles as needed
});

export default SingleRequestScreen;
