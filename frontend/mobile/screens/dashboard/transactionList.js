import React, {useContext, useEffect, useState} from 'react';
import {Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useFocusEffect} from "@react-navigation/native";
import {fetchTopTransactionsWithUsersStatus} from "../../utils/transactionApi";
import {AuthContext} from '../../AuthContext';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import {downloadAndOpenPDF} from "../../services/pdfReport";
import {convertImage, dateFormatter} from "../../services/commonFunctions";
import {PartnerCardModal} from "../../components/Partner/PartnerCardModal";
import {LoadingIndicator} from "../../components/LoadingIndicator";
import {RadioCheckBox} from "../../components/Partner/RadioCheckBox";

const TransactionList = () => {
    const {user} = useContext(AuthContext);
    const USER_ID = user.user.userId
    const [transactionPaid, setTransactionPaid] = useState([])
    const [transactionPending, setTransactionPending] = useState([])
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        {key: 'paid', title: 'PAID'},
        {key: 'pending', title: 'PENDING'},
    ]);
    const cardSize = Dimensions.get('window').width;
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [sortCriteriaPaid, setSortCriteriaPaid] = useState('name');
    const [sortCriteriaPending, setSortCriteriaPending] = useState('name');
    const [sortOrderPaid, setSortOrderPaid] = useState('desc');
    const [sortOrderPending, setSortOrderPending] = useState('desc')


    // Fetch the needed info from the unique API's, screw having to use the frontend.
    const handleFocus = () => {
        // This code will be executed when the screen regains focus
        // You can place any logic you want to run here
        console.log('Transactions has regained focus');
        // For example, you can re-fetch data or perform any other actions
        fetchTransactionPending().then(r => console.log("Fetched pending."));
        fetchTransactionPaid().then(r => console.log("Fetch paid."));
    };

    // Wrap the handleFocus function with useFocusEffect
    useFocusEffect(
        React.useCallback(() => {
            handleFocus();
            return () => {
                // This cleanup function will be called when the component unmounts or the screen loses focus
                console.log('Screen loses focus');
                // You can perform any cleanup or unsubscribe from any listeners here
            };
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            console.log('Home page gained focus');
            fetchTransactionPending().then(r => console.log("Fetched pending."));
            fetchTransactionPaid().then(r => console.log("Fetch paid."));
        }, [])
    );

    useEffect(() => {
        fetchTransactionPending().then(r => console.log("Fetched pending."));
        fetchTransactionPaid().then(r => console.log("Fetch paid."));
        console.log("Data fetched.")
    }, []);

    // Common sorting function.
    const sortTransactions = (transactions, criteria, order) => {
        return transactions.sort((a, b) => {
            let compareA, compareB;

            switch (criteria) {
                case 'name':
                    compareA = a.userDetails.userName !== null ? a.userDetails.userName.toLowerCase() : "a";
                    compareB = b.userDetails.userName !== null ? b.userDetails.userName.toLowerCase() : "b";
                    break;
                case 'companyName':
                    compareA = a.userDetails.companyName !== null ? a.userDetails.companyName.toLowerCase() : "a";
                    compareB = b.userDetails.companyName !== null ? b.userDetails.companyName.toLowerCase() : "b";
                    break;
                case 'username':
                    compareA = a.userDetails.userName !== null ? a.userDetails.userName.toLowerCase() : "a";
                    compareB = b.userDetails.userName !== null ? b.userDetails.userName.toLowerCase() : "b";
                    break;
                default:
                    break;
            }

            if (order === 'desc') {
                return compareA > compareB ? 1 : -1;
            } else {
                return compareA < compareB ? 1 : -1;
            }
        });
    };

    const PaidRoute = () => {
        const sortedPaid = sortTransactions(transactionPaid, sortCriteriaPaid, sortOrderPaid)
        return (
            // Render your PAID array values here.
            <ScrollView>
                <View style={[styles.scene, {backgroundColor: '#f3f3f3'}]}>
                    <TouchableOpacity style={[styles.button, styles.buttonClose, {marginTop: 10, width: "80%"}]}
                                      onPress={() => {
                                          downloadAndOpenPDF(USER_ID)
                                      }}>
                        <Text style={styles.textStyle}>Create PDF Report</Text>
                    </TouchableOpacity>
                    <Text>&nbsp;</Text>
                    <RadioCheckBox filterBy={sortCriteriaPaid} setFilterBy={setSortCriteriaPaid}/>
                    {sortedPaid.length !== 0 ? sortedPaid.map((item) => (
                        <TouchableOpacity
                            style={[styles.card, {width: cardSize * 0.92, height: cardSize * 0.25}]}
                            onPress={() => {
                                setSelectedTransaction(item);
                                setModalVisible(true);
                            }}
                        >
                            <View style={styles.profileHeader}>
                                {item.userDetails.profileImage !== null ? (
                                    <Image
                                        source={{uri: `data:image/jpeg;base64,${convertImage(item.userDetails.profileImage.data)}`}}
                                        style={styles.profileImage}
                                    />
                                ) : (
                                    <Image
                                        source={require('../../assets/Default-Profile-Picture-Icon.png')} // Provide a default image source
                                        style={{width: 50, height: 50, borderRadius: 120}}
                                    />
                                )}
                            </View>
                            <View style={styles.propertyDetails}>
                                <Text style={styles.propertyTitle}>{item.transaction.status}</Text>
                                <Text style={styles.propertyPrice}>{item.transaction.onHoldBalance}</Text>
                                <Text style={styles.propertyPrice}>{item.userDetails.userName}</Text>
                                <Text style={styles.propertyDetails}>{dateFormatter(item.transaction.createdAt)}</Text>
                            </View>
                        </TouchableOpacity>
                    )) : <LoadingIndicator/>}
                </View>
                <PartnerCardModal modalVisible={modalVisible} setModalVisible={setModalVisible}
                                  selectedItem={selectedTransaction} dateFormatter={dateFormatter}/>
            </ScrollView>
        )
    };

    const PendingRoute = () => {
        const sortedPending = sortTransactions(transactionPending, sortCriteriaPending, sortOrderPending)
        return (
        // Render your PENDING array values here.
        <ScrollView>
            <View style={[styles.scene, {backgroundColor: '#f3f3f3'}]}>
                <TouchableOpacity style={[styles.button, styles.buttonClose, {marginTop: 10, width: "80%"}]}
                                  onPress={() => {
                                      downloadAndOpenPDF(USER_ID)
                                  }}>
                    <Text style={styles.textStyle}>Create PDF Report</Text>
                </TouchableOpacity>
                <Text>&nbsp;</Text>
                <RadioCheckBox filterBy={sortCriteriaPending} setFilterBy={setSortCriteriaPending}/>
                {sortedPending.length !== 0 ? sortedPending.map((item) => (
                    <TouchableOpacity
                        style={[styles.card, {width: cardSize * 0.92, height: cardSize * 0.25}]}
                        onPress={() => {
                            setSelectedTransaction(item);
                            setModalVisible(true);
                        }}
                    >
                        <View style={styles.profileHeader}>
                            {item.userDetails.profileImage !== null ? (
                                <Image
                                    source={{uri: `data:image/jpeg;base64,${convertImage(item.userDetails.profileImage.data)}`}}
                                    style={styles.profileImage}
                                />
                            ) : (
                                <Image
                                    source={require('../../assets/Default-Profile-Picture-Icon.png')} // Provide a default image source
                                    style={{width: 50, height: 50, borderRadius: 120}}
                                />
                            )}
                        </View>
                        <View style={styles.propertyDetails}>
                            <Text style={styles.propertyTitle}>{item.transaction.status}</Text>
                            <Text style={styles.propertyPrice}>{item.transaction.onHoldBalance}</Text>
                            <Text style={styles.propertyPrice}>{item.userDetails.userName}</Text>
                            <Text style={styles.propertyDetails}>{dateFormatter(item.transaction.createdAt)}</Text>
                        </View>
                    </TouchableOpacity>
                )) : <LoadingIndicator/>}
            </View>
            <PartnerCardModal modalVisible={modalVisible} setModalVisible={setModalVisible}
                              selectedItem={selectedTransaction} dateFormatter={dateFormatter}/>
        </ScrollView>
    )};

    const fetchTransactionPaid = async () => {
        try {
            const transactions = await fetchTopTransactionsWithUsersStatus(USER_ID, "PAID");
            setTransactionPaid(transactions.mergedData)
            console.log("Paid transactions: ", transactions.mergedData)
        } catch (error) {
            console.error("Error fetching transactions paid: ", error)
        }
    };

    const fetchTransactionPending = async () => {
        try {
            const transactions = await fetchTopTransactionsWithUsersStatus(USER_ID, "PENDING");
            setTransactionPending(transactions.mergedData)
            console.log("Pending transactions: ", transactions.mergedData)
        } catch (error) {
            console.error("Error fetching transactions paid: ", error)
        }
    };

    return (
        <TabView
            navigationState={{index, routes}}
            renderScene={SceneMap({
                paid: PaidRoute,
                pending: PendingRoute,
            })}
            onIndexChange={setIndex}
            initialLayout={{width: '100%'}}
            renderTabBar={props => (
                <TabBar
                    {...props}
                    indicatorStyle={{backgroundColor: 'white'}}
                    style={{backgroundColor: '#888'}}
                />
            )}
        />
    );
};

const styles = StyleSheet.create({
    scene: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    card: {
        backgroundColor: '#fff',
        alignSelf: 'center', // Center the card
        justifyContent: 'center',
        alignItems: "center",
        flexDirection: "row",
        marginVertical: 5, // A little margin top and bottom for spacing between cards
        paddingTop: 10,
        borderRadius: 10,
        borderWidth: 0.5, // Light border
        borderColor: '#ddd', // Light gray color
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 7,
        marginLeft: 10,
    },

    profileHeader: {
        paddingHorizontal: 10,
    },

    propertyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    propertyListing: {
        flexDirection: 'row',
        marginBottom: 10,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    propertyImage: {
        width: 100,
        height: 100,
        marginRight: 10,
    },
    propertyDetails: {
        flex: 1,
        fontStyle: "italic",
    },
    propertyDescription: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    propertyPrice: {
        fontSize: 14,
        color: '#888',
    },
    propertyArea: {
        fontSize: 14,
        color: '#888',
    },
    propertyRoomFeatures: {
        fontSize: 14,
        color: '#888',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleIcon: {
        marginRight: 10, // Add right margin for the icon
    },
    swiperImage: {
        width: '100%',
        height: '100%', // Adjust the height as needed
    },
    swiperContainer: {
        height: 130, // Set the desired height
        marginLeft: 15, // Add left padding
        marginRight: 15, // Add right padding
        alignSelf: 'center', // Center horizontally
    },
    suggestionsContainer: {
        width: '80%', // Take up 80% width
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: 5,
        marginBottom: 10,
        alignSelf: 'center',
        elevation: 5, // Add elevation for shadow effect (Android)
        shadowColor: 'rgba(0, 0, 0, 0.2)', // Add shadow (iOS)
        shadowOffset: {width: 0, height: 2}, // Add shadow (iOS)
        shadowOpacity: 0.8, // Add shadow (iOS)
        shadowRadius: 2, // Add shadow (iOS)
    },
    suggestionBorder: {
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: 'white', // Match background color
        height: 10,
    },
    suggestionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    suggestionItemLast: {
        borderBottomWidth: 0, // Remove border for the last item
    },
    suggestionText: {
        fontSize: 14, // Make text smaller
    },
    suggestionsOverlay: {
        position: 'absolute',
        top: 50, // Adjust the top position as needed
        left: 8,
        right: 0,
        zIndex: 1,
        width: '95%', // Take up 80% width
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: 5,
        marginBottom: 10,
        alignSelf: 'center',
        elevation: 5, // Add elevation for shadow effect (Android)
        shadowColor: 'rgba(0, 0, 0, 0.2)', // Add shadow (iOS)
        shadowOffset: {width: 0, height: 2}, // Add shadow (iOS)
        shadowOpacity: 0.8, // Add shadow (iOS)
        shadowRadius: 2, // Add shadow (iOS)
    },
    noResultsContainer: {
        alignItems: 'center',
        position: 'absolute',
        top: 50, // Adjust the top position as needed
        left: 8,
        right: 0,
        zIndex: 1,
        width: '95%', // Take up 80% width
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: 5,
        marginBottom: 10,
        alignSelf: 'center',
        elevation: 5, // Add elevation for shadow effect (Android)
        shadowColor: 'rgba(0, 0, 0, 0.2)', // Add shadow (iOS)
        shadowOffset: {width: 0, height: 2}, // Add shadow (iOS)
        shadowOpacity: 0.8, // Add shadow (iOS)
        shadowRadius: 2, // Add shadow (iOS)
    },
    noResultsText: {
        marginTop: 10,
        marginBottom: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
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
    }
});

export default TransactionList;