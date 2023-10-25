import React, { useState, useContext, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, TextInput, RefreshControl, Image, TouchableHighlight, FlatList , useWindowDimensions} from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { AuthContext } from '../../AuthContext';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { getUserContactUsId } from '../../utils/contactUsApi';
import { getTimeAgo } from '../../services/CalculateTimeAgo';
import { createResponse } from '../../utils/responseApi';
import { socket } from '../../navigations/LoginNavigator';
import HTML from 'react-native-render-html';

const Response = ({ route }) => {
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const contactUs = route.params.contactUs;
    const [newMessage, setNewMessage] = useState('');
    const windowWidth = useWindowDimensions().width;
    // console.log("contact US :", contactUs)
    // console.log("messages:", messages)

    const fetchData = async () => {
        try {
            const updatedContactUs = await getUserContactUsId(contactUs.contactUsId);
            setMessages([{ message: contactUs.message, userId: contactUs.userId, createdAt: contactUs.createdAt }, ...updatedContactUs.responses])
        } catch (error) {
            console.error(error);
        }
    }

    const useResponseCallback = useCallback(() => {
        fetchData();
    }, [])

    useFocusEffect(useResponseCallback);

    useEffect(() => {
        socket.on("userNotification", (data) => {
            // console.log("RESPONDEDEDEDE")
            useResponseCallback();
        });
    })


    const handleSubmit = async () => {

        try {
            responseData = {
                message: newMessage,
                userId: user.user.userId,
                contactUsId: contactUs.contactUsId
            }
            await createResponse(responseData);
            useResponseCallback();
        } catch (error) {
            console.error(error);
        }

        // Reset the input fields after submission
        setNewMessage('');

    };

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={item.userId ? styles.sentMessage : styles.receivedMessage}>
                        <Text style={styles.messageText}><HTML source={{ html: item.message.replace(/<\/?p>/g, '').replace(/<html>|<\/html>/g, '')}} contentWidth={windowWidth}/></Text>
                        <Text style={styles.time}>{getTimeAgo(item.createdAt)}</Text>
                    </View>
                )}
            />
            <View style={styles.horizontalContainer}>
                <TextInput
                    placeholder="Type your message here"
                    value={newMessage}
                    onChangeText={text => setNewMessage(text)}
                    style={styles.textInput}
                    multiline // Allow multiline text input
                />
                <TouchableHighlight style={styles.iconButton} onPress={handleSubmit} disabled={!newMessage} underlayColor="rgba(0, 0, 0, 0.1)">
                    <Ionicons name="send-outline" size={24} color="black" />
                </TouchableHighlight>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "white"
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
    }
});

export default Response;
