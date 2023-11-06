import React, { useState, useContext, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, TextInput, RefreshControl, Image, TouchableHighlight, FlatList, useWindowDimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../AuthContext';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getTimeAgo } from '../../services/CalculateTimeAgo';
import { socket } from '../../navigations/LoginNavigator';
import HTML from 'react-native-render-html';
import { getChatById } from '../../utils/chatApi';
import { addMessage } from '../../utils/messageApi'
import base64 from 'react-native-base64';

const Message = ({ route }) => {

  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [chat, setChat] = useState(null);
  const chatId = route.params.chatId;
  const [newMessage, setNewMessage] = useState('');
  const windowWidth = useWindowDimensions().width;

  const fetchData = async () => {
    try {
      const chatData = await getChatById(chatId);
      console.log(chatData)

      setChat(chatData);
      setMessages(chatData.messages);

    } catch (error) {
      console.error(error);
    }
  }

  const useMessageCallback = useCallback(() => {
    fetchData();
  }, [])

  useFocusEffect(useMessageCallback);

  // useEffect(() => {
  //     socket.on("userNotification", (data) => {
  //         // console.log("RESPONDEDEDEDE")
  //         useMessageCallback();
  //     });
  // })


  const handleSubmit = async () => {

    try {
      messageData = {
        messageText: newMessage,
        userId: user.user.userId,
        chatId: chat.chatId
      }
      await addMessage(messageData);
      useMessageCallback();
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
          <View style={item.userId === user.user.userId ? styles.messageSentContainer : styles.messageReceivedContainer}>
            {item.userId !== user.user.userId ?
              item.userId === chat.senderId && chat.sender.profileImage ? (
                <Image source={{ uri: `data:image/jpeg;base64,${base64.encodeFromByteArray(chat.sender.profileImage.data)}` }} style={styles.profileImage} />)
                : item.userId === chat.receiverId && chat.receiver.profileImage ? (
                  <Image source={{ uri: `data:image/jpeg;base64,${base64.encodeFromByteArray(chat.receiver.profileImage.data)}` }} style={styles.profileImage} />)
                  : (
                    <View style={styles.profileImagePlaceholder}>
                      <Icon name="user" size={20} color="white" />
                    </View>
                  ) : null}
            <View style={item.userId === user.user.userId ? styles.sentMessage : styles.receivedMessage}>
              <Text style={styles.messageText}><HTML source={{ html: item.messageText.replace(/<\/?p>/g, '').replace(/<html>|<\/html>/g, '') }} contentWidth={windowWidth} /></Text>
              <Text style={styles.time}>{getTimeAgo(item.createdAt)}</Text>
            </View>
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
  messageSentContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end', 
    alignItems: 'center',
    // borderWidth:1,
  },
  messageReceivedContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start', 
    alignItems: 'center',
    maxWidth: 350,
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
});

export default Message;
