// This is a trial navigation for Chat.
import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';

const Chat = ({navigation, route}) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (input.trim()) {
            setMessages(prevMessages => [...prevMessages, { text: input, sender: 'user' }]);
            setInput('');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.messageContainer}>
                {messages.map((message, index) => (
                    <View key={index} style={message.sender === 'user' ? styles.userMessage : styles.otherMessage}>
                        <Text>{message.text}</Text>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={input}
                    onChangeText={setInput}
                    placeholder="Type a message"
                />
                <Button title="Send" onPress={handleSend} />
            </View>
            <Text>&nbsp;</Text>
        </View>
    );
};

const styles = {
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    messageContainer: {
        flex: 1,
        padding: 10,
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#0084ff',
        padding: 10,
        borderRadius: 8,
        marginVertical: 4,
    },
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#e5e5e5',
        padding: 10,
        borderRadius: 8,
        marginVertical: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
    input: {
        flex: 1,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
};


export default Chat;