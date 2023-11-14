import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
    Dimensions,
    Image,
    RefreshControl,
    SafeAreaView,
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
    fetchAverageCountryCount,
    fetchAverageTransactionCount,
    fetchBuyerIdTransactions,
    fetchMonthlyTransactions,
    fetchTopTransactionsWithUsers,
    fetchTransactionCountryCount
} from "../../utils/transactionApi";
import {TransactionCard} from "../partnerApplication/TransactionCardSmall"
import TransactionItemSmall from "../../components/Partner/TransactionItemSmall"
import {Divider} from '@rneui/themed';
import {ImageSwiper} from "../../components/ImageSwiper";
import {BoostingAnimation} from "../../components/BoostingAnimation";
import {MyLineChart} from "../../components/Partner/LineChart";
import {TransactionChart} from "../../components/Partner/TransactionChart";
import {MyPieChart} from "../../components/Partner/PieChart";
import {LoadingIndicator} from "../../components/LoadingIndicator";
import {PartnerCardModal} from "../../components/Partner/PartnerCardModal";
import {fetchImages} from "../../utils/partnerApi";
import {CardDivider} from "@rneui/base/dist/Card/Card.Divider";


const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// Time to start fucking around with this. I am going to add the refresh function.
const HomePagePartner = ({navigation}) => {
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
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [modalImage, setModalImage] = useState([])
    const [refreshing, setRefreshing] = useState(false);

    // const handlePropertyPress = (propertyListingId) => {
    //     // Navigate to the Property Listing screen with the given propertyListingId
    //     navigation.navigate('Property Listing', {propertyListingId});
    // };


    useEffect(() => {
        loadRecentlyAddedTransactions().then(r => console.log("Finished fetching top transactions."));
        loadMonthTransactions().then(r => console.log("Finished fetching monthly transaction value data."))
        loadBuyerIdTransactions().then(r => console.log("Finished fetching Buyer ID transaction value data."))
        loadTransactionCountryCount()
        loadAverageTransactionValue()
        loadAverageTransactionCount()
        loadProfileImages(userId)
    }, []);

    const useParentCallback = useCallback(() => {
        console.log('Home page gained focus');
        loadRecentlyAddedTransactions().then(r => console.log("Finish reloading recent transactions."))
        loadMonthTransactions().then(r => console.log("Finished fetching monthly transaction value data."))
        loadBuyerIdTransactions().then(r => console.log("Finished fetching Buyer ID transaction value data."))
        loadTransactionCountryCount()
        loadAverageTransactionValue()
        loadAverageTransactionCount()
        loadProfileImages(userId)
        setSearchQuery('');
    }, []);

    useFocusEffect(useParentCallback);

    const handleRefresh = async () => {
        setRefreshing(true);
        useParentCallback();
        setRefreshing(false);
    };

    // const fetchData = async () => {
    //     const recentAddedTransactions = await loadRecentlyAddedTransactions();
    //     // console.log("Finished fetching top transactions.", topTransactions);
    //     const loadMonth = await loadMonthTransactions();
    //     // console.log("Finished fetching monthly transaction value data.", monthTransactions);
    //     const buyerId = await loadBuyerIdTransactions();
    //     // console.log("Finished fetching Buyer ID transaction value data.", buyerIdTransactions);
    //     const count = await loadTransactionCountryCount();
    //     const avg = await loadAverageTransactionValue();
    //     const count_transaction = await loadAverageTransactionCount();
    // };

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

    const loadBuyerIdTransactions = async () => {
        try {
            const buyerTransactions = await fetchBuyerIdTransactions(userId);
            setBuyerIdTransactions(buyerTransactions.transactions)
            // console.log("Here are the buyerId values: ", buyerIdTransactions)
        } catch (error) {
            console.error("Error fetching buyerId transactions: ", error);
        }
    }

    const loadTransactionCountryCount = async () => {
        try {
            const buyerTransactions = await fetchTransactionCountryCount(userId);
            setTransactionCountryCount(buyerTransactions.buyer)
            // console.log("Here are the transaction counts: ", transactionCountryCount)
        } catch (error) {
            console.error("Error fetching transaction counts: ", error);
        }
    }

    const loadAverageTransactionValue = async () => {
        try {
            const average = await fetchAverageCountryCount()
            setAverageTransactions(average.data)
            console.log("Here are the avg. counts: ", averageTransactions)
        } catch (error) {
            console.error("Error fetching avg. transaction counts: ", error);
        }
    }

    const loadAverageTransactionCount = async () => {
        try {
            const count = await fetchAverageTransactionCount()
            setCountTransactions(count.data)
            console.log("Here are the avg. counts: ", averageTransactions)
        } catch (error) {
            console.error("Error fetching avg. transaction counts: ", error);
        }
    }

    const loadProfileImages = async (USER_ID) => {
        try {
            const fetchedImages = await fetchImages(USER_ID);
            setModalImage(fetchedImages);
        } catch (error) {
            console.log("Cannot fetch profile listings. ", error)
        }
    }

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

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    tintColor={'#FFD700'}
                />
            }>
                <View style={{
                    paddingHorizontal: 10,
                    paddingTop: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
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

                <ImageSwiper images_new={modalImage}/>
                <TouchableOpacity style={styles.saveChangesButton} onPress={() => navigation.navigate("Upload Photos")}>
                    <Ionicons name="save-outline" size={18} color="white"/>
                    <Text style={styles.saveChangesButtonText}>Upload Photos</Text>
                </TouchableOpacity>
                <Text>&nbsp;</Text>
                <CardDivider/>

                {isLoading ? (
                    <LoadingIndicator/>
                ) : (
                    <>
                        {/* Total Earnings Section */}
                        <View style={styles.sectionContainer}>
                            <TouchableOpacity onPress={() => null}>
                                <View style={[styles.titleContainer, {marginTop: 10}]}>
                                    <Text style={styles.sectionTitle}> {' '}<Ionicons name="trending-up-outline"
                                                                                      size={24}
                                                                                      style={styles.titleIcon}/>
                                        {' '}Total Earnings </Text>
                                </View>
                            </TouchableOpacity>
                            <MyLineChart averageTransactions={averageTransactions} monthTransactions={monthTransactions}
                                         screenHeight={screenHeight} screenWidth={screenWidth} navigation={navigation}/>
                        </View>
                        <CardDivider/>

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
                        <CardDivider/>

                        {/* Recently Added Properties Section */}
                        <View style={styles.sectionContainer}>
                            <TouchableOpacity
                                onPress={() => handleTitlePress('Recently Added Properties', recentlyAddedProperties)}>
                                <View style={styles.titleContainer}>
                                    <Text style={styles.sectionTitle}> {' '}<Ionicons name="time-outline" size={24}
                                                                                      style={styles.titleIcon}/>
                                        {' '}Total Request </Text>
                                </View>
                            </TouchableOpacity>
                            <TransactionChart monthTransactions={monthTransactions} averageCount={countTransactions}
                                              navigation={navigation}/>
                        </View>
                        <CardDivider/>

                        {/*Recent Transactions Section */}
                        <View style={styles.sectionContainer}>
                            <TouchableOpacity
                                onPress={() => handleTitlePress('Top Transactions', topTransactions)}>
                                <Text style={styles.sectionTitle}> {' '}<Ionicons name="navigate-circle-outline"
                                                                                  size={24}
                                                                                  style={styles.titleIcon}/>
                                    {' '}Recent Request </Text>
                            </TouchableOpacity>
                            {topTenUserProfile.length !== 0 ? topTenUserProfile.map((item) => (
                                <TransactionItemSmall onPress={() => {
                                    setSelectedTransaction(item);
                                    setModalVisible(true);
                                }} item={item}/>
                            )) : <LoadingIndicator/>}
                        </View>
                        <PartnerCardModal navigation={navigation} modalVisible={modalVisible}
                                          setModalVisible={setModalVisible}
                                          selectedItem={selectedTransaction}/>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F0F0', // Light grey background
    },
    sectionContainer: {
        padding: 10, // Slightly increased padding
        backgroundColor: '#FFFFFF', // White background for sections
        marginBottom: 10, // Space between sections
        borderRadius: 8, // Rounded corners for sections
        shadowColor: '#000', // Shadow for elevation effect
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 24, // Slightly larger font size
        fontWeight: '600', // Semi-bold
        color: '#333', // Darker color for text
        marginBottom: 10,
    },
    searchBar: {
        flexDirection: 'row',
        margin: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20, // More rounded corners
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#DDD', // Light border color
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
        width: 24,
        height: 24,
    },
    saveChangesButton: {
        backgroundColor: '#3498db', // Primary color for buttons
        padding: 12,
        borderRadius: 20,
        marginTop: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: "center",
        width: '90%',
        shadowColor: '#3498db', // Matching shadow color
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 4,
    },
    saveChangesButtonText: {
        color: 'white',
        marginLeft: 10,
        fontWeight: '500', // Slightly bold
    },
    suggestionText: {
        fontSize: 16,
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
});

export default HomePagePartner;