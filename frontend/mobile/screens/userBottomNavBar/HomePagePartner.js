import React, {useContext, useEffect, useState} from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
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
import Swiper from 'react-native-swiper';
import {BarChart, LineChart, PieChart} from 'react-native-chart-kit';
import {fetchBuyerIdTransactions, fetchMonthlyTransactions, fetchTopTransactions} from "../../utils/transactionApi";
import {TransactionCard} from "../partnerApplication/TransactionCardSmall"
import {Divider} from '@rneui/themed';
import {BASE_URL} from "../../utils/documentApi";
import base64 from 'react-native-base64';


// Time to start fucking around with this.
const HomePagePartner = ({navigation}) => {
    const [popularProperties, setPopularProperties] = useState([]);
    const [recentlyAddedProperties, setRecentlyAddedProperties] = useState([]);
    const [topTransactions, setTopTransactions] = useState([]);
    const [monthTransactions, setMonthTransactions] = useState([]);
    const [buyerIdTransactions, setBuyerIdTransactions] = useState([]);
    const [buyerUserProfile, setBuyerUserProfile] = useState([]);
    const [topTenUserProfile, setTopTenUserProfile] = useState([])
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    const {user} = useContext(AuthContext);
    const userId = user.user.userId;
    const [canRunEffect, setCanRunEffect] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [searchTimeout, setSearchTimeout] = useState(null);
    const cardSize = Dimensions.get('window').width;

    const MyLineChart = () => {
        // Need to read the data from the transactions.
        // I need to use the summary data for each month.
        const labels = monthTransactions.length !== 0 ? monthTransactions.map(item => monthDigitToString(item.month)) : ["Jan", "Feb", "Mar", "Apr", "May", "June"];
        const dataPoints = monthTransactions.length !== 0 ? monthTransactions.map(item => item.totalOnHoldBalance) : [0,0,0,0,0,0];

        return (
            <LineChart
                data={{
                    labels: labels,
                    datasets: [{
                        data: dataPoints,
                    }]
                }}
                width={Dimensions.get('window').width - 16}  // from react-native
                height={220}
                chartConfig={{
                    backgroundColor: '#e26a00',
                    backgroundGradientFrom: '#fb8c00',
                    backgroundGradientTo: '#ffa726',
                    decimalPlaces: 2,  // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16
                    },
                    propsForDots: {
                        r: '6',
                        strokeWidth: '2',
                        stroke: '#ffa726'
                    }
                }}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16
                }}
            />
        );
    };

    const MyPieChart = () => {
        return (
            <PieChart
                data={[
                    {
                        name: 'Seoul',
                        population: 215,
                        color: 'rgba(131, 167, 234, 1)',
                        legendFontColor: '#7F7F7F',
                        legendFontSize: 15,
                    },
                    {
                        name: 'Toronto',
                        population: 280,
                        color: '#F00',
                        legendFontColor: '#7F7F7F',
                        legendFontSize: 15,
                    },
                    // ...more data
                ]}
                width={Dimensions.get('window').width - 30}
                height={220}
                chartConfig={{
                    backgroundColor: '#e26a00',
                    backgroundGradientFrom: '#fb8c00',
                    backgroundGradientTo: '#ffa726',
                    decimalPlaces: 2,  // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16
                    },
                    propsForDots: {
                        r: '6',
                        strokeWidth: '2',
                        stroke: '#ffa726'
                    }
                }}
                accessor={'population'}
                backgroundColor={'transparent'}
                paddingLeft={'10'}
                center={[10, 10]}
                absolute
            />
        );
    };

    const MyBarChart = () => {
        // Need to read the data from the transactions.
        // I need to use the summary data for each month.
        const labels = monthTransactions.length !== 0 ? monthTransactions.map(item => monthDigitToString(item.month)) : ["Jan", "Feb", "Mar", "Apr", "May", "June"];
        const dataPoints = monthTransactions.length !== 0 ? monthTransactions.map(item => item.transactionCount) : [0,0,0,0,0,0];
        return (
            <BarChart
                data={{
                    labels: labels,
                    datasets: [{
                        data: dataPoints,
                    }]
                }}
                width={Dimensions.get('window').width - 16}  // from react-native
                height={220}
                chartConfig={{
                    backgroundColor: '#e26a00',
                    backgroundGradientFrom: '#fb8c00',
                    backgroundGradientTo: '#ffa726',
                    decimalPlaces: 2,  // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16
                    },
                    barPercentage: 0.5,
                }}
                showValuesOnTopOfBars
                style={{
                    marginVertical: 8,
                    borderRadius: 16
                }}
            />
        );
    };

    const handlePropertyPress = (propertyListingId) => {
        // Navigate to the Property Listing screen with the given propertyListingId
        navigation.navigate('Property Listing', {propertyListingId});
    };

    function monthDigitToString(monthDigit) {
        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "June",
            "July", "Aug", "Sept", "Oct", "Nov", "Dec"
        ];
        // Check if the month digit is valid (between 1 and 12)
        if (monthDigit < 1 || monthDigit > 12) {
            throw new Error("Invalid month digit. It should be between 1 and 12.");
        }
        // Return the month name. Subtract 1 because arrays are 0-indexed.
        return monthNames[monthDigit - 1];
    }


    useEffect(() => {
        loadRecentlyAddedTransactions().then(r => console.log("Finished fetching top transactions."));
        loadMonthTransctions().then(r => console.log("Finished fetching monthly transaction value data."))
        loadBuyerIdTransactions().then(r => console.log("Finished fetching Buyer ID transaction value data."))
    }, []);

    useEffect( async () => {
        await fetchData(); // Initial fetch
        const intervalId = setInterval(fetchData, 5000); // Set interval for repeated fetches
        return () => clearInterval(intervalId); // Cleanup function to clear the interval
    }, []);

    // useEffect(() => {
    //     setBuyerIdTransactions(buyerIdTransactions)
    //     console.log("Buyer ID transaction.", buyerIdTransactions)
    // }, [buyerIdTransactions])
    //
    // useEffect(() => {
    //     setMonthTransactions(monthTransactions)
    //     console.log("Month Transactions. ", monthTransactions)
    // }, [monthTransactions])
    //
    // useEffect(() => {
    //     setTopTransactions(topTransactions)
    //     console.log("Top Transactions. ", topTransactions)
    // }, [topTransactions])
    //
    // useEffect(() => {
    //     setBuyerUserProfile(buyerUserProfile)
    //     console.log("Buyer Profile. ", buyerUserProfile)
    // }, [buyerUserProfile])
    //
    // useEffect(() => {
    //     setTopTenUserProfile(topTenUserProfile)
    //     console.log("Ten user profile. ", topTenUserProfile)
    // }, [topTenUserProfile])


    useFocusEffect(
        React.useCallback(() => {
            console.log('Home page gained focus');
            loadRecentlyAddedTransactions().then(r => console.log("Finish reloading recent transactions."))
            loadMonthTransctions().then(r => console.log("Finished fetching monthly transaction value data."))
            loadBuyerIdTransactions().then(r => console.log("Finished fetching Buyer ID transaction value data."))
            setSearchQuery('');
        }, [])
    );

    const fetchData = async () => {
        const recentAddedTransactions = await loadRecentlyAddedTransactions();
        console.log("Finished fetching top transactions.", topTransactions);
        const loadMonth = await loadMonthTransctions();
        console.log("Finished fetching monthly transaction value data.", monthTransactions);
        const buyerId = await loadBuyerIdTransactions();
        console.log("Finished fetching Buyer ID transaction value data.", buyerIdTransactions);
    };

    const loadRecentlyAddedTransactions = async () => {
        try {
            const topTransactionsRecv = await fetchTopTransactions(userId)
            setTopTransactions(topTransactionsRecv.transactions)
            console.log("Here are the top ten transactions. ", topTransactions)
            const usersInvolved = await fetchAllTopTen(topTransactionsRecv.transactions.map(item => item.buyerId))
            const mergedData = topTransactionsRecv.transactions.map((transaction, index) => ({
                transaction: transaction,
                userDetails: usersInvolved[index]
            }));
            setTopTenUserProfile(mergedData);
            console.log("Here are the ten user profiles: ", topTenUserProfile)
        } catch (error) {
            console.error("Error fetching top ten transactions: ", error)
        }
    }

    const loadMonthTransctions = async () => {
        try {
            const monthTransaction = await fetchMonthlyTransactions(userId);
            setMonthTransactions(monthTransaction.transactions)
            console.log("Here are the monthly values: ", monthTransactions)
        } catch (error) {
            console.error("Error fetching monthly transactions: ", error);
        }
    }

    const loadBuyerIdTransactions = async() => {
        try {
            const buyerTransactions = await fetchBuyerIdTransactions(userId);
            setBuyerIdTransactions(buyerTransactions.transactions)
            console.log("Here are the buyerId values: ", buyerIdTransactions)
            const usersInvolved = await fetchAllBuyers(buyerTransactions.transactions.map(item=>item.buyerId))
            setBuyerUserProfile(usersInvolved);
            console.log("Here are the buyer profiles: ", buyerUserProfile)
        } catch (error) {
            console.error("Error fetching buyerId transactions: ", error);
        }
    }

    const loadBuyerProfiles = async() => {
        try {
            const usersInvolved = await fetchAllBuyers(buyerIdTransactions.transactions.map(item=>item.buyerId))
            setBuyerUserProfile(usersInvolved);
            console.log("Here are the buyer profiles: ", buyerUserProfile)
        } catch (error) {
            console.error("Error fetching buyer profiles.")
        }
    }

    async function fetchUserById(id) {
        return fetch(`${BASE_URL}/user/${id}`).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(`Failed to fetch user with id: ${id}`);
            }
        });
    }

    async function fetchAllBuyers(buyerIds) {
        try {
            const users = [];
            for (let id of buyerIds) {
                const user = await fetchUserById(id);
                users.push(user);
            }
            return users;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    async function fetchAllTopTen(buyerIds) {
        try {
            const users = [];
            for (let id of buyerIds) {
                const user = await fetchUserById(id);
                users.push(user);
            }
            return users;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
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

    const ImageSwiper = () => {
        const images = [
            require('../../assets/Home-Image.jpeg'),
            require('../../assets/Buying-Home.jpg'),
            require('../../assets/HDB-Flats-Near-MRT.jpg'),
            // Add more image paths as needed
        ];

        return (
            <View style={styles.swiperContainer}>
                <Swiper
                    showsButtons={false} loop={true} autoplay={true} autoplayTimeout={5}
                >
                    {images.map((image, index) => (
                        <View key={index}>
                            <Image source={image} style={styles.swiperImage}/>
                        </View>
                    ))}
                </Swiper>
            </View>
        );
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
            <View style={{paddingHorizontal: 10, paddingTop: 10}}>
                <Text style={styles.sectionTitle}> Howard and Co LLP. </Text>
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

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF"/>
                </View>
            ) : (
                <>
                    {/* Total Earnings Section */}
                    <View style={styles.sectionContainer}>
                        <TouchableOpacity onPress={() => handleTitlePress('Popular Properties', popularProperties)}>
                            <View style={[styles.titleContainer, {marginTop: 10}]}>
                                <Text style={styles.sectionTitle}> {' '}<Ionicons name="trending-up-outline" size={24}
                                                                                  style={styles.titleIcon}/>
                                    {' '}Total Earnings </Text>
                            </View>
                            <MyLineChart/>
                        </TouchableOpacity>

                    </View>

                    {/* Customer/Request Section */}
                    <View style={styles.sectionContainer}>
                        <TouchableOpacity
                            onPress={() => handleTitlePress('Recently Added Properties', recentlyAddedProperties)}>
                            <View style={styles.titleContainer}>
                                <Text style={styles.sectionTitle}> {' '}<Ionicons name="time-outline" size={24}
                                                                                  style={styles.titleIcon}/>
                                    {' '}Total Customers </Text>
                            </View>
                        </TouchableOpacity>
                        < MyPieChart/>
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
                        <MyBarChart/>
                    </View>

                    {/*Regions Section */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}> {' '}<Ionicons name="navigate-circle-outline" size={24}
                                                                          style={styles.titleIcon}/>
                            {' '}Recent Transactions </Text>
                        <Divider/>
                        {topTenUserProfile.map((transactions, userDetails) => (
                            <TouchableOpacity
                                style={[styles.card, {width: cardSize * 0.92, height: cardSize * 0.25}]}
                                onPress={() => {
                                    navigation.navigate("")
                                }}
                            >
                                    <View style={styles.profileHeader}>
                                        {false ? (
                                            <Image
                                                source={{uri: `data:image/jpeg;base64,${convertImage(userDetails.profileImage.data)}`}}
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
                                    <Text style={styles.propertyTitle}>{transactions.transaction.status}</Text>
                                    <Text style={styles.propertyPrice}>{transactions.transaction.onHoldBalance}</Text>
                                    {/*<Text style={styles.propertyPrice}>{userDetails.userDetails.userName}</Text>*/}
                                    <Text style={styles.propertyDetails}>{dateFormatter(transactions.transaction.createdAt)}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
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
        marginBottom: 10,
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
        marginTop: 10,
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