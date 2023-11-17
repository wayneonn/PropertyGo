import {StyleSheet, Text, useWindowDimensions, View} from "react-native";
import HTML from "react-native-render-html";
import {getTimeAgo} from "../../services/CalculateTimeAgo";
import React, {useContext} from "react";
import {AuthContext} from "../../AuthContext";

function MessagePlain({item}) {
    const {user} = useContext(AuthContext);
    const windowWidth = useWindowDimensions().width;

    return (<View
        style={item.userId === user.user.userId ? styles.sentMessage : styles.receivedMessage}>
        <Text style={styles.messageText}><HTML
            source={{html: item.messageText.replace(/<\/?p>/g, '').replace(/<html>|<\/html>/g, '')}}
            contentWidth={windowWidth}/></Text>
        <Text style={styles.time}>{getTimeAgo(item.createdAt)}</Text>
    </View>)
}

const styles = StyleSheet.create({
    keyboardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white', // Set background color
        // padding: 10, // Add padding to the container
        // borderRadius: 10, // Add border radius for rounded corners
        // marginHorizontal: 10,
        // borderWidth: 1,
        // marginBottom: 15,
    },
    PropertyItemContainer: {
        backgroundColor: 'white',
        // borderRadius: 5,
        // marginHorizontal: 10,
        // marginVertical: 5,
        borderBottomWidth: 0.5,
        paddingVertical: 10,
        borderColor: "#ccc"
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // borderWidth: 1,
        paddingHorizontal: 14
    },
    detailContainer: {
        flex: 1, // Allow the message container to take up available space
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    title: {
        fontSize: 16,
        // marginLeft: 15,
        marginRight: 5,
        fontWeight: 'bold',
    },
    message: {
        fontSize: 15,
        // borderWidth:1
        // marginLeft: 15,
        // alignContent:"center",
        // justifyContent:"center"
    },
    propertyImage: {
        width: 60, // Make the property image take up the full width of its container
        height: 60,
        borderRadius: 5,
    },
    propertyImagePlaceholder: {
        width: 60, // Make the placeholder take up the full width of its container
        height: 60,
        borderRadius: 5,
        backgroundColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        // padding: 10,
        backgroundColor: "white"
    },
    messageSentContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 10,
        // borderWidth:1,
    },
    messageReceivedContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        maxWidth: 350,
        paddingHorizontal: 10,
        // borderWidth:1,
    },
    sentMessage: {
        backgroundColor: "#FFD700",
        alignSelf: 'flex-end',
        borderRadius: 10,
        padding: 10,
        margin: 5,
        borderWidth: 1,
        // alignItems: "flex-end"
    },
    receivedMessage: {
        backgroundColor: '#ECECEC',
        alignSelf: 'flex-start',
        borderRadius: 10,
        padding: 10,
        margin: 5,
        borderWidth: 1,
    },
    messageText: {
        fontSize: 16,
    },
    horizontalContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white', // Set background color
        // padding: 10, // Add padding to the container
        borderRadius: 10, // Add border radius for rounded corners
        marginHorizontal: 10,
        borderWidth: 1,
        marginBottom: 15,
    },
    textInput: {
        flex: 1,
        paddingVertical: 10,
        marginLeft: 10, // Add margin to separate text input from icons
    },
    iconButton: {
        padding: 10,
    },
    time: {
        fontSize: 10,
        color: "grey",
        alignSelf: 'flex-end',
        // justifyContent: "flex-end"
    },
    profileImage: {
        width: 30,
        height: 30,
        borderRadius: 20,
    },
    profileImagePlaceholder: {
        width: 30,
        height: 30,
        borderRadius: 20,
        backgroundColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
    },
    makeOfferButton: {
        backgroundColor: "#FFD700",
        borderWidth: 1,
        // marginHorizontal: 15,
        marginTop: 5,
        width: '31%',
        paddingVertical: 5,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        borderRadius: 6
    },
    buttonText: {
        fontWeight: 'bold',
    }
});

export default MessagePlain;