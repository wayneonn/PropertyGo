import React, {useContext} from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import {AuthContext} from "../../AuthContext";
import {Ionicons} from "@expo/vector-icons";
import {getTimeAgo} from "../../services/CalculateTimeAgo";

const MessageDownloadDocuments = ({ item, handleDownload}) => {
    const { user } = useContext(AuthContext);
    const isSent = item.userId === user.user.userId;
    // Split the string into an array of lines
    let lines = item.messageText.split('\n');

    // Remove the first line and join the remaining lines
    let modifiedText = lines.slice(1).join('\n').trim();

    return (
        <View style={isSent ? styles.sentMessage : styles.receivedMessage}>
            <Text>{item.messageText}</Text>
            <View style={styles.buttonContainer}>
                <Ionicons name="document-text-outline" size={24} color="blue" />
                <Button title="Download" onPress={() => handleDownload(item)} />
            </View>
            <Text style={styles.time}>{getTimeAgo(item.createdAt)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    sentMessage: {
        backgroundColor: "#FFD700",
        alignSelf: 'flex-end',
        borderRadius: 10,
        padding: 10,
        margin: 5,
        borderWidth: 1,
    },
    receivedMessage: {
        backgroundColor: '#ECECEC',
        alignSelf: 'flex-start',
        borderRadius: 10,
        padding: 10,
        margin: 5,
        borderWidth: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:"center",
        marginTop: 10,
    },
    time: {
        fontSize: 10,
        color: "grey",
        alignSelf: 'flex-end',
        // justifyContent: "flex-end"
    },
});

export default MessageDownloadDocuments;
