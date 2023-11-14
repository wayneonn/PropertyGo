import React, {useContext} from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import {AuthContext} from "../../AuthContext";

const MessageRequest = ({ item, handleAccept, handleReject }) => {
    const { user } = useContext(AuthContext);
    const isSent = item.userId === user.user.userId;

    return (
        <View style={isSent ? styles.sentMessage : styles.receivedMessage}>
            <Text>{item.messageText}</Text>
            {!isSent && (
                <View style={styles.buttonContainer}>
                    <Button title="Accept" onPress={() => handleAccept(item)} />
                    <Button title="Reject" onPress={() => handleReject(item)} />
                </View>
            )}
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
        justifyContent: 'space-between',
        marginTop: 10,
    },
});

export default MessageRequest;
