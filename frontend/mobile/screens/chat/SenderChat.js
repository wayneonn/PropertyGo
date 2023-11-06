import React, { useState, useContext, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../AuthContext';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../../components/Forum/SearchBar';
import ChatItem from '../../components/Chat/ChatItem';
import { getUserSenderChat } from '../../utils/chatApi';
import base64 from 'react-native-base64';

const SenderChat = ({ navigation }) => {

    const { user } = useContext(AuthContext);
    const [chats, setChats] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const useParentCallback = useCallback(() => {
        const fetchData = async () => {
            try {

                const chatDatas = await getUserSenderChat(user.user.userId);
                // console.log(chatDatas);
                setChats(chatDatas)
                // setSearchQuery('');
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
        // Filter the chats based on the search query
        // const filtered = chats.filter((chat) =>
        //   chat.chatName.toLowerCase().includes(text.toLowerCase())
        // );
        // // console.log("text :" + text)

        // if (text === "") {
        //   setFilteredTopics(chats);
        // } else {
        //   setFilteredTopics(filtered);
        // }

        setSearchQuery(text);
    };

    const handleChatPress = (chatId) => {
        setSearchQuery('');
        navigation.navigate("Message", { chatId });
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
                    {/* <TouchableOpacity onPress={handleFilterPress} style={styles.filterButton}>
              <AntDesign name={sort ? "arrowup" : "arrowdown"} size={20} color="black" />
            </TouchableOpacity> */}
                </View>
                <SearchBar searchQuery={searchQuery} handleSearch={handleSearch} />
                {/* <ChatItem onPress={null} /> */}
                {!(chats.length === 0) ? chats.map((chat, index) => (
                    <ChatItem
                        key={chat.chatId}
                        onPress={() => handleChatPress(chat)}
                        updatedAt={chat.updatedAt}
                        name={chat.receiver.name}
                        title={chat.propertyListing.title}
                        messageText={chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].messageText : ''}
                        replied={chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].userId === chat.receiverId : false}
                        profileImage={chat.receiver.profileImage ? `data:image/jpeg;base64,${base64.encodeFromByteArray(chat.receiver.profileImage.data)}` : null}
                        propertyImage={chat.propertyListing.propertyImages.length !== 0 ? `data:image/jpeg;base64,${base64.encodeFromByteArray(chat.propertyListing.propertyImages[0].data)}` : null}
                    />
                )) : null}
            </ScrollView>
            {/* <AddForumTopicModal isVisible={isModalVisible} onCancel={toggleModal} onSubmit={handleNewForumTopic} chats={chatsUnrestricted}/> */}
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
    }
});

export default SenderChat;
