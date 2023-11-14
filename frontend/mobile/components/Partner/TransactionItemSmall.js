import React from 'react';
import {TouchableOpacity, View, Text, Image, Dimensions, StyleSheet} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {dateFormatter, convertImage} from "../../services/commonFunctions"

const cardSize = Dimensions.get('window').width;
const TransactionItemSmall = ({ item, onPress}) => (
    <TouchableOpacity
        style={[styles.card, {width: cardSize * 0.92, height: cardSize * 0.25}]}
        onPress={onPress}
    >
        <View style={styles.profileHeader}>
            {item.userDetails.profileImage !== null ? (
                <Image
                    source={{uri: `data:image/jpeg;base64,${convertImage(item.userDetails.profileImage.data)}`}}
                    style={styles.profileImage}
                />
            ) : (
                <Image
                    source={require('../../assets/Default-Profile-Picture-Icon.png')} // Default image source
                    style={{width: 50, height: 50, borderRadius: 120}}
                />
            )}
        </View>
        <Text>&nbsp;&nbsp;&nbsp;&nbsp;</Text>
        <View style={styles.propertyDetails}>
            <Text style={[styles.propertyTitle, {color: item.transaction.status === "PAID" ? "green" : "red"}]}>
                {item.transaction.status}
            </Text>
            <Text style={[styles.propertyPrice, {color: "#353531"}]}>
                Total Amount: SGD {item.transaction.onHoldBalance}
            </Text>
            <Text style={styles.propertyPrice}>
                {item.userDetails.userName}
            </Text>
            <Text style={styles.propertyDetails}>
                {dateFormatter(item.transaction.createdAt)}
            </Text>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
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
    mainContentImage: {
        alignSelf: 'center',
        width: '90%',
        height: '15%',
    },
    propertyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
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
    propertyDetails: {
        fontStyle: "italic",
    },
    propertyDescription: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    propertyPrice: {
        fontSize: 14,
        color: '#888',
    },
    propertyArea: {
        fontSize: 14,
        color: '#888',
    },
    propertyRoomFeatures: {
        fontSize: 14,
        color: '#888',
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
    suggestionsContainer: {
        width: '80%', // Take up 80% width
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: 5,
        marginBottom: 10,
        alignSelf: 'center',
        elevation: 5, // Add elevation for shadow effect (Android)
        shadowColor: 'rgba(0, 0, 0, 0.2)', // Add shadow (iOS)
        shadowOffset: {width: 0, height: 2}, // Add shadow (iOS)
        shadowOpacity: 0.8, // Add shadow (iOS)
        shadowRadius: 2, // Add shadow (iOS)
    },
    suggestionBorder: {
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: 'white', // Match background color
        height: 10,
    },
    suggestionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    suggestionItemLast: {
        borderBottomWidth: 0, // Remove border for the last item
    },
    saveChangesButton: {
        backgroundColor: '#3498db',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center', // Center horizontally
        flexDirection: 'row',
        justifyContent: 'center', // Center vertically
        alignSelf: "center",
        width: '90%',
    },
    saveChangesButtonText: {
        color: 'white',
        marginLeft: 10,
    },
    suggestionText: {
        fontSize: 14, // Make text smaller
    },
    suggestionsOverlay: {
        position: 'absolute',
        top: 50, // Adjust the top position as needed
        left: 8,
        right: 0,
        zIndex: 1,
        width: '95%', // Take up 80% width
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: 5,
        marginBottom: 10,
        alignSelf: 'center',
        elevation: 5, // Add elevation for shadow effect (Android)
        shadowColor: 'rgba(0, 0, 0, 0.2)', // Add shadow (iOS)
        shadowOffset: {width: 0, height: 2}, // Add shadow (iOS)
        shadowOpacity: 0.8, // Add shadow (iOS)
        shadowRadius: 2, // Add shadow (iOS)
    },
    noResultsContainer: {
        alignItems: 'center',
        position: 'absolute',
        top: 50, // Adjust the top position as needed
        left: 8,
        right: 0,
        zIndex: 1,
        width: '95%', // Take up 80% width
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: 5,
        marginBottom: 10,
        alignSelf: 'center',
        elevation: 5, // Add elevation for shadow effect (Android)
        shadowColor: 'rgba(0, 0, 0, 0.2)', // Add shadow (iOS)
        shadowOffset: {width: 0, height: 2}, // Add shadow (iOS)
        shadowOpacity: 0.8, // Add shadow (iOS)
        shadowRadius: 2, // Add shadow (iOS)
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    noResultsText: {
        marginTop: 10,
        marginBottom: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },

});

export default TransactionItemSmall;
