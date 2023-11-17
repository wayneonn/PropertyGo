import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
    Alert,
    FlatList,
    Image,
    KeyboardAvoidingView, Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    useWindowDimensions,
    View
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {AuthContext} from '../../AuthContext';
import {Ionicons, MaterialIcons} from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import {getTimeAgo} from '../../services/CalculateTimeAgo';
import HTML from 'react-native-render-html';
import {getChatById} from '../../utils/chatApi';
import {addMessage, changeMessage} from '../../utils/messageApi'
import base64 from 'react-native-base64';
import MakeRequestModal from "../../components/Chat/MakeRequestModal";
import {BASE_URL, createFolder} from "../../utils/documentApi"
import axios from 'axios'
import MessageRequest from "../../components/Chat/MessageRequest";
import MessageDownloadDocuments from "../../components/Chat/MessageDownloadDocuments";
import MessageImages from "../../components/Chat/MessageImages";
import MessagePlain from "../../components/Chat/MessagePlain";
import ChatDocumentUpload from "../../components/Chat/ChatUploadDocuments";
import {openBrowserAsync} from "expo-web-browser";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import ChatUploadImages from "../../components/Chat/ChatUploadImages";
import SearchBar from "../../components/Forum/SearchBar"
import {socket} from "../../navigations/LoginNavigator";

// Add unique message.
const Message = ({route, navigation}) => {
    const {user} = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [filteredMessages, setFilteredMessages] = useState([])
    const [chat, setChat] = useState(null);
    const chatId = route.params.chatId;
    const [newMessage, setNewMessage] = useState('');
    const [transaction, setTransaction] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isUploadModalVisible, setIsUploadModalVisible] = useState(false)
    const [isImageModalVisible, setIsImageModalVisible] = useState(false)
    const [searchQuery, setSearchQuery] = useState('');
    const [fullScreenImage, setFullScreenImage] = useState(null)

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
            setFilteredMessages(chatData.messages);
            setSearchQuery("")
        } catch (error) {
            console.error(error);
        }
    }


    const useMessageCallback = useCallback(() => {
        fetchData();
    }, [])

    useEffect(() => {
        socket.on("userChatNotification", (data) => {
            // console.log("RESPONDEDEDEDE")
            useMessageCallback();
        });
    })

    useFocusEffect(useMessageCallback);

    const handleRefresh = async () => {
        setRefreshing(true);
        useMessageCallback();
        setRefreshing(false);
    };

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

    async function updateMessage(message, messageId) {
        // SHOULD BE A FUNCTION //
        try {
            const messageData = {
                messageData: message,
                messageId: messageId
            }
            await changeMessage(messageData);
            useMessageCallback();
        } catch (error) {
            console.error(error);
        }
        // SHOULD BE A FUNCTION //
    }

    const handleSearch = (text) => {
        const filtered = messages.filter((item) => {
            return item.messageText.toLowerCase().includes(text.toLowerCase());
        });

        if (text === "") {
            setFilteredMessages(messages);
        } else {
            setFilteredMessages(filtered);
        }
        setSearchQuery(text);
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
            const request = response.data
            Alert.alert('Success', `This is the Request response: ${request.requestId}`);

            const requestMessage = `Request ID: ${request.requestId} \nJob Title: ${jobTitle} \nJob Description: \n${jobDescription} \nAmount: ${amount}`
            const send = await sendMessage(requestMessage)
        } catch (error) {
            const errorMessage = error.response ? error.response.data.error : error.message;
            Alert.alert('Error', `Failed to create request: ${errorMessage}`);
        }
    };

    // const handleAcceptRequest = () => {
    //     Alert.alert(
    //         "Accept Request",
    //         `Do you want to accept the following request?\nService Title: ${chat.request.jobTitle}\nService Description: ${chat.request.jobDescription}\nAmount: ${chat.request.price}`, // Replace `chat.request.details` with the appropriate field from your chat.request object
    //         [
    //             {
    //                 text: "Yes",
    //                 onPress: acceptRequest
    //             },
    //             {
    //                 text: "No",
    //                 onPress: rejectRequest,
    //                 style: "cancel"
    //             }
    //         ],
    //         {cancelable: false}
    //     );
    // };

    const acceptRequest = async (item) => {
        console.log("Request accepted");
        if (chat.request == null) {
            Alert.alert("The request has already been rejected.");
        }
        // Create a new PENDING transaction
        // Then add a message to the chat that says it is pending.
        // Prepare the transaction data

        // Split the string by lines
        const lines = item.messageText.split('\n');

        // Find the line containing 'Request ID'
        const requestIdLine = lines.find(line => line.includes('Request ID'));
        const requestIdPrice = lines.find(line => line.includes('Amount'));
        // Extract the requestId value
        const requestId = requestIdLine.split(':')[1].trim();
        const price = requestIdPrice.split(':')[1].trim();

        const transactionData = {
            transactionItem: "SERVICE",
            quantity: 1,
            gst: 0,
            onHoldBalance: price,
            paymentAmount: 0,
            status: 'PENDING',
            transactionType: "REQUEST",
            requestId: requestId,
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
            let updatedRequest = `${lines[2]} ${lines[3]} has been accepted.`
            const send = await sendMessage(transactionMessage)
            const update = await updateMessage(updatedRequest, item.messageId)
        } catch (error) {
            // Handle any errors that occurred during the Axios request
            console.error('Error creating transaction:', error.response ? error.response.data : error.message);
        }
    };

    const rejectRequest = async (item) => {
        try {
            console.log("Request rejected and deleted.", "The current request is already removed.");
            if (chat.request == null) {
                Alert.alert("The request has already been rejected.");
            }

            const lines = item.messageText.split('\n');
            const requestIdLine = lines.find(line => line.includes('Request ID'));
            const requestId = requestIdLine.split(':')[1].trim();

            const response = await axios.delete(`${BASE_URL}/request/${requestId}`);

            if (response.status === 200) { // or the appropriate success status code
                Alert.alert("The request has been rejected.");
                // Update UI or state to reflect the deletion
                const send = await sendMessage(`Buyer has rejected Request: ${lines[2]}. Please create a new request.`)
                const update = await updateMessage(`Rejected Request: ${lines[2]}.`, item.messageId)
            } else {
                // Handle unsuccessful deletion
                console.error("Deletion was not successful:", response.status);
            }
        } catch (error) {
            console.error("Error in deleting request:", error);
            // Optionally show an error message to the user
        }
    }

    const downloadPDF = async (item) => {
        const documentId = item.messageText.split(':')[1].trim();
        const response = await fetch(
            `${BASE_URL}/user/documents/${documentId}/data`
        );
        console.log(response)
        const result = await response.json();
        console.log(result)
        // The web version is kinda not needed.
        if (Platform.OS === "web") {
            const byteCharacters = atob(result.document); // Decode the Base64 string
            const byteArrays = [];
            for (let offset = 0; offset < byteCharacters.length; offset += 512) {
                const slice = byteCharacters.slice(offset, offset + 512);
                const byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }
            const blob = new Blob(byteArrays, {type: "application/pdf"});
            const url = URL.createObjectURL(blob);
            await openBrowserAsync(url); // Assuming this opens the URL in a new browser tab/window
            FileSaver.saveAs(blob, document.name); // Assuming document.name is the desired name of the downloaded file
            URL.revokeObjectURL(url);
        } else {
            try {
                // Slight issue opening certain PDF files.
                // Native FileSystem logic

                const fileName = (FileSystem.documentDirectory + result.title).replace(/\s/g, '_');
                console.log('Filename:', fileName);

                await FileSystem.writeAsStringAsync(
                    fileName,
                    result.document,
                    {encoding: FileSystem.EncodingType.Base64}
                );

                const isAvailable = await Sharing.isAvailableAsync();
                if (!isAvailable) {
                    alert(`Uh oh, sharing isn't available on your platform`);
                    return;
                }

                if (fileName) {
                    alert("Downloaded to " + fileName);
                    await Sharing.shareAsync(fileName);
                } else {
                    alert("Failed to download PDF");
                }
            } catch (error) {
                console.error("Error opening the file", error);
                alert("Failed to open PDF");
            }
        }
    };


    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const toggleUploadModal = () => {
        setIsUploadModalVisible(!isUploadModalVisible)
    }

    const toggleImageModal = () => {
        setIsImageModalVisible(!isImageModalVisible)
    }

    return (
        <View style={styles.container}>
                <View style={styles.PropertyItemContainer}>
                    <View style={styles.contentContainer}>
                        <View style={styles.detailContainer}>
                            <View style={styles.titleContainer}>
                                <Text
                                    style={styles.title}>Partner: {chat ? chat.receiver.name : "Loading"}</Text>
                            </View>
                            <Text style={styles.message}>
                                {chat ? chat.receiver.email : "No email address available."}
                            </Text>
                            <View style={{flexDirection: "row"}}>
                                {chat && user.user.userId === chat.receiverId ?
                                    <TouchableOpacity
                                        style={styles.makeOfferButton}
                                        onPress={toggleModal}
                                    >
                                        <MaterialIcons name="add" size={20} color="#000" />
                                        <Text style={styles.buttonText}> Request</Text>
                                    </TouchableOpacity>
                                    : null}
                                <Text>&nbsp;</Text>
                                <TouchableOpacity
                                    style={styles.makeOfferButton}
                                    onPress={toggleUploadModal}
                                >
                                    <MaterialIcons name="description" size={20} color="#000" />
                                </TouchableOpacity>
                                <Text>&nbsp;</Text>
                                <TouchableOpacity
                                    style={styles.makeOfferButton}
                                    onPress={toggleImageModal}
                                >
                                    <Ionicons name="images" size={20} color="#000" />
                                </TouchableOpacity>
                            </View>

                            {/*{chat && user.user.userId === chat.receiver.userId && !chat.request ?*/}
                            {/*    <TouchableOpacity*/}
                            {/*        style={styles.makeOfferButton}*/}
                            {/*        onPress={toggleModal}*/}
                            {/*    >*/}
                            {/*      <Text style={styles.buttonText}>Make Request!</Text>*/}
                            {/*    </TouchableOpacity>*/}
                            {/*    : chat && chat.request && transaction === null && user.user.userId === chat.senderId ?  // Check if request is not yet accepted*/}
                            {/*        <TouchableOpacity*/}
                            {/*            style={styles.makeOfferButton}*/}
                            {/*            onPress={handleAcceptRequest}*/}
                            {/*        >*/}
                            {/*          <Text style={styles.buttonText}>Accept Request</Text>*/}
                            {/*        </TouchableOpacity>*/}
                            {/*        : chat && chat.request && transaction !== null&& user.user.userId === chat.senderId ? // Check if request is already accepted and user is the sender*/}
                            {/*            <Text>Request Accepted</Text>*/}
                            {/*            : chat && chat.request && user.user.userId === chat.receiverId ? // Check if request is already accepted and user is the receiver*/}
                            {/*                <Text>Request Pending Acceptance</Text>*/}
                            {/*                : <Text>Waiting for Request to be made.</Text>*/}
                            {/*}*/}

                        </View>

                        <View style={styles.propertyImageContainer}>
                            {chat && chat.receiver.profileImage ? (
                                <Image
                                    source={{uri: `data:image/jpeg;base64,${base64.encodeFromByteArray(chat.receiver.profileImage.data)}`}}
                                    style={styles.propertyImage}/>
                            ) : (
                                <View style={styles.propertyImagePlaceholder}>
                                    <Ionicons name="people" size={24} color="white"/>
                                </View>
                            )}
                        </View>
                    </View>
                    <View style={{marginTop: 10, alignItems:"center", height: 50}}>
                        <SearchBar handleSearch={handleSearch} searchQuery={searchQuery}/>
                    </View>
                </View>
            <ScrollView refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    tintColor={'#FFD700'}
                />
            }
            >
                <FlatList
                    data={filteredMessages}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}) => {
                        // Check if the message text starts the right headers
                        // Potential Issue here, what if someone replies with something weird.
                        const isRequest = item.messageText.startsWith("Request ID: ");
                        const isDocument = item.messageText.startsWith("Document ID: ");
                        const isImage = item.messageText.startsWith("Image ID: ");
                        return (
                            <View
                                style={item.userId === user.user.userId ? styles.messageSentContainer : styles.messageReceivedContainer}>
                                {item.userId !== user.user.userId ?
                                    item.userId === chat.senderId && chat.sender.profileImage ? (
                                            <Image
                                                source={{uri: `data:image/jpeg;base64,${base64.encodeFromByteArray(chat.sender.profileImage.data)}`}}
                                                style={styles.profileImage}/>)
                                        : item.userId === chat.receiverId && chat.receiver.profileImage ? (
                                                <Image
                                                    source={{uri: `data:image/jpeg;base64,${base64.encodeFromByteArray(chat.receiver.profileImage.data)}`}}
                                                    style={styles.profileImage}/>)
                                            : (
                                                <View style={styles.profileImagePlaceholder}>
                                                    <Icon name="user" size={20} color="white"/>
                                                </View>
                                            ) : null}

                                {isRequest ?
                                    // Render the MessageRequest component for messages starting with "Job Title"
                                    <MessageRequest item={item} handleAccept={acceptRequest}
                                                    handleReject={rejectRequest}/>
                                    :
                                    isDocument ?
                                    // Render the MessageDownloadDocuments component for messages starting with "Download"
                                    <MessageDownloadDocuments item={item} handleDownload={downloadPDF}/>
                                    : isImage ?
                                    // Render logic for messages that are images
                                    <MessageImages item={item} fullscrenImage={fullScreenImage} setFullScreenImage={setFullScreenImage} />
                                    :
                                    // Regular message rendering
                                    <MessagePlain item={item}/>
                                }
                            </View>
                        );
                    }}
                />
            </ScrollView>
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
                    <TouchableHighlight style={styles.iconButton} onPress={handleSubmit} disabled={!newMessage}
                                        underlayColor="rgba(0, 0, 0, 0.1">
                        <Ionicons name="send-outline" size={24} color="black"/>
                    </TouchableHighlight>
                </View>
            </KeyboardAvoidingView>

            <MakeRequestModal isVisible={isModalVisible} onCancel={toggleModal} onSubmit={handleMakeRequest}/>
            <ChatUploadImages isVisible={isImageModalVisible} onClose={toggleImageModal} chatId={chatId} sendMessage={sendMessage}/>
            <ChatDocumentUpload chatId={chatId} userId={user.user.userId} isVisible={isUploadModalVisible} onClose={toggleUploadModal} sendMessage={sendMessage}/>
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
        borderRadius: 10,
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

export default Message;
