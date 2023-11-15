import React, { useState, useContext, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../AuthContext';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Alert,
    RefreshControl,
    Image
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import SearchBar from '../../components/Forum/SearchBar';
import ChatItem from '../../components/Chat/ChatItem';
import { getUserSenderChat } from '../../utils/chatApi';
import ChatModal from '../../components/Chat/ChatModal';
import base64 from 'react-native-base64';
import {fetchTopTransactionsWithUsersStatus} from "../../utils/transactionApi";
import {RadioCheckBox} from "../../components/Partner/RadioCheckBox";
import {convertImage, dateFormatter} from "../../services/commonFunctions";
import {LoadingIndicator} from "../../components/LoadingIndicator";
import {PartnerCardModal} from "../../components/Partner/PartnerCardModal";
import {downloadAndOpenPDF} from "../../services/pdfReport";
import TransactionItemSmall from "../../components/Partner/TransactionItemSmall";
import { MaterialIcons } from '@expo/vector-icons';

const PaidRequest = ({ navigation }) => {
    const { user } = useContext(AuthContext);
    const USER_ID = user.user.userId
    const [paidTransactions, setPaidTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [selectedTransaction, setSelectedTransaction] = useState(null)
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [filter, setFilter] = useState(null);

    const useParentCallback = useCallback(() => {
        const fetchData = async () => {
            try {
                const transactionData = await fetchTransactionPaid();
                // console.log(transactionData);
                setPaidTransactions(transactionData);
                setFilteredTransactions(transactionData);
                setSearchQuery('');
                setFilter(null);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [])

    useFocusEffect(useParentCallback);

    const fetchTransactionPaid = async () => {
        try {
            const transactions = await fetchTopTransactionsWithUsersStatus(USER_ID, "PAID");
            console.log("Paid transactions: ", transactions.mergedData)
            return transactions.mergedData
        } catch (error) {
            console.error("Error fetching transactions paid: ", error)
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        useParentCallback();
        setRefreshing(false);
    };

    const handleSearch = (text) => {
        setFilter(null);

        // Filter the chats based on the search query
        const filtered = paidTransactions.filter((item) =>
            item.userDetails.userName.toLowerCase().includes(text.toLowerCase())
        );
        // // console.log("text :" + text)

        if (text === "") {
            setFilteredTransactions(paidTransactions);
        } else {
            setFilteredTransactions(filtered);
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
                <View style={[styles.scene, {backgroundColor: '#f3f3f3'}]}>
                    <TouchableOpacity style={[styles.button, styles.buttonClose, {marginTop: 10, width: "80%", alignItems:"center", flexDirection: "row", justifyContent: "center"}]}
                                      onPress={() =>
                                          downloadAndOpenPDF(USER_ID)
                                      }>
                        <MaterialIcons name="picture-as-pdf" size={24} color="white" />
                        <Text style={styles.textStyle}>  Create PDF Report</Text>
                    </TouchableOpacity>
                    <Text>&nbsp;</Text>
                    <SearchBar searchQuery={searchQuery} handleSearch={handleSearch} />
                    {/*<RadioCheckBox filterBy={sortCriteriaPaid} setFilterBy={setSortCriteriaPaid} names={names}/>*/}
                    {filteredTransactions.length !== 0 ? filteredTransactions.map((item) => (
                        <TransactionItemSmall onPress={() => {
                            setSelectedTransaction(item);
                            setModalVisible(true);
                        }} item={item}/>
                    )) : <LoadingIndicator/>}
                </View>
            </ScrollView>
            <PartnerCardModal modalVisible={isModalVisible} setModalVisible={setModalVisible}
                              selectedItem={selectedTransaction} navigation={navigation}/>
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
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    scene: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default PaidRequest;
