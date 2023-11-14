import React from 'react';
import {Modal, View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import ImageSwiper from '../../components/ImageSwiper'; // Assuming you have an ImageSwiper component
import {dateFormatter} from "../../services/commonFunctions";
import { MaterialIcons } from '@expo/vector-icons';


const ContractorModal = ({ modalVisible, setModalVisible, selectedLawyer, handleChatWithLawyer, modalImage, navigation }) => {
    return (
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
                    <Text style={styles.propertyTitle}>{selectedLawyer?.name}</Text>
                    <Text style={styles.propertyTitle}>{selectedLawyer?.companyName}</Text>
                    {/* Assuming you have a RatingComponent to display ratings */}
                    {/*<Text style={styles.propertyPrice}><RatingComponent rating={selectedContractor?.rating}/></Text>*/}
                    <TouchableOpacity onPress={() => {
                        // Assuming you have navigation and a function to navigate
                        navigation.navigate('View Profile', { userId: selectedLawyer?.userDetails.userId });
                        setModalVisible(!modalVisible);
                    }}>
                        {
                            (selectedLawyer?.profileImage !== null && selectedLawyer !== null) ? (
                                <Image
                                    source={{uri: `data:image/jpeg;base64,${selectedLawyer.profileImage.data}`}}
                                    style={styles.profileImage}
                                />
                            ) : (
                                <Image
                                    source={require('../../assets/Default-Profile-Picture-Icon.png')} // Replace with your default image path
                                    style={styles.profileImage}
                                />
                            )
                        }
                    </TouchableOpacity>
                    <Text style={styles.propertyPrice}>{selectedLawyer?.userName}</Text>
                    <Text style={styles.propertyDetails}>Project Completed: {selectedLawyer?.projectsCompleted}</Text>
                    <Text style={styles.propertyDetails}>{dateFormatter(selectedLawyer?.createdAt)}</Text>
                    <ImageSwiper images_new={modalImage}/>
                    <Text>&nbsp;</Text>
                    <TouchableOpacity
                        style={[styles.button, styles.buttonChat]}
                        onPress={handleChatWithLawyer}
                    >
                        <MaterialIcons name="chat" size={24} color="white" />
                        <Text style={styles.buttonText}>Chat With Lawyer</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setModalVisible(!modalVisible)}
                    >
                        <MaterialIcons name="close" size={24} color="white" />
                        <Text style={styles.buttonText}>Hide</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    scene: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'space-between',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for modal overlay
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
        marginTop: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for modal overlay
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
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        padding: 12,
        elevation: 2,
        marginVertical: 5, // Add vertical spacing between buttons
        width: 250, // Set a fixed width for uniformity
    },
    buttonChat: {
        backgroundColor: "#007BFF", // Bright color for primary action
    },
    buttonClose: {
        backgroundColor: "#28A745", // Different color for secondary action
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 16,
        marginLeft: 10, // Space between icon and text
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 16,
    }
});

export default ContractorModal;
