import React, {memo, useContext, useEffect, useState} from 'react';
import {
    Dimensions,
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text, TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator, Button
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {AuthContext} from "../../AuthContext";
import {fetchImages, fetchPartnerByRangeAndType} from "../../utils/partnerApi";
import {useFocusEffect} from "@react-navigation/native";
import {SceneMap, TabBar, TabView} from "react-native-tab-view";
import {dateFormatter, convertImage} from "../../services/commonFunctions";
import {RatingComponent} from "../../components/RatingStars";
import {LoadingIndicator} from "../../components/LoadingIndicator";
import {ImageSwiper} from "../../components/ImageSwiper";
import {BoostingAnimation} from "../../components/BoostingAnimation"
import {RadioCheckBox} from "../../components/Partner/RadioCheckBox";
import { CheckBox } from 'react-native-elements';
import {createChat} from "../../utils/chatApi";
import ContractorModal from "../../components/Partner/ContractorModal";
import LawyerModal from "../../components/Partner/LawyerModal";



const cardSize = Dimensions.get('window').width;
const MyInput = memo(({ value, onChangeText }) => {
    return (
        <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1, paddingLeft: 8}}
            placeholder="Search for a contractor..."
            value={value}
            onChangeText={onChangeText}
        />
    );
});

// Editing the explore services to show the different partner.
const ExploreServices = ({navigation, route}) => {
    const {user} = useContext(AuthContext);
    const USER_ID = user.user.userId
    const [lawyers, setLawyers] = useState([])
    const [contractor, setContractor] = useState([])
    const [start, setStart] = useState(1)
    const [end, setEnd] = useState(5)
    const [selectedLawyer, setSelectedLawyer] = useState(null)
    const [selectedContractor, setSelectedContractor] = useState(null)
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'lawyer', title: 'Lawyer' },
        { key: 'contractor', title: 'Contractor' },
    ]);
    const USER_TYPE = ["LAWYER", "CONTRACTOR"]
    const [modalVisible, setModalVisible] = useState(false)
    const [searchQueryLaw, setSearchQueryLaw] = useState('');
    const [searchQueryCon, setSearchQueryCon] = useState('');
    const [filterByLaw, setFilterByLaw] = useState('name');
    const [filterBy, setFilterBy] = useState('name');
    const names = ['Name', 'Company', 'Username' ]
    const images = [
        require("../../assets/partnerpic-1.png"),
        require("../../assets/partnerpic-2.png"),
        require("../../assets/partnerpic-3.png"),
        require("../../assets/partnerpic-4.png")
    ]
    const [modalImage, setModalImage] = useState([])

    useFocusEffect(
        React.useCallback(() => {
            console.log('Explore Services gained focus');
            fetchLawyers().then(r => console.log("Fetched lawyer."));
            fetchContractors().then(r => console.log("Fetch contractor."));
        }, [])
    );

    useEffect(() => {
        fetchLawyers().then(r => console.log("Fetched lawyer."));
        fetchContractors().then(r => console.log("Fetch contractor."));
        console.log("Data fetched.")
    }, []);

    const fetchLawyers = async() => {
        try {
            const lawyers = await fetchPartnerByRangeAndType(USER_TYPE[0], start, end)
            setLawyers(lawyers.partnerInfo)
            console.log("Found lawyers: ", lawyers)
        } catch (error) {
            console.error("Error fetching lawyers: ", error)
        }
    }

    const fetchContractors = async() => {
        try {
            const contractor = await fetchPartnerByRangeAndType(USER_TYPE[1], start, end)
            setContractor(contractor.partnerInfo)
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

    const handleChatWithLawyer = async () => {
        const chatData = {
            propertyId: 1,
            receiverId: selectedLawyer?.userId
        }
        const data = await createChat(user.user.userId, chatData);
        console.log(data.chatId)
        setModalVisible(!modalVisible);
        navigation.navigate("Message Partner", { chatId: data.chatId });
    }

    const handleChatWithContractor = async () => {
        const chatData = {
            propertyId: 1,
            receiverId: selectedContractor?.userId
        }
        const data = await createChat(user.user.userId, chatData);
        console.log(data.chatId)
        setModalVisible(!modalVisible);
        navigation.navigate("Message Partner", { chatId: data.chatId });
    }

    // Needs to have a more detailed and intricate sorting function.
    const filteredLawyers = lawyers.filter(lawyer => {
        switch(filterByLaw) {
            case 'Name':
                return lawyer.name.toLowerCase().includes(searchQueryLaw.toLowerCase());
            case 'Company':
                return lawyer.companyName.toLowerCase().includes(searchQueryLaw.toLowerCase());
            case 'Username':
                return lawyer.userName.toLowerCase().includes(searchQueryLaw.toLowerCase());
            default:
                return true;
        }
    }).sort((a, b) => {
        const currentDate = new Date();
        const aBoostEndDate = new Date(a.boostListingEndDate);
        const bBoostEndDate = new Date(b.boostListingEndDate);

        // Check if boostEndDate is valid and hasn't expired for both
        const aHasBoost = aBoostEndDate && aBoostEndDate > currentDate;
        const bHasBoost = bBoostEndDate && bBoostEndDate > currentDate;

        // Prioritize entries with a valid and non-expired boostEndDate
        if (aHasBoost && !bHasBoost) return -1;
        if (!aHasBoost && bHasBoost) return 1;

        // If both have the same boostEndDate status or both don't have a valid boostEndDate, maintain their relative order
        return 0;
    });

    const filteredContractors = contractor.filter(lawyer => {
        switch(filterBy) {
            case 'Name':
                return lawyer.name.toLowerCase().includes(searchQueryCon.toLowerCase());
            case 'Company':
                return lawyer.companyName.toLowerCase().includes(searchQueryCon.toLowerCase());
            case 'Username':
                return lawyer.userName.toLowerCase().includes(searchQueryCon.toLowerCase());
            default:
                return true;
        }
    }).sort((a, b) => {
        const currentDate = new Date();
        const aBoostEndDate = new Date(a.boostListingEndDate);
        const bBoostEndDate = new Date(b.boostListingEndDate);

        // Check if boostEndDate is valid and hasn't expired for both
        const aHasBoost = aBoostEndDate && aBoostEndDate > currentDate;
        const bHasBoost = bBoostEndDate && bBoostEndDate > currentDate;

        // Prioritize entries with a valid and non-expired boostEndDate
        if (aHasBoost && !bHasBoost) return -1;
        if (!aHasBoost && bHasBoost) return 1;

        // If both have the same boostEndDate status or both don't have a valid boostEndDate, maintain their relative order
        return 0;
    });

    function truncateString(str, num) {
        if (str.length > num) {
            return str.slice(0, num) + '...';
        } else {
            return str;
        }
    }


    const LawyerRoute = () => {
        return (
            <ScrollView>
                <View>
                    <RadioCheckBox filterBy={filterByLaw} setFilterBy={setFilterByLaw} names={names}/>
                </View>
                <View style={{padding: 10, marginLeft: 10, flexDirection: "row", alignItems: "center"}}>
                    <Icon name="search" size={20} color="#000" style={styles.searchIcon} />
                    <TextInput
                        style={{height: 40, borderColor: 'gray', borderWidth: 1, paddingLeft: 8, width: cardSize*0.8}}
                        placeholder="Search for a lawyer..."
                        value={searchQueryLaw}
                        onChangeText={text => {
                            setSearchQueryLaw(text)
                        }
                    }
                    />
                </View>
                <View style={[styles.scene, {backgroundColor: '#f3f3f3'}]}>
                    {filteredLawyers.length !== 0 ? filteredLawyers.map((item) => (
                        <TouchableOpacity
                            style={[styles.card, {width: cardSize * 0.92, height: cardSize * 0.28}]}
                            onPress={() => {
                                setSelectedLawyer(item);
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
                <LawyerModal modalImage={modalImage} modalVisible={modalVisible} setModalVisible={setModalVisible} handleChatWithLawyer={handleChatWithLawyer} selectedLawyer={selectedLawyer}/>
            </ScrollView>
        );
    }

    const ContractorRoute = () => {
        return (
            <ScrollView>
                <RadioCheckBox filterBy={filterBy} setFilterBy={setFilterBy} names={names}/>
                <View style={[styles.scene, {backgroundColor: '#f3f3f3'}]}>
                    <View style={{padding: 10, flexDirection: "row", alignItems: "center"}}>
                        <Icon name="search" size={20} color="#000" style={styles.searchIcon} />
                        <TextInput
                            style={{height: 40, borderColor: 'gray', borderWidth: 1, paddingLeft: 8, width: cardSize*0.8}}
                            placeholder="Search for a contractor..."
                            value={searchQueryCon}
                            onChangeText={text => setSearchQueryCon(text)}
                        />
                    </View>
                    {filteredContractors.length !== 0 ? filteredContractors.map((item) => (
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
                                    />
                                ) : (
                                    <Image
                                        source={require('../../assets/Default-Profile-Picture-Icon.png')} // Provide a default image source
                                        style={styles.profileImage}
                                    />
                                )}
                            </View>
                            <View style={styles.propertyDetails}>
                                <Text style={styles.propertyTitle}>{item.name}</Text>
                                {/*<Text style={styles.propertyPrice}>Ratings: <RatingComponent*/}
                                {/*    rating={item.rating}/></Text>*/}
                                <Text style={styles.propertyPrice}>Experience: {item.experience}</Text>
                                <Text style={styles.propertyPrice}>E-Mail: {truncateString(item.email, 17)}</Text>
                                <Text style={styles.propertyDetails}>{dateFormatter(item.createdAt)}</Text>
                            </View>
                            {new Date(item.boostListingEndDate) >= new Date() ? (
                                <BoostingAnimation/>
                            ) : <Text> &nbsp;&nbsp; </Text>}
                        </TouchableOpacity>
                    )) : <LoadingIndicator/>}
                </View>
                <ContractorModal handleChatWithContractor={handleChatWithContractor} modalImage={modalImage} modalVisible={modalVisible} setModalVisible={setModalVisible} selectedContractor={selectedContractor}/>
            </ScrollView>
        );
    }


    return (
        <View style={{flex: 1}}>
            <ImageSwiper images_new={images}></ImageSwiper>
            <TabView
                navigationState={{ index, routes }}
                renderScene={SceneMap({
                    lawyer: LawyerRoute,
                    contractor: ContractorRoute,
                })}
                onIndexChange={setIndex}
                initialLayout={{ height: 30 }}
                renderTabBar={props => (
                    <TabBar
                        {...props}
                        indicatorStyle={{ backgroundColor: 'white' }}
                        style={{ backgroundColor: '#888' }}
                    />
                )}
            />
        </View>
    );
};

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
        shadowOffset: { width: 0, height: 2 },
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


export default ExploreServices;

