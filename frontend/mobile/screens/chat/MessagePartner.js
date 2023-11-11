import React, { useState, useContext, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Button,
  TextInput,
  RefreshControl,
  Image,
  TouchableHighlight,
  FlatList,
  useWindowDimensions,
  KeyboardAvoidingView,
  Alert
} from 'react-native';
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
import MakeRequestModal from "../../components/Chat/MakeRequestModal";
import {BASE_URL} from "../../utils/documentApi"
import axios from 'axios'
import {getTransactionByTransactionId} from "../../utils/transactionApi";

const Message = ({ route, navigation }) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [chat, setChat] = useState(null);
  const chatId = route.params.chatId;
  const [newMessage, setNewMessage] = useState('');
  const windowWidth = useWindowDimensions().width;
  const [transaction, setTransaction] = useState(null);

  const [isModalVisible, setModalVisible] = useState(false);

  const fetchData = async () => {
    try {
      const chatData = await getChatById(chatId);
      let request = chatData.request;
      if (request !== null) {
        let id = request.requestId;
        const response = await axios.get(`${BASE_URL}/user/transactions/byRequestId/${id}`);
        console.log("Transaction data: ", response.data);

        // Check if the Axios response contains transactions data
        if (response.data && response.data.transactions && response.data.transactions.length > 0) {
          setTransaction(response.data);
        }
      }

      // Returns PropertyListing (not needed), Sender and Receiver.
      // Chat has a fixed Sender and Receiver.
      console.log(chatData);
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
      const messageData = {
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

  async function sendMessage(message) {
    // SHOULD BE A FUNCTION //
    try {
      const messageData = {
        messageText: message,
        userId: user.user.userId,
        chatId: chat.chatId
      }
      await addMessage(messageData);
      useMessageCallback();
    } catch (error) {
      console.error(error);
    }
    // SHOULD BE A FUNCTION //
  }

   const handlePropertyPress = (propertyListingId) => {
    navigation.navigate('Property Listing', { propertyListingId })
  };

  const handleMakeRequest = async (jobTitle, jobDescription, amount) => {
    // Check for missing inputs
    if (!amount || !jobDescription || !jobTitle) {
      Alert.alert('Error', 'Missing input!');
      return;
    }

    try {
      const requestBody = {
        jobTitle,
        jobDescription,
        price: amount,
        userId: user.user.userId,
        chatId: chat.chatId
      };
      // Send a POST request to the server using Axios
      const response = await axios.post(`${BASE_URL}/request`, requestBody);
      Alert.alert('Success', 'Request created successfully');

      const requestMessage = `Job Title: ${jobTitle} \n Job Description: ${jobDescription} \n Amount: ${amount}`
      sendMessage(requestMessage)
    } catch (error) {
      const errorMessage = error.response ? error.response.data.error : error.message;
      Alert.alert('Error', `Failed to create request: ${errorMessage}`);
    }
  };

  const handleAcceptRequest = () => {
    Alert.alert(
        "Accept Request",
        `Do you want to accept the following request?\nService Title: ${chat.request.jobTitle}\nService Description: ${chat.request.jobDescription}\nAmount: ${chat.request.price}`, // Replace `chat.request.details` with the appropriate field from your chat.request object
        [
          {
            text: "Yes",
            onPress: acceptRequest
          },
          {
            text: "No",
            onPress: rejectRequest,
            style: "cancel"
          }
        ],
        { cancelable: false }
    );
  };

  const acceptRequest = async () => {
    console.log("Request accepted");
    // Create a new PENDING transaction
    // Then add a message to the chat that says it is pending.
    // Prepare the transaction data
    const transactionData = {
      transactionItem: "SERVICE",
      quantity: 1,
      gst: 0,
      onHoldBalance: chat.request.price,
      paymentAmount: 0,
      status: 'PENDING',
      transactionType: "REQUEST",
      requestId: chat.request.requestId,
      buyerId: chat.sender.userId,
      userId: chat.receiver.userId
    };

    try {
      // Make a POST request to create a new transaction
      const response = await axios.post(`${BASE_URL}/user/transactions/createTransaction`, transactionData);

      const createdTransaction = response.data;
      console.log('Transaction created:', createdTransaction);
      setTransaction(createdTransaction);
      // Send a message to the chat that the transaction is created
      // Implement this based on your chat system
      let transactionMessage = `Transaction with ID ${createdTransaction.transactionId} is created and pending payment in cheque.`;
      sendMessage(transactionMessage)
    } catch (error) {
      // Handle any errors that occurred during the Axios request
      console.error('Error creating transaction:', error.response ? error.response.data : error.message);
    }
  };

  const rejectRequest = async () => {
    try {
      console.log("Request rejected and deleted.");
      const response = await axios.delete(`${BASE_URL}/request/${chat.request.requestId}`);

      if (response.status === 200) { // or the appropriate success status code
        Alert.alert("The request has been rejected. Partner has to make a new request.");
        // Update UI or state to reflect the deletion
        sendMessage("Buyer has rejected Request. Please create a new request.")
      } else {
        // Handle unsuccessful deletion
        console.error("Deletion was not successful:", response.status);
      }
    } catch (error) {
      console.error("Error in deleting request:", error);
      // Optionally show an error message to the user
    }
  }


  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <View style={styles.PropertyItemContainer}>
          <View style={styles.contentContainer}>
            <View style={styles.detailContainer}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{chat ? chat.receiver.name : "Loading"}</Text>
              </View>
              <Text style={styles.message}>
                {chat ? chat.receiver.email : "No email address available."}
              </Text>

              {chat && user.user.userId === chat.receiver.userId && !chat.request ?
                  <TouchableOpacity
                      style={styles.makeOfferButton}
                      onPress={toggleModal}
                  >
                    <Text style={styles.buttonText}>Make Request!</Text>
                  </TouchableOpacity>
                  : chat && chat.request && transaction === null && user.user.userId === chat.senderId ?  // Check if request is not yet accepted
                      <TouchableOpacity
                          style={styles.makeOfferButton}
                          onPress={handleAcceptRequest}
                      >
                        <Text style={styles.buttonText}>Accept Request</Text>
                      </TouchableOpacity>
                      : chat && chat.request && transaction !== null&& user.user.userId === chat.senderId ? // Check if request is already accepted and user is the sender
                          <Text>Request Accepted</Text>
                          : chat && chat.request && user.user.userId === chat.receiverId ? // Check if request is already accepted and user is the receiver
                              <Text>Request Pending Acceptance</Text>
                              : <Text>Waiting for Request to be made.</Text>
              }

            </View>
            <View style={styles.propertyImageContainer}>
              {chat && chat.receiver.profileImage ? (
                <Image source={{ uri: `data:image/jpeg;base64,${base64.encodeFromByteArray(chat.propertyListing.propertyImages[0].image.data)}` }} style={styles.propertyImage} />
              ) : (
                <View style={styles.propertyImagePlaceholder}>
                  <Ionicons name="profile" size={24} color="white" />
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      // style={styles.keyboardContainer}
      >
        <View style={styles.horizontalContainer}>
          <TextInput
            placeholder="Type your message here"
            value={newMessage}
            onChangeText={text => setNewMessage(text)}
            style={styles.textInput}
            multiline // Allow multiline text input
          />
          <TouchableHighlight style={styles.iconButton} onPress={handleSubmit} disabled={!newMessage} underlayColor="rgba(0, 0, 0, 0.1">
            <Ionicons name="send-outline" size={24} color="black" />
          </TouchableHighlight>
        </View>
      </KeyboardAvoidingView>

      <MakeRequestModal isVisible={isModalVisible} onCancel={toggleModal} onSubmit={handleMakeRequest}/>

    </View>

  );
};

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
    width: '35%',
    paddingVertical: 5,
    alignItems: "center",
    borderRadius: 6
  },
  buttonText: {
    fontWeight: 'bold',
  }
});

export default Message;