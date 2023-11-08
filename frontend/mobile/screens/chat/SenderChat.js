import React, { useState, useContext, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../AuthContext';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, Alert, RefreshControl } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import SearchBar from '../../components/Forum/SearchBar';
import ChatItem from '../../components/Chat/ChatItem';
import { getUserSenderChat } from '../../utils/chatApi';
import ChatModal from '../../components/Chat/ChatModal';
import base64 from 'react-native-base64';

const SenderChat = ({ navigation }) => {

    const { user } = useContext(AuthContext);
    const [chats, setChats] = useState([]);
    const [filteredChats, setFilteredChats] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [filter, setFilter] = useState(null);

    const useParentCallback = useCallback(() => {
        const fetchData = async () => {
            try {

                const chatDatas = await getUserSenderChat(user.user.userId);
                // console.log(chatDatas);
                setChats(chatDatas);
                setFilteredChats(chatDatas);
                setSearchQuery('');
                setFilter(null);

            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, [])

    useFocusEffect(useParentCallback);

    const handleRefresh = async () => {
        setRefreshing(true);
        useParentCallback();
        setRefreshing(false);
    };

    const handleSearch = (text) => {
        setFilter(null);
        
        // Filter the chats based on the search query
        const filtered = chats.filter((chat) =>
          chat.propertyListing.title.toLowerCase().includes(text.toLowerCase())
        );
        // // console.log("text :" + text)

        if (text === "") {
          setFilteredChats(chats);
        } else {
          setFilteredChats(filtered);
        }

        setSearchQuery(text);
    };

    const handleChatPress = (chatId) => {
        setSearchQuery('');
        navigation.navigate("Message", { chatId });
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const handleFilterPress = async (f) => {
        // console.log(f)
        setFilter(f)
        if (f === "isReplied") {

            setFilteredChats(chats.filter((chat) => chat.senderReplied === true));

        } else if (f === "isPendingReply") {

            setFilteredChats(chats.filter((chat) => chat.senderReplied === false));

        } else {

            setFilteredChats(chats);
        }
        setModalVisible(!isModalVisible);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    tintColor={'#FFD700'}
                />
            }>
                <View style={styles.header}>
                    <Text style={styles.title}>Chats</Text>
                    <TouchableOpacity style={styles.filterButton} onPress={toggleModal}>
                        {/* <Text style={styles.filter}>Filter</Text> */}
                        <AntDesign name="filter" size={24} color="blue" />
                    </TouchableOpacity>
                </View>
                <SearchBar searchQuery={searchQuery} handleSearch={handleSearch} />
                {/* <ChatItem onPress={null} /> */}
                {!(filteredChats.length === 0) ? filteredChats.map((chat, index) => (
                    <ChatItem
                        key={chat.chatId}
                        onPress={() => handleChatPress(chat.chatId)}
                        updatedAt={chat.updatedAt}
                        name={chat.receiver.name}
                        title={chat.propertyListing.title}
                        messageText={chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].messageText : ''}
                        replied={chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].userId === chat.receiverId : false}
                        profileImage={chat.receiver.profileImage ? `data:image/jpeg;base64,${base64.encodeFromByteArray(chat.receiver.profileImage.data)}` : null}
                        propertyImage={chat.propertyListing.propertyImages.length !== 0 ? `data:image/jpeg;base64,${base64.encodeFromByteArray(chat.propertyListing.propertyImages[0].image.data)}` : null}
                    />
                )) : null}
            </ScrollView>
            <ChatModal isVisible={isModalVisible} onClose={toggleModal} onFilter={handleFilterPress} />
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        // backgroundColor: 'transparent'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 30,
        // borderWidth:1,
        paddingEnd: 10,
        marginVertical: 10,
    },
    title: {
        fontSize: 18,
        marginHorizontal: 17,
        fontWeight: 'bold', // Add fontWeight to make the title bold
    },
    filterButton: {
        paddingHorizontal: 10,
    },
    addItem: {
        alignItems: 'center',
        // paddingEnd: 30,
        marginLeft: 300,
        marginRight: 10,
        // flex:1,
        // borderWidth:1,
        // backgroundColor: "black"
    },
    filter: {
        fontSize: 18,
        marginHorizontal: 5,
        fontWeight: 'bold', // Add fontWeight to make the title bold
        color: "blue"
    },
    filterButton: {
        paddingHorizontal: 10,
    },
});

export default SenderChat;
