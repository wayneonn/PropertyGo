import {Alert, Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React, {useState, useEffect} from "react";
import ProfileImage from "../Partner/ProfileImage"
import {RatingComponent} from "../RatingStars";
import {dateFormatter} from "../../services/commonFunctions"
import axios from "axios";
import {BASE_URL} from "../../utils/documentApi";
import { MaterialIcons } from '@expo/vector-icons';

export const PartnerCardModal = ({modalVisible, setModalVisible, selectedItem, navigation}) => {
    const [status, setStatus] = useState(selectedItem?.transaction.status)

    useEffect(() => {
        console.log("Status updated.")
    }, [status]);

    // There needs to be additional functionality here that influences the chat.
    // Also maybe the notification module?
    const handleRequestPaid = async() => {
        try {
            const updatedTransactionData = { status: 'PAID' }; // New status
            const response = await axios.put(`${BASE_URL}/user/transactions/${selectedItem?.transaction.transactionId}`, updatedTransactionData);
            console.log('Transaction updated:', response.data);
            Alert.alert("Transaction changed from pending to paid.")
            setStatus("PAID")
        } catch (error) {
            console.error('Error updating transaction:', error);
            // Handle error (e.g., show an error message to the user)
            Alert.alert("Transaction error occurred.", error)
        }
    }

    const viewRequestDetails = async() => {
        setModalVisible(!modalVisible)
        navigation.navigate("View Request", {requestId: selectedItem?.transaction.requestId})
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(false);
            }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.propertyTitle}>{status}</Text>
                    <Text style={styles.propertyPrice}>{selectedItem?.transaction.onHoldBalance}</Text>
                    <Text style={styles.propertyPrice}>{selectedItem?.transaction.transactionItem}</Text>
                    <ProfileImage userDetails={selectedItem?.userDetails} navigation={navigation}
                                  setModalVisible={setModalVisible} modalVisible={modalVisible}/>
                    <Text style={styles.propertyPrice}>{selectedItem?.userDetails.userName}</Text>
                    <RatingComponent rating={selectedItem?.userDetails.rating}/>
                    <Text style={styles.propertyDetails}>Request ID: {selectedItem?.transaction.requestId}</Text>
                    <Text style={styles.propertyDetails}>{dateFormatter(selectedItem?.transaction.createdAt)}</Text>
                    <View style={styles.buttonContainer}>
                        {selectedItem?.transaction.status === "PENDING" && (
                            <TouchableOpacity
                                style={[styles.button, styles.buttonAccept, {flexDirection: "row", alignItems:"center"}]}
                                onPress={handleRequestPaid}
                            >
                                <MaterialIcons name="check-circle" size={24} color="white" />
                                <Text style={styles.textStyle}>  Mark Request as Done</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <TouchableOpacity
                        style={[styles.button, styles.buttonViewDetails, {flexDirection: "row", alignItems:"center"}]}
                        onPress={viewRequestDetails}
                    >
                        <MaterialIcons name="visibility" size={24} color="white" />
                        <Text style={styles.textStyle}>  View Request Details</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.buttonClose, {flexDirection: "row", alignItems:"center"}]}
                        onPress={() => setModalVisible(!modalVisible)}
                    >
                        <MaterialIcons name="close" size={24} color="white" />
                        <Text style={styles.textStyle}>  Hide</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>);
}

const styles = StyleSheet.create({
    // Modal and Container Styles
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for modal overlay
    },
    modalView: {
        width: '85%', // Set a relative width for the modal
        backgroundColor: "white",
        borderRadius: 20,
        padding: 25, // Increase padding for better spacing
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },

    // Text and Typography Styles
    propertyTitle: {
        fontSize: 18, // Increase font size for better visibility
        fontWeight: 'bold',
        marginBottom: 10, // Add bottom margin for spacing
    },
    propertyDetails: {
        fontSize: 14, // Standardize font size
        fontStyle: "italic",
        color: '#555', // Slightly darker color for better readability
        marginBottom: 8, // Consistent spacing
    },
    propertyPrice: {
        fontSize: 16,
        color: '#333', // Slightly darker for emphasis
        marginBottom: 8,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },

    // Button Styles
    button: {
        borderRadius: 20,
        paddingVertical: 10, // Increase vertical padding
        paddingHorizontal: 20, // Increase horizontal padding for a wider button
        elevation: 2,
        marginTop: 15, // Add top margin for spacing from the last text element
        width: 260
    },
    buttonContainer: {
        flexDirection: 'row', // Arrange buttons in a row
        justifyContent: 'space-evenly', // Even spacing between buttons
        width: '100%', // Full width to accommodate side-by-side buttons
    },

    buttonViewDetails: {
        backgroundColor: "#f0ad4e", // Different color for 'View Details' button
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    buttonAccept: {
        backgroundColor: "#519872",
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    card: {
        backgroundColor: '#fff',
        alignSelf: 'center', // Center the card
        justifyContent: 'center',
        alignItems: "center",
        flexDirection: "row",
        marginVertical: 5, // A little margin top and bottom for spacing between cards
        paddingTop: 10,
        borderRadius: 10,
        borderWidth: 0.5, // Light border
        borderColor: '#ddd', // Light gray color
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 7,
        marginLeft: 10,
    },
    sectionContainer: {
        padding: 10,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
        letterSpacing: 1,
    },
    rightIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    mainContentImage: {
        alignSelf: 'center',
        width: '90%',
        height: '15%',
    },

    profileHeader: {
        paddingHorizontal: 10,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 120,
        alignSelf: "center"
    },


    propertyListing: {
        flexDirection: 'row',
        marginBottom: 10,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    propertyImage: {
        width: 100,
        height: 100,
        marginRight: 10,
    },

    propertyDescription: {
        fontSize: 16,
        fontWeight: 'bold',
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleIcon: {
        marginRight: 10, // Add right margin for the icon
    },
    swiperImage: {
        width: '100%',
        height: '100%', // Adjust the height as needed
    },
    swiperContainer: {
        height: 130, // Set the desired height
        marginLeft: 15, // Add left padding
        marginRight: 15, // Add right padding
        alignSelf: 'center', // Center horizontally
    },
});