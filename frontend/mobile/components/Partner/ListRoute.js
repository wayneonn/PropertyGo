import React, {useState} from "react";
import {Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {convertImage, dateFormatter} from "../../services/commonFunctions";
import {RatingComponent} from "../RatingStars";
import {LoadingIndicator} from "../LoadingIndicator";

export const LawyerRoute = ({lawyers, selectedLawyer, setSelectedLawyer}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const filteredLawyers = lawyers.filter(
        lawyer => lawyer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const [modalVisible, setModalVisible] = useState(false)
    return (
        <ScrollView>
            <View style={{padding: 10, marginLeft: 10, flexDirection: "row", alignItems: "center"}}>
                <Icon name="search" size={20} color="#000" style={styles.searchIcon} />
                <TextInput
                    style={{height: 40, borderColor: 'gray', borderWidth: 1, paddingLeft: 8, width: cardSize*0.8}}
                    placeholder="Search for a lawyer..."
                    value={searchQuery}
                    onChangeText={text => setSearchQuery(text)}
                />
            </View>
            <View style={[styles.scene, {backgroundColor: '#f3f3f3'}]}>
                {filteredLawyers.length !== 0 ? filteredLawyers.map((item) => (
                    <TouchableOpacity
                        style={[styles.card, {width: cardSize * 0.92, height: cardSize * 0.28}]}
                        onPress={() => {
                            setSelectedLawyer(item);
                            setModalVisible(true);
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
                                    style={{width: 50, height: 50, borderRadius: 120}}
                                />
                            )}
                        </View>
                        <View style={styles.propertyDetails}>
                            <Text style={styles.propertyTitle}>{item.name}</Text>
                            <Text style={styles.propertyPrice}>Ratings: <RatingComponent rating={item.rating}/>
                            </Text>
                            <Text style={styles.propertyPrice}>Experience: {item.experience}</Text>
                            <Text style={styles.propertyPrice}>E-Mail: {item.email}</Text>
                            <Text style={styles.propertyDetails}>{dateFormatter(item.createdAt)}</Text>
                        </View>
                    </TouchableOpacity>
                )) : <LoadingIndicator/>}
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        {/* Render more details about the selectedTransaction */}
                        <Text style={styles.propertyTitle}>{selectedLawyer?.name}</Text>
                        <Text style={styles.propertyTitle}>{selectedLawyer?.companyName}</Text>
                        <Text style={styles.propertyPrice}><RatingComponent rating={selectedLawyer?.rating}/></Text>
                        <Image
                            source={require('../../assets/Default-Profile-Picture-Icon.png')} // Provide a default image source
                            style={{width: 50, height: 50, borderRadius: 120}}
                        />
                        <Text style={styles.propertyPrice}>{selectedLawyer?.userName}</Text>
                        <Text style={styles.propertyDetails}>Project
                            Completed: {selectedLawyer?.projectsCompleted}</Text>
                        <Text style={styles.propertyDetails}>{dateFormatter(selectedLawyer?.createdAt)}</Text>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => navigation.navigate("Chats")}
                        >
                            <Text style={styles.textStyle}>Chat With Lawyer</Text>
                        </TouchableOpacity>
                        <Text>&nbsp;</Text>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Text style={styles.textStyle}>Hide</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

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
    searchIcon: {
        marginRight: 10, // Adjust the margin as needed
        color: "#ccc",
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