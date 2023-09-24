// I am going to start refactoring this thing.
// God damn is the structure soooo bad.

/*** IMPORTS *****/
import React, {useContext, useEffect, useState} from "react";
import {
    Dimensions,
    FlatList,
    Modal,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import * as FileSystem from "expo-file-system";
import {openBrowserAsync} from "expo-web-browser";
import {AuthContext} from "../../AuthContext";
import DropDownPicker from 'react-native-dropdown-picker';
import {DocumentSelector} from "../../components/DocumentSelector";

// ICON IMPORTS
import {AntDesign, Entypo, FontAwesome, MaterialIcons} from '@expo/vector-icons';

//Conditional FileSaver import.
let FileSaver;
if (__DEV__ && Platform.OS === "web") {
    FileSaver = require("file-saver").default;
}
/*******************************************/

/* CONSTANTS FOR THE WHOLE PAGE */
const {width} = Dimensions.get("window");
const responsiveWidth = width * 0.8;
const BASE_URL = "http://192.168.50.157:3000"; // Change this according to Wifi.

function UploadScreen({navigation}) {
    const [prevDocuments, setPrevDocuments] = useState([]); // This is suppose to be the list of documents that you have uploaded previously.
    const [searchQuery, setSearchQuery] = useState(""); // This is for the search bar.
    const [selectedFolder, setSelectedFolder] = useState(); // Add state for selected folder
    const [folders, setFolders] = useState([]); // Add state for folders list
    const [newFolderModalOpen, setNewFolderModalOpen] = useState(false); // Modal boolean for folder creation
    const [newFolderName, setNewFolderName] = useState(""); // New folder name
    const [defaultFolderId, setDefaultFolderId] = useState(1); // Default folder id
    const [filteredDocs, setFilteredDocs] = useState(prevDocuments); // Filtered documents
    const {user} = useContext(AuthContext);
    const USER_ID = user.user.userId;
    const [isOpen, setIsOpen] = useState(false);

    // USE-EFFECT HOOKS //
    // Fetch the previous documents from the server.
    useEffect(() => {
        fetchDocuments().then(r => console.log("Fetch documents completed."));
    }, []);

    useEffect(() => {
        const docs = prevDocuments.filter((doc) => {
            console.log("prevDocuments:", prevDocuments);
            console.log("selectedFolder:", selectedFolder);
            console.log("searchQuery:", searchQuery);
            const matchesFolder = selectedFolder
                ? doc.folderId.toString() === selectedFolder.toString()
                : true;
            const matchesSearch = doc.title
                .toLowerCase()
                .includes((searchQuery || "").toLowerCase());
            return matchesFolder && matchesSearch;
        });
        setFilteredDocs(docs);
    }, [searchQuery, selectedFolder]);

    // Weird hack so that useState works properly.
    useEffect(() => {
        console.log(prevDocuments);
        setPrevDocuments(prevDocuments);
    }, [prevDocuments]);

    useEffect(() => {
        console.log(filteredDocs);
        setFilteredDocs(filteredDocs);
    }, [filteredDocs]);
    // END OF USE-EFFECT HOOKS //

    // FETCH DATA FUNCTIONS
    const fetchDocuments = async () => {
        try {
            const response = await fetch(
                `${BASE_URL}/user/documents/list/metadata/${USER_ID}}`
            );
            const documents = await response.json();
            setPrevDocuments(documents);
            setFilteredDocs(documents);
            setSelectedFolder(defaultFolderId);
            console.log(user);
        } catch (error) {
            console.error(error);
        }
    };

    // END OF FETCH FUNCTIONS

    // START OF BUSINESS FUNCTIONS //
    const downloadPDF = async (document) => {
        // The web version is kinda not needed.
        if (Platform.OS === "web") {
            const response = await fetch(
                `${BASE_URL}/user/documents/${document.documentId}/data`
            );
            const result = await response.json();
            const doc = result.document;
            console.log(doc);
            const byteArray = new Uint8Array(result.document.data);
            const blob = new Blob([byteArray], {type: "application/pdf"});
            console.log(blob);
            const url = URL.createObjectURL(blob);
            await openBrowserAsync(url);
            FileSaver.saveAs(blob, document.name);
            URL.revokeObjectURL(url);
        } else {
            // Native FileSystem logic
            // Need to make sure it works.
            const {uri} = await FileSystem.writeAsStringAsync(
                FileSystem.documentDirectory + document.name,
                document.data,
                {encoding: FileSystem.EncodingType.Base64}
            );
            if (uri) {
                alert("Downloaded to " + uri);
            } else {
                alert("Failed to download PDF");
            }
        }
    };

    // Function to create new folder
    const createNewFolder = async () => {
        try {
            const response = await fetch(
                `${BASE_URL}/user/folders/create/${USER_ID}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({folderTitle: newFolderName}),
                }
            );
            if (response.ok) {
                console.log("Folder created successfully");
            } else {
                console.log("Error creating folder");
            }
            setNewFolderModalOpen(false);
            await fetchFolders();
        } catch (error) {
            console.error(error);
        }
    };

    const removeDocumentFromServer = async (document) => {
        try {
            const url = `${BASE_URL}/user/documents/${document.documentId}`;
            const response = await fetch(url, {
                method: "DELETE",
            });
            if (response.ok) {
                console.log("Document deleted successfully");
                await fetchDocuments();
            } else {
                console.log("Error deleting document");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const downloadDocumentFromServer = (document) => {
        downloadPDF(document);
    };
    const getFolderTitle = (folderId) => {
        const foundFolder = folders.find((folder) => folder.folderId === folderId);
        return foundFolder ? foundFolder.title : "";
    };

    // END OF FUNCTIONS, MOVING INTO RENDERED FUNCTION COMPONENTS. //

    // This is for the Previously Uploaded Documents
    const renderDocumentListItem = ({item}) => (
        <View style={styles.documentItem}>
            <Text style={styles.documentText}>{item.title}</Text>
            <View>
                <Text style={styles.descriptionText}>Description: </Text>
                <Text style={styles.documentText}>{item.description}</Text>
            </View>
            <View style={{flexDirection: "row"}}>
                <Text style={styles.documentText}>Transaction ID: </Text>
                <Text style={styles.documentText}>{item.transactionId}</Text>
            </View>
            <View style={{flexDirection: "row"}}>
                <Text style={styles.documentText}>Folder: </Text>
                <Text style={styles.documentText}>{getFolderTitle(item.folderId)}</Text>
            </View>
            <Text>&nbsp;</Text>
            <View style={{flexDirection: "row"}}>
                <TouchableOpacity
                    onPress={() => removeDocumentFromServer(item)}
                    style={{
                        borderWidth: 1, // set border width
                        borderColor: 'black', // set border color
                        borderRadius: 10, // set border radius
                        padding: 5, // set padding
                        alignItems: 'center', // center the icon horizontally
                        justifyContent: 'center', // center the icon vertically
                    }}>
                    <FontAwesome name="remove" size={25} color="black"/>
                </TouchableOpacity>
                <Text>&nbsp; &nbsp;</Text>
                <TouchableOpacity
                    onPress={() => downloadDocumentFromServer(item)}
                    style={{
                        borderWidth: 1, // set border width
                        borderColor: 'black', // set border color
                        borderRadius: 10, // set border radius
                        padding: 5, // set padding
                        alignItems: 'center', // center the icon horizontally
                        justifyContent: 'center', // center the icon vertically
                    }}
                >
                    <Entypo name="download" size={24} color="black"/>
                </TouchableOpacity>
            </View>
        </View>
    );

    // BEGIN OF ACTUAL HTML RENDERING //
    // Rendering everything within a single FlatList Component.
    return (
        <SafeAreaView style={styles.container}>
            {/* Wrap the FlatList in a View with border styles */}
            <View style={styles.documentListContainer}>
                <DocumentSelector documentFetch={fetchDocuments}/>
            </View>
            <Text> &nbsp; &nbsp;</Text>
            <View style={styles.documentListContainer}>
                <FlatList
                    ListHeaderComponent={
                        <>
                            <Text style={styles.detailText}>Previously Uploaded Documents: </Text>
                            <View style={styles.documentListContainer}>
                                <TextInput
                                    style={styles.searchBar}
                                    placeholder="Search documents..."
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                />
                                <Text> Select your Folder Below: </Text>
                                <DropDownPicker
                                    open={isOpen}
                                    setOpen={setIsOpen}
                                    value={selectedFolder}
                                    setValue={setSelectedFolder}
                                    items={folders.map(folder => ({label: folder.title, value: folder.folderId}))}
                                    containerStyle={{height: 40}}
                                    style={{backgroundColor: '#fafafa'}}
                                    dropDownStyle={{backgroundColor: '#fafafa'}}
                                    zIndex={3000}
                                    zIndexInverse={1000}
                                />
                                <Text>&nbsp;</Text>
                                <View style={styles.iconContainer}>
                                    <TouchableOpacity
                                        onPress={() => setNewFolderModalOpen(true)}
                                    >
                                        <AntDesign name="addfolder" size={24} color="black"/>
                                    </TouchableOpacity>
                                </View>
                                {newFolderModalOpen && (
                                    <Modal
                                        animationType="slide"
                                        transparent={true}
                                        visible={newFolderModalOpen}
                                    >
                                        <View style={styles.centeredView}>
                                            <View style={styles.modalView}>
                                                <Text style={styles.descriptionText}> Folder Creation Section: </Text>
                                                <TextInput
                                                    placeholder="New folder name"
                                                    value={newFolderName}
                                                    onChangeText={setNewFolderName}
                                                    style={styles.modalTextInput}
                                                    placeholderTextColor="#888"
                                                />
                                                <TouchableOpacity style={styles.button} onPress={createNewFolder}>
                                                    <Text style={styles.buttonText}>Create Folder</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.cancelButton}
                                                                  onPress={() => setNewFolderModalOpen(false)}>
                                                    <Text style={styles.buttonText}>Cancel</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </Modal>
                                )}
                            </View>
                        </>
                    }
                    data={filteredDocs}
                    renderItem={renderDocumentListItem}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyListContainer}>
                            <MaterialIcons name="description" size={40} color="lightgray"/>
                            <Text style={styles.emptyListText}>
                                Your previous documents would appear here.
                            </Text>
                        </View>
                    )}
                    keyExtractor={(item, index) =>
                        item.id ? item.id.toString() : index.toString()
                    }
                    ListFooterComponent={
                        <>
                            <Text style={styles.graytext}>
                                Welcome, {user.user.name}, you are the #{USER_ID} user!
                            </Text>
                        </>
                    }
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: '10%',
        backgroundColor: "#fff",
        flex: 1,
        paddingHorizontal: 10,
    },

    headerText: {
        fontSize: 10,
        marginBottom: "2%",
        textAlign: "center",
    },

    searchBar: {
        height: '25%', // 'auto' is not a valid value for height in React Native
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        paddingHorizontal: 2,
        marginVertical: 2,
    },

    iconContainer: {
        alignItems: 'flex-start',
        justifyContent: 'space-evenly',
        flexDirection: "row",
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 15,
        padding: 5,
    },

    descriptionContainer: {
        marginVertical: '4%',
    },

    descriptionInput: {
        height: 30, // Changed from `1%` to a fixed value
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5, // Changed from `2%` to a fixed value
        marginVertical: `2%`,
        padding: `2%`,
    },

    downloadButton: {
        backgroundColor: "#ffffff", // White background
        borderColor: "#007AFF", // Blue border
        borderWidth: 1, // Border width
        paddingVertical: 10, // Vertical padding
        paddingHorizontal: 20, // Horizontal padding
        borderRadius: 12, // Rounded corners
        alignItems: 'center', // Center text horizontally
        justifyContent: 'center', // Center text vertically
        shadowColor: "#000", // Shadow color
        shadowOffset: {
            width: 0,
            height: 2, // Shadow position
        },
        shadowOpacity: 0.1, // Shadow opacity
        shadowRadius: 4, // Shadow blurring
    },

    downloadButtonText: {
        color: "#007AFF", // Blue text
        fontWeight: "600", // Semi-bold text
        fontSize: 16, // Font size
    },


    detailText: {
        fontSize: 12,
        marginBottom: "2%",
        fontWeight: "bold",
    },

    documentListContainer: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 5, // Changed from `2%` to a fixed value
        padding: "3%",
        paddingTop: "3.5%",
        flex: 1,
    },

    documentItem: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1.5%", // Reduced padding for a more compact look
        marginBottom: "1%", // Reduced margin for a more compact look
        backgroundColor: "#FFFFFF", // Lighter background color for iOS theme
        borderRadius: 10, // Moderate border radius for a card-like appearance
        width: "100%",
        shadowColor: "#000", // Shadow for a card-like appearance
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },

    documentText: {
        fontSize: 16, // A size that is readable and maintains hierarchy
        fontWeight: '500', // Semi-bold to make the text stand out
        color: '#333', // A shade of black to keep text readable and clean
    },

    descriptionText: {
        fontSize: 14, // Changed from `3.5%` to a fixed value
        fontStyle: "italic",
        fontWeight: "bold",
    },

    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
    },

    modalView: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 35,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

    modalTextInput: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10, // Text input padding
        marginBottom: 20, // Margin at the bottom of the input
    },

    button: {
        backgroundColor: '#1a73e8', // A pleasant blue tone for the primary button
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
        marginVertical: 5, // A little vertical margin for aesthetic spacing
    },
    cancelButton: {
        backgroundColor: '#ccc', // A neutral gray for the cancel button
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
        marginVertical: 5, // A little vertical margin for aesthetic spacing
    },
    buttonText: {
        color: 'white',
        fontWeight: '600', // Semi-bold text
    },

    picker: {
        fontSize: 12,
        paddingVertical: "3%",
        paddingHorizontal: "2.5%",
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 5, // Changed from `1%` to a fixed value
        backgroundColor: "white",
        color: "black",
    },

    graytext: {
        fontSize: 12, // Changed from `2%` to a fixed value
        color: "#808080",
    },

    emptyListContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    emptyListText: {
        fontSize: 18,
        color: 'gray',
        textAlign: 'center',
        marginTop: 10,
    }, undefined

});
export default UploadScreen;
