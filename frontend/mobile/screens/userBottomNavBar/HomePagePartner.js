import React, {useContext, useEffect, useState} from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image, Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import {searchProperties} from '../../utils/api';
import {AuthContext} from '../../AuthContext';
import {useFocusEffect} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import {
    fetchAverageCountryCount, fetchAverageTransactionCount,
    fetchBuyerIdTransactions,
    fetchMonthlyTransactions,
    fetchTopTransactions,
    fetchTopTransactionsWithUsers,
    fetchTransactionCountryCount
} from "../../utils/transactionApi";
import {TransactionCard} from "../partnerApplication/TransactionCardSmall"
import {Divider} from '@rneui/themed';
import {BASE_URL} from "../../utils/documentApi";
import base64 from 'react-native-base64';
import {ImageSwiper} from "../../components/ImageSwiper";
import {BoostingAnimation} from "../../components/BoostingAnimation";
import {MyLineChart} from "../../components/Partner/LineChart";
import {TransactionChart} from "../../components/Partner/TransactionChart";
import {MyPieChart} from "../../components/Partner/PieChart";
import {LoadingIndicator} from "../../components/LoadingIndicator";
import {PartnerCardModal} from "../../components/Partner/PartnerCardModal";


const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// Time to start fucking around with this.
const HomePagePartner = ({navigation}) => {
    const [popularProperties, setPopularProperties] = useState([]);
    const [recentlyAddedProperties, setRecentlyAddedProperties] = useState([]);
    const [topTransactions, setTopTransactions] = useState([]);
    const [monthTransactions, setMonthTransactions] = useState([]);
    const [buyerIdTransactions, setBuyerIdTransactions] = useState([]);
    const [averageTransactions, setAverageTransactions] = useState([]);
    const [countTransactions, setCountTransactions] = useState([]);
    const [transactionCountryCount, setTransactionCountryCount] = useState([])
    const [topTenUserProfile, setTopTenUserProfile] = useState([])
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    const {user} = useContext(AuthContext);
    const userId = user.user.userId;
    const companyName = user.user.companyName
    const [canRunEffect, setCanRunEffect] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [searchTimeout, setSearchTimeout] = useState(null);
    const cardSize = Dimensions.get('window').width;
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const handlePropertyPress = (propertyListingId) => {
        // Navigate to the Property Listing screen with the given propertyListingId
        navigation.navigate('Property Listing', {propertyListingId});
    };


    useEffect(() => {
        loadRecentlyAddedTransactions().then(r => console.log("Finished fetching top transactions."));
        loadMonthTransactions().then(r => console.log("Finished fetching monthly transaction value data."))
        loadBuyerIdTransactions().then(r => console.log("Finished fetching Buyer ID transaction value data."))
        loadTransactionCountryCount()
        loadAverageTransactionValue()
        loadAverageTransactionCount()
    }, []);

    useEffect( async () => {
        await fetchData(); // Initial fetch
        const intervalId = setInterval(fetchData, 5000); // Set interval for repeated fetches
        return () => clearInterval(intervalId); // Cleanup function to clear the interval
    }, []);
    
    useFocusEffect(
        React.useCallback(() => {
            console.log('Home page gained focus');
            loadRecentlyAddedTransactions().then(r => console.log("Finish reloading recent transactions."))
            loadMonthTransactions().then(r => console.log("Finished fetching monthly transaction value data."))
            loadBuyerIdTransactions().then(r => console.log("Finished fetching Buyer ID transaction value data."))
            loadTransactionCountryCount()
            loadAverageTransactionValue()
            loadAverageTransactionCount()
            setSearchQuery('');
        }, [])
    );

    const fetchData = async () => {
        const recentAddedTransactions = await loadRecentlyAddedTransactions();
        // console.log("Finished fetching top transactions.", topTransactions);
        const loadMonth = await loadMonthTransactions();
        // console.log("Finished fetching monthly transaction value data.", monthTransactions);
        const buyerId = await loadBuyerIdTransactions();
        // console.log("Finished fetching Buyer ID transaction value data.", buyerIdTransactions);
        const count = await loadTransactionCountryCount();
        const avg = await loadAverageTransactionValue();
        const count_transaction = await loadAverageTransactionCount();
    };

    const loadRecentlyAddedTransactions = async () => {
        try {
            const topTransactionsRecv = await fetchTopTransactionsWithUsers(userId)
            setTopTenUserProfile(topTransactionsRecv.mergedData);
            // console.log("Here are the ten user profiles: ", topTenUserProfile)
        } catch (error) {
            console.error("Error fetching top ten transactions: ", error)
        }
    }

    const loadMonthTransactions = async () => {
        try {
            const monthTransaction = await fetchMonthlyTransactions(userId);
            setMonthTransactions(monthTransaction.transactions)
            // console.log("Here are the monthly values: ", monthTransactions)
        } catch (error) {
            console.error("Error fetching monthly transactions: ", error);
        }
    }

    const loadBuyerIdTransactions = async() => {
        try {
            const buyerTransactions = await fetchBuyerIdTransactions(userId);
            setBuyerIdTransactions(buyerTransactions.transactions)
            // console.log("Here are the buyerId values: ", buyerIdTransactions)
        } catch (error) {
            console.error("Error fetching buyerId transactions: ", error);
        }
    }

    const loadTransactionCountryCount = async() => {
        try {
            const buyerTransactions = await fetchTransactionCountryCount(userId);
            setTransactionCountryCount(buyerTransactions.buyer)
            // console.log("Here are the transaction counts: ", transactionCountryCount)
        } catch (error) {
            console.error("Error fetching transaction counts: ", error);
        }
    }

    const loadAverageTransactionValue = async() => {
        try {
            const average = await fetchAverageCountryCount()
            setAverageTransactions(average.data)
            console.log("Here are the avg. counts: ", averageTransactions)
        } catch (error) {
            console.error("Error fetching avg. transaction counts: ", error);
        }
    }

    const loadAverageTransactionCount = async() => {
        try {
            const count = await fetchAverageTransactionCount()
            setCountTransactions(count.data)
            console.log("Here are the avg. counts: ", averageTransactions)
        } catch (error) {
            console.error("Error fetching avg. transaction counts: ", error);
        }
    }

    const dateFormatter = (dateString) => {
        const dateObj = new Date(dateString);
        const formattedDate = dateObj.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        });
        return formattedDate;
    }

    const handleTitlePress = (title, properties) => {
        navigation.navigate('Properties List', {title: title, properties: properties, navigation: navigation});
    };


    const handleSearch = async () => {
        if (searchQuery.trim() === '') {
            return;
        }

        navigation.navigate('Search Results', {searchQuery});
    };

    const fetchSuggestions = async (query) => {
        try {
            const {success, data} = await searchProperties(query);

            if (success) {
                setSuggestions(data.slice(0, 10)); // Limit suggestions to 10 items
            } else {
                console.error('Error fetching search suggestions:', data.message);
            }
        } catch (error) {
            console.error('Error fetching search suggestions:', error.message);
        }
    };

    const handleSuggestionClick = (item) => {
        setSearchQuery(item.address);
        setSuggestions([]);
        navigation.navigate('Search Results', {searchQuery: item.address});
    };

    const handleSearchInputChange = (text) => {
        setSearchQuery(text);
        if (text.trim() === '') {
            setSuggestions([]); // Clear suggestions if text is empty
        } else {
            // Add a delay before fetching suggestions
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
            const timeout = setTimeout(() => {
                fetchSuggestions(text);
            }, 100); // Adjust the delay as needed (e.g., 500 milliseconds)
            setSearchTimeout(timeout);
        }
    };

    function convertImage(profileImage) {
        console.log("This is the data array sent in for photos: ", profileImage)
        return base64.encodeFromByteArray(profileImage);
    }

    return (
        <ScrollView style={styles.container}>
            <View style={{paddingHorizontal: 10, paddingTop: 10, flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                <Text style={styles.sectionTitle}> {companyName} </Text>
                {new Date(user.user.boostListingEndDate) >= new Date() && (
                    <>
                        <BoostingAnimation/>
                    </>
                )}
                <Divider/>
            </View>
            {/* Search bar */}
            <View style={styles.searchBar}>
                <TextInput
                    placeholder="Enter search query here...."
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={handleSearchInputChange}
                    onSubmitEditing={handleSearch} // Add this line to trigger search on Enter key press
                />
                <TouchableOpacity
                    style={styles.searchIconContainer}
                    onPress={handleSearch}
                >
                    <Image
                        source={require('../../assets/Top-Navbar-Icons/search-icon.png')}
                        style={styles.searchIcon}
                    />
                </TouchableOpacity>
            </View>

            {/* Suggestions */}
            {searchQuery.trim() !== '' ? (
                suggestions.length > 0 ? (
                    <View style={styles.suggestionsOverlay}>
                        {suggestions.slice(0, 5).map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.suggestionItem,
                                    index === suggestions.length - 1 && styles.suggestionItemLast,
                                ]}
                                onPress={() => handleSuggestionClick(item)}
                            >
                                <Text style={styles.suggestionText}>{item.address}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ) : (
                    <View style={styles.noResultsContainer}>
                        <Text style={styles.noResultsText}>No search results found</Text>
                    </View>
                )
            ) : null}

            <ImageSwiper/>
            <TouchableOpacity style={styles.saveChangesButton} onPress={() => navigation.navigate("Upload Photos")}>
                <Ionicons name="save-outline" size={18} color="white" />
                <Text style={styles.saveChangesButtonText}>Upload Photos</Text>
            </TouchableOpacity>

            {isLoading ? (
                <LoadingIndicator/>
            ) : (
                <>
                    {/* Total Earnings Section */}
                    <View style={styles.sectionContainer}>
                        <TouchableOpacity onPress={() => null}>
                            <View style={[styles.titleContainer, {marginTop: 10}]}>
                                <Text style={styles.sectionTitle}> {' '}<Ionicons name="trending-up-outline" size={24}
                                                                                  style={styles.titleIcon}/>
                                    {' '}Total Earnings </Text>
                            </View>
                        </TouchableOpacity>
                        <MyLineChart averageTransactions={averageTransactions} monthTransactions={monthTransactions} screenHeight={screenHeight} screenWidth={screenWidth} navigation={navigation}/>
                    </View>

                    {/* Customer/Request Section */}
                    <View style={styles.sectionContainer}>
                        <TouchableOpacity
                            onPress={() => handleTitlePress('Recently Added Properties', recentlyAddedProperties)}>
                            <View style={styles.titleContainer}>
                                <Text style={styles.sectionTitle}> {' '}<Ionicons name="time-outline" size={24}
                                                                                  style={styles.titleIcon}/>
                                    {' '}Customers (Recent) </Text>
                            </View>
                        </TouchableOpacity>
                        <MyPieChart transactionCountryCount={transactionCountryCount}/>
                    </View>

                    {/* Recently Added Properties Section */}
                    <View style={styles.sectionContainer}>
                        <TouchableOpacity
                            onPress={() => handleTitlePress('Recently Added Properties', recentlyAddedProperties)}>
                            <View style={styles.titleContainer}>
                                <Text style={styles.sectionTitle}> {' '}<Ionicons name="time-outline" size={24}
                                                                                  style={styles.titleIcon}/>
                                    {' '}Total Transactions </Text>
                            </View>
                        </TouchableOpacity>
                        <TransactionChart monthTransactions={monthTransactions} averageCount={countTransactions} navigation={navigation}/>
                    </View>

                    {/*Recent Transactions Section */}
                    <View style={styles.sectionContainer}>
                        <TouchableOpacity
                            onPress={() => handleTitlePress('Top Transactions', topTransactions)}>
                        <Text style={styles.sectionTitle}> {' '}<Ionicons name="navigate-circle-outline" size={24}
                                                                          style={styles.titleIcon}/>
                            {' '}Recent Transactions </Text>
                        </TouchableOpacity>
                        <Divider/>
                        {topTenUserProfile.length !== 0 ?  topTenUserProfile.map((item) => (
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
                        )) : <LoadingIndicator/> }
                    </View>
                    <PartnerCardModal navigation={navigation} modalVisible={modalVisible} setModalVisible={setModalVisible} dateFormatter={dateFormatter} selectedItem={selectedTransaction}/>
                </>
            )}
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
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
    sectionContainer: {
        padding: 10,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
        letterSpacing: 1,
    },
    rightIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchBar: {
        flexDirection: 'row',
        margin: 10,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: 'grey',
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    searchIconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
    },
    searchIcon: {
        width: 20,
        height: 20,
    },
    mainContentImage: {
        alignSelf: 'center',
        width: '90%',
        height: '15%',
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
    saveChangesButton: {
        backgroundColor: '#3498db',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center', // Center horizontally
        flexDirection: 'row',
        justifyContent: 'center', // Center vertically
        alignSelf: "center",
        width: '90%',
    },
    saveChangesButtonText: {
        color: 'white',
        marginLeft: 10,
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
    },
    noResultsText: {
        marginTop: 10,
        marginBottom: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },

});

export default HomePagePartner;