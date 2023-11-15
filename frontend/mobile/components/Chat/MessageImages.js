import React, {useContext} from 'react';
import {View, Text, Button, StyleSheet, Image} from 'react-native';
import {AuthContext} from "../../AuthContext";
import {Ionicons} from "@expo/vector-icons";

const MessageImages = ({item}) => {
    const { user } = useContext(AuthContext);
    const isSent = item.userId === user.user.userId;
    const imageId = item.messageText.split(':')[1].trim();
    const uri_link = `http://localhost:3000/image/${imageId}`
    return (
        <View style={isSent ? styles.sentMessage : styles.receivedMessage}>
            <Text>{item.messageText}</Text>
            <Image source={{ uri: uri_link }} style={styles.image} resizeMode={"cover"}/>
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
    image: {
        width: 100,
        height: 100,
    },
});

export default MessageImages;
