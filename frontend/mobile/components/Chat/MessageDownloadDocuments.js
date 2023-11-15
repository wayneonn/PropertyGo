import React, {useContext} from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import {AuthContext} from "../../AuthContext";
import {Ionicons} from "@expo/vector-icons";

const MessageDownloadDocuments = ({ item, handleDownload}) => {
    const { user } = useContext(AuthContext);
    const isSent = item.userId === user.user.userId;

    return (
        <View style={isSent ? styles.sentMessage : styles.receivedMessage}>
            <Text>{item.messageText}</Text>
            <View style={styles.buttonContainer}>
                <Ionicons name="document-text-outline" size={24} color="blue" />
                <Button title="Download" onPress={() => handleDownload(item)} />
            </View>
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
});

export default MessageDownloadDocuments;
