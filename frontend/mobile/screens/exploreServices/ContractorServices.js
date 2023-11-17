import {
    Dimensions,
    Image,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {RadioCheckBox} from "../../components/Partner/RadioCheckBox";
import {convertImage, dateFormatter, truncateString} from "../../services/commonFunctions";
import {BoostingAnimation} from "../../components/BoostingAnimation";
import {LoadingIndicator} from "../../components/LoadingIndicator";
import ContractorModal from "../../components/Partner/ContractorModal";
import React, {useCallback, useContext, useState} from "react";
import SearchBar from "../../components/Forum/SearchBar";
import {useFocusEffect} from "@react-navigation/native";
import {fetchImages, fetchPartnerByRangeAndType} from "../../utils/partnerApi";
import {createChat} from "../../utils/chatApi";
import {AuthContext} from "../../AuthContext";

const cardSize = Dimensions.get('window').width;
const ContractorServices = ({navigation}) => {
    const {user} = useContext(AuthContext);
    const USER_ID = user.user.userId
    const names = ['Name', 'Company', 'Username']
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [start, setStart] = useState(1)
    const [end, setEnd] = useState(5)
    const USER_TYPE = ["LAWYER", "CONTRACTOR"]
    const [contractor, setContractor] = useState([])
    const [filteredContractor, setFilteredContractor] = useState([])
    const [selectedContractor, setSelectedContractor] = useState(null)
    const [filter, setFilter] = useState(null);
    const [filterBy, setFilterBy] = useState('name');
    const [modalVisible, setModalVisible] = useState(false)
    const images = [
        require("../../assets/partnerpic-1.png"),
        require("../../assets/partnerpic-2.png"),
        require("../../assets/partnerpic-3.png"),
        require("../../assets/partnerpic-4.png")
    ]
    const [modalImage, setModalImage] = useState([])

    const useParentCallback = useCallback(() => {
        console.log('Explore Services gained focus');
        fetchContractors().then(r => console.log("Fetch contractor."));
    }, [])

    useFocusEffect(useParentCallback);

    const handleRefresh = async () => {
        setRefreshing(true);
        useParentCallback();
        setRefreshing(false);
    };

    const fetchContractors = async() => {
        try {
            const contractor = await fetchPartnerByRangeAndType(USER_TYPE[1], start, end)
            setContractor(contractor.partnerInfo)
            setFilteredContractor(contractor.partnerInfo)
            console.log("Found contractors: ", contractor)
        } catch (error) {
            console.error("Error fetching contractor: ", error)
        }
    }

    const fetchProfileImages = async(USER_ID) => {
        try {
            const fetchedImages = await fetchImages(USER_ID);
            setModalImage(fetchedImages);
            setModalVisible(!modalVisible);
        } catch (error) {
            console.error(error)
        }
    }

    const handleChatWithContractor = async () => {
        const chatData = {
            propertyId: 1,
            receiverId: selectedContractor?.userId
        }
        console.log(selectedContractor)
        const data = await createChat(user.user.userId, chatData);
        console.log(data.chatId)
        setModalVisible(!modalVisible);
        navigation.navigate("Message Partner", { chatId: data.chatId });
    }

    const handleSearch = (text) => {
        setFilter(null);

        const filtered = contractor.filter((item) => {
            let propertyToFilter = '';

            switch (filterBy) {
                case 'Company':
                    propertyToFilter = item.companyName;
                    break;
                case 'Name':
                    propertyToFilter = item.name;
                    break;
                case 'Username':
                    propertyToFilter = item.userName;
                    break;
                default:
                    propertyToFilter = item.companyName; // Fallback property
            }

            return propertyToFilter.toLowerCase().includes(text.toLowerCase());
        });
        // // console.log("text :" + text)

        if (text === "") {
            setFilteredContractor(contractor);
        } else {
            setFilteredContractor(filtered);
        }

        setSearchQuery(text);
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
                <View style={{flexDirection: "row"}}>
                    <Text>&nbsp;&nbsp;</Text>
                    <RadioCheckBox filterBy={filterBy} setFilterBy={setFilterBy} names={names}/>
                </View>
                <Text>&nbsp;</Text>
                <SearchBar handleSearch={handleSearch} searchQuery={searchQuery}/>
                <View style={[styles.scene, {backgroundColor: '#f3f3f3'}]}>
                    {filteredContractor.length !== 0 ? filteredContractor.map((item) => (
                        <TouchableOpacity
                            style={[styles.card, {width: cardSize * 0.92, height: cardSize * 0.28}]}
                            onPress={() => {
                                setSelectedContractor(item);
                                fetchProfileImages(item.userId).then(r => console.log("Finished fetching."))
                            }}
                        >
                            <View style={styles.profileHeader}>
                                {item.profileImage !== null ? (
                                    <Image
                                        source={{uri: `data:image/jpeg;base64,${convertImage(item.profileImage.data)}`}}
                                        style={styles.profileImage}
                                        resizeMode="contain"
                                    />
                                ) : (
                                    <Image
                                        source={require('../../assets/Default-Profile-Picture-Icon.png')} // Provide a default image source
                                        style={styles.profileImage}
                                        resizeMode="contain"
                                    />
                                )}
                            </View>
                            <View style={styles.propertyDetails}>
                                <Text style={styles.propertyTitle}>{item.name}</Text>
                                {/*<Text style={styles.propertyPrice}>Ratings: <RatingComponent rating={item.rating}/>*/}
                                {/*</Text>*/}
                                <Text style={styles.propertyPrice}>Experience: {item.experience}</Text>
                                <Text style={styles.propertyPrice}>E-Mail: {truncateString(item.email, 17)}</Text>
                                <Text style={styles.propertyDetails}>{dateFormatter(item.createdAt)}</Text>
                            </View>
                            {new Date(item.boostListingEndDate) >= new Date() ? (
                                <BoostingAnimation/>
                            ) : <Text> &nbsp; &nbsp; </Text>}
                        </TouchableOpacity>
                    )) : <LoadingIndicator/>}
                </View>
                <ContractorModal modalImage={modalImage} modalVisible={modalVisible} setModalVisible={setModalVisible}
                             handleChatWithContractor={handleChatWithContractor} selectedContractor={selectedContractor} navigation={navigation}/>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'space-between',
        backgroundColor: '#F8F8F8', // Light background
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 30, // Circular images
        alignSelf: "center",
        borderWidth: 1,
        borderColor: '#DDD', // Subtle border for images,
    },
    card: {
        backgroundColor: '#FFFFFF', // White card background
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: "center",
        alignContent: "center",
        flexDirection: "row",
        marginVertical: 10, // Increased spacing
        padding: 15, // Inner spacing
        borderRadius: 15, // Rounded corners
        borderWidth: 1,
        borderColor: '#E8E8E8', // Soft border color
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    profileHeader: {
        paddingHorizontal: 10,
    },
    propertyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333', // Dark text for readability
    },
    propertyDetails: {
        fontStyle: "italic",
        color: '#666', // Soften the color for details
    },
    propertyPrice: {
        fontSize: 16,
        color: '#888',
    },
    searchIcon: {
        marginRight: 10,
        color: "#666", // Consistent icon color
    },
    suggestionsOverlay: {
        position: 'absolute',
        top: 50,
        left: 8,
        right: 0,
        zIndex: 1,
        width: '95%',
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: 5,
        marginBottom: 10,
        alignSelf: 'center',
        elevation: 5,
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    noResultsContainer: {
        alignItems: 'center',
        position: 'absolute',
        top: 50,
        left: 8,
        right: 0,
        zIndex: 1,
        width: '95%',
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: 5,
        marginBottom: 10,
        alignSelf: 'center',
        elevation: 5,
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.8,
        shadowRadius: 2,
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
        padding: 10,
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
        borderRadius: 25,
        padding: 12,
        elevation: 3,
        backgroundColor: "#007BFF", // Bright color for buttons
    },
    buttonClose: {
        backgroundColor: "#28A745", // Different color for close or secondary action
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 16,
    }
});

export default ContractorServices;
