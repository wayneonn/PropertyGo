import React, { useState, useContext, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, Button, TextInput, RefreshControl, Image, TouchableHighlight, FlatList, useWindowDimensions, KeyboardAvoidingView } from 'react-native';
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
import MakeOfferModal from '../../components/Chat/MakeOfferModal';
import EditOfferModal from '../../components/Chat/EditOfferModal';
import { createRequest, updateRequest } from '../../utils/requestApi';
import { editProperty } from '../../utils/api';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import DefaultImage from '../../assets/No-Image-Available.webp';

const Message = ({ route, navigation }) => {

  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [chat, setChat] = useState(null);
  const chatId = route.params.chatId;
  const [newMessage, setNewMessage] = useState('');
  const windowWidth = useWindowDimensions().width;

  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);

  const fetchData = async () => {
    try {
      const chatData = await getChatById(chatId);
      // console.log(chatData)

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

  useEffect(() => {
    socket.on("userChatNotification", (data) => {
        // console.log("RESPONDEDEDEDE")
        useMessageCallback();
    });
})


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

  const handlePropertyPress = (propertyListingId) => {
    navigation.navigate('Property Listing', { propertyListingId })
  };

  const handleMakeOffer = async (amount) => {

    if (!amount) {
      Alert.alert('Error', 'Missing input amount!');
      return;
    }

    try {
      const requestData = {
        price: amount,
        chatId: chat.chatId
      }
      const request = await createRequest(user.user.userId, requestData);
      useMessageCallback();
    } catch (error) {
      console.error(error);
    }

  };

  const handleEditOffer = async (amount) => {

    if (!amount) {
      Alert.alert('Error', 'Missing input amount!');
      return;
    }

    try {
      const requestData = {
        price: amount,
        requestStatus: "PENDING",
      }
      await updateRequest(chat.request.requestId, requestData);

      useMessageCallback();
    } catch (error) {
      console.error(error);
    }

  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleEditModal = () => {
    setEditModalVisible(!isEditModalVisible);
  };

  const rejectOffer = async () => {
    try {
      const requestData = {
        requestStatus: "REJECTED",
      }
      const request = await updateRequest(chat.request.requestId, requestData);
      useMessageCallback();
    } catch (error) {
      console.error(error);
    }
  };

  const acceptOffer = async () => {
    try {
      const requestData = {
        requestStatus: "ACCEPTED",
      }
      await updateRequest(chat.request.requestId, requestData);

      const propertyData = {
        offeredPrice: chat.request.price,
      }
      await editProperty(chat.propertyId, propertyData)
      useMessageCallback();
    } catch (error) {
      console.error(error);
    }
  };

  const formatPrice = (price) => {
    if (price !== null && !isNaN(price)) {
      const formattedPrice = price.toFixed(2); // Format to 2 decimal places
      return formattedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else {
      return 'N/A'; // Handle the case when price is null, undefined, or not a number
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => handlePropertyPress(chat.propertyListing.propertyListingId)}>
        <View style={styles.PropertyItemContainer}>
          <View style={styles.contentContainer}>
            <View style={styles.detailContainer}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{chat ? chat.propertyListing.title : "Loading"}</Text>
              </View>
              <Text style={styles.message}>
                ${chat ? formatPrice(chat.propertyListing.price) : "0.00"}
              </Text>

              {chat && user.user.userId === chat.senderId && !chat.request ?
                <TouchableOpacity
                  style={styles.makeOfferButton}
                  onPress={toggleModal}
                >
                  <Text style={styles.buttonText}>Make Offer!</Text>
                </TouchableOpacity>
                : null}

              {chat && user.user.userId === chat.senderId && chat.request ?
                <View>
                  <View style={styles.editOfferContainer}>
                    <Text style={styles.offerText}>
                      Your Offer: ${chat ? formatPrice(chat.request.price) : "0.00"}
                    </Text>

                    {chat.request.requestStatus === "ACCEPTED" ? (
                      <TouchableOpacity
                        style={[styles.purchaseButton]}
                        onPress={() => {
                          navigation.navigate('Purchase Option Fee Info', { propertyListing : chat.propertyListing, isOfferedPrice: true });
                        }}
                      >
                        <FontAwesome name="shopping-cart" size={16} color="white" />
                        <Text style={styles.purchaseText}>{"  "}Purchase</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={[styles.editOfferButton, chat.request.requestStatus === "ACCEPTED" ? { backgroundColor: "#ccc" } : null]}
                        onPress={toggleEditModal}
                        disabled={chat.request.requestStatus === "ACCEPTED"}
                      >
                        <Text style={styles.buttonText}>Edit Offer!</Text>
                      </TouchableOpacity>
                    )}

                  </View>

                  {chat.request.requestStatus === "ACCEPTED" ?
                    <View style={styles.statusOfferContainer}>
                      <Text style={styles.acceptedText}> OFFER ACCEPTED! </Text>
                      <MaterialCommunityIcons name="sticker-check" size={24} color="green" />
                    </View>
                    : chat.request.requestStatus === "REJECTED" ?
                      <View style={styles.statusOfferContainer}>
                        <Text style={styles.rejectedText}> OFFER REJECTED! </Text>
                        <MaterialCommunityIcons name="sticker-alert" size={24} color="red" />
                      </View>
                      : null
                  }
                </View>
                : null}

              {chat && user.user.userId === chat.receiverId && chat.request ?
                <View>
                  <Text style={styles.sellerOfferText}>
                    Offer Price : ${chat ? formatPrice(chat.request.price) : "0.00"}
                  </Text>
                  {chat.request.requestStatus === "PENDING" ?
                    <View style={styles.sellerOfferContainer}>

                      <TouchableOpacity
                        style={styles.rejectOfferButton}
                        onPress={rejectOffer}
                      >
                        <Text style={styles.buttonTextReject}>Reject Offer</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.acceptOfferButton}
                        onPress={acceptOffer}
                      >
                        <Text style={styles.buttonText}>Accept Offer</Text>
                      </TouchableOpacity>
                    </View>
                    : chat.request.requestStatus === "ACCEPTED" ?
                      <View style={styles.statusOfferContainer}>
                        <Text style={styles.acceptedText}> OFFER ACCEPTED! </Text>
                        <MaterialCommunityIcons name="sticker-check" size={24} color="green" />
                      </View>
                      :
                      <View style={styles.statusOfferContainer}>
                        <Text style={styles.rejectedText}> OFFER REJECTED! </Text>
                        <MaterialCommunityIcons name="sticker-alert" size={24} color="red" />
                      </View>
                  }
                </View>
                : null}

            </View>
            <View style={styles.propertyImageContainer}>
              {chat && chat.propertyListing.propertyImages.length !== 0 ? (
                <Image source={{ uri: `data:image/jpeg;base64,${base64.encodeFromByteArray(chat.propertyListing.propertyImages[0].image.data)}` }} style={styles.propertyImage} />
              ) : (
                // <View style={styles.placeholderImage}>
                <Image source={DefaultImage} style={styles.propertyImage} />
                // </View>
                // <View style={styles.propertyImagePlaceholder}>
                //   <Ionicons name="home" size={24} color="white" />
                // </View>
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

      <MakeOfferModal isVisible={isModalVisible} onCancel={toggleModal} onSubmit={handleMakeOffer} />
      <EditOfferModal isVisible={isEditModalVisible} onCancel={toggleEditModal} onSubmit={handleEditOffer} />
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
  editOfferContainer: {
    flexDirection: 'row',
    justifyContent: "flex-start",
    alignItems: 'center',
    // marginRight: 5,
    // borderWidth:1
  },
  sellerOfferContainer: {
    flexDirection: 'row',
    justifyContent: "flex-start",
    alignItems: 'center',
    marginTop: 5,
    // borderWidth:1
  },
  statusOfferContainer: {
    flexDirection: 'row',
    justifyContent: "flex-start",
    alignItems: 'center',
    // marginTop: 5,
    // borderWidth:1
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
  offerText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: "red",
    width: "60%",
  },
  sellerOfferText: {
    marginVertical: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: "blue",
    width: "90%",
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
  editOfferButton: {
    backgroundColor: "#FFD700",
    borderWidth: 1,
    width: '35%',
    paddingVertical: 5,
    alignItems: "center",
    borderRadius: 6,
    marginHorizontal: 5,
  },
  purchaseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#4CAF50",
    borderWidth: 1,
    width: '35%',
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: "center",
    borderRadius: 6,
    marginHorizontal: 5,
  },
  rejectOfferButton: {
    backgroundColor: "red",
    borderWidth: 1,
    width: '35%',
    paddingVertical: 5,
    alignItems: "center",
    borderRadius: 6,
    // marginHorizontal: 5,
  },
  acceptOfferButton: {
    backgroundColor: "#FFD700",
    borderWidth: 1,
    width: '35%',
    paddingVertical: 5,
    alignItems: "center",
    borderRadius: 6,
    marginHorizontal: 5,
  },
  buttonText: {
    fontWeight: 'bold',
  },
  purchaseText: {
    color: "white",
    fontWeight: 'bold',
  },
  buttonTextReject: {
    color: "white",
    fontWeight: 'bold',
  },
  acceptedText: {
    fontWeight: 'bold',
    color: "green",
    fontSize: 14,
  },
  rejectedText: {
    fontWeight: 'bold',
    color: "red",
    fontSize: 14,
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
});

export default Message;
