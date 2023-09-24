// Since the Document Selector is a common component, I am going to abstract it.
import React, {useContext, useEffect, useState} from 'react';
import {FlatList, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {AntDesign, MaterialIcons} from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import {AuthContext} from "../AuthContext";
import DropDownPicker from "react-native-dropdown-picker";

const BASE_URL = "http://192.168.50.157:3000"; // Change this according to Wifi.
export const DocumentSelector = ({documentFetch}) => {
    const [selectedDocuments, setSelectedDocuments] = useState([]); // Documents to upload
    const [descriptions, setDescriptions] = useState(""); // Description text
    const [length, setLength] = useState(200); // Description text length
    const [folders, setFolders] = useState([]); // Add state for folders list
    const [folderSelection, setFoldersSelection] = useState({}); // Add state for folder selection -> map document to folder
    const [transactions, setTransactions] = useState([]); // Add state for transactions list
    const [documentTransactions, setDocumentTransactions] = useState({}); // Document transactions
    const [defaultTransactionId, setDefaultTransactionId] = useState(1); // Default transaction id
    const [defaultFolderId, setDefaultFolderId] = useState(1); // Default folder id
    const [selectedFolder, setSelectedFolder] = useState(); // Add state for selected folder

    const [isOpen1, setIsOpen1] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);

    const {user} = useContext(AuthContext);
    const USER_ID = user.user.userId;


    // Call fetchFolders on initial mount
    useEffect(() => {
        fetchFolders();
    }, []);

    useEffect(() => {
        console.log(folders);
        setFolders(folders);
    }, [folders]);

    // Fetch transactions on mount
    // Currently dummy user set to 1.
    useEffect(() => {
        fetchTransactions();
    }, [])

    useEffect(() => {
        console.log(transactions);
        setTransactions(transactions);
    }, [transactions]);

    const fetchFolders = async () => {
        try {
            const response = await fetch(`${BASE_URL}/user/folders/${USER_ID}}`);
            const results = await response.json();
            const folders = results.folders;
            console.log(folders);
            setFolders(folders);
            setDefaultFolderId(folders[0].folderId);
            setSelectedFolder(folders[0].folderId);
            console.log(defaultFolderId);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchTransactions = async () => {
        try {
            const response = await fetch(`${BASE_URL}/user/transactions/${USER_ID}`);
            const results = await response.json();
            const transactions = results.transactions;
            setTransactions(transactions);
            setDefaultTransactionId(transactions[0].transactionId);
            console.log(defaultTransactionId);
        } catch (error) {
            console.error(error);
        }
    };

    // This is supposed to show all the documents that you selected.
    const selectDocuments = async () => {
        try {
            const results = await DocumentPicker.getDocumentAsync({
                multiple: true,
                type: "application/pdf",
            });
            if (results.canceled === false) {
                const newSelectedDocuments = results.assets;
                setSelectedDocuments([...newSelectedDocuments]);
            }
        } catch (error) {
            console.log("Error selecting documents:", error);
        }
    };

    // This is supposed to remove a documents from the selected documents list.
    const removeDocument = (document) => {
        const newSelectedDocuments = selectedDocuments.filter(
            (doc) => doc.name !== document.name
        );
        setSelectedDocuments([...newSelectedDocuments]);
    };

    // This then uploads the documents you selected.
    // Web: Data stored in URI need to convert to Blob.
    // Mobile: Data stored not in URI can send directly.
    const handleUpload = async () => {
        try {
            const fileData = new FormData();
            selectedDocuments.forEach((document) => {
                const fileuri = document.uri;
                const filetype = "application/pdf";
                const filename = document.name;
                const transactionId =
                    documentTransactions[document.name] !== undefined
                        ? documentTransactions[document.name]
                        : defaultTransactionId;
                const folderId =
                    folderSelection[document.name] !== undefined
                        ? folderSelection[document.name]
                        : defaultFolderId;

                if (Platform.OS === "web") {
                    // Extract the base64-encoded data from the URI
                    const base64Data = fileuri.split(",")[1];
                    // Decode the base64 string into a Uint8Array
                    const base64String = window.atob(base64Data);
                    const bytes = new Uint8Array(base64String.length);
                    for (let i = 0; i < base64String.length; i++) {
                        bytes[i] = base64String.charCodeAt(i);
                    }
                    // Create a Blob object from the decoded data
                    const fileBlob = new Blob([bytes], {type: filetype});
                    fileData.append("documents", fileBlob, filename);
                } else {
                    fileData.append("documents", fileuri)
                }
                fileData.append("description", descriptions);
                fileData.append("transactionId", transactionId);
                fileData.append("folderId", folderId);
                fileData.append("userId", USER_ID);
            });

            // Send the data to the API
            const response = await fetch(`${BASE_URL}/user/documents/upload`, {
                method: "post",
                body: fileData,
            });

            // Check the response status and log the result
            if (response.ok) {
                const data = await response.json();
                console.log("Upload response:", data);
                await documentFetch();
            } else {
                console.log("File upload failed");
            }
        } catch (error) {
            console.log("Error upload:", error);
        }
    };

    // This is for the Select Documents
    const renderDocumentItem = ({item}) => (
        <View style={styles.documentItem}>
            <Text style={styles.documentText}>{item.name}</Text>
            <View style={{zIndex: 5001}}>
                <Text style={styles.descriptionText}>Transaction ID: </Text>
                <DropDownPicker
                    open={isOpen1}
                    setOpen={setIsOpen1}
                    value={documentTransactions[item.name] || defaultTransactionId}
                    setValue={(callback) => {
                        const newValue = callback(documentTransactions[item.name]);
                        setDocumentTransactions(prev => ({...prev, [item.name]: newValue}));
                    }}
                    items={transactions.map(transaction => ({
                        label: transaction.transactionId,
                        value: transaction.transactionId
                    }))}
                    defaultValue={documentTransactions[item.name]}
                    onChangeItem={(item) => setDocumentTransactions({...documentTransactions, [item.name]: item.value})}
                    containerStyle={{height: 40}} // Adjust the height as needed
                    style={{paddingHorizontal: 10, paddingVertical: 5,}} // Adjust padding as needed
                    dropDownStyle={{marginTop: 2,}} // Adjust margin, if needed
                    labelStyle={{fontSize: 12, textAlign: 'left', color: '#000'}} // Adjust label font size and color
                />
            </View>
            <Text> &nbsp; &nbsp; </Text>
            <View style={{zIndex: 5000}}>
                <Text style={styles.descriptionText}>Folder for Document: </Text>
                <DropDownPicker
                    open={isOpen2}
                    setOpen={setIsOpen2}
                    value={folderSelection[item.name] || defaultFolderId}
                    setValue={(callback) => {
                        const newValue = callback(folderSelection[item.name]);
                        setFoldersSelection(prev => ({...prev, [item.name]: newValue}));
                    }}
                    items={folders.map(folder => ({label: folder.title, value: folder.folderId}))}
                    defaultValue={folderSelection[item.name]}
                    onChangeItem={(item) => setFoldersSelection({...folderSelection, [item.name]: item.value})}
                    containerStyle={{height: 40}} // Adjust the height as needed
                    style={{paddingHorizontal: 10, paddingVertical: 5}} // Adjust padding as needed
                    dropDownStyle={{marginTop: 2,}} // Adjust margin, if needed
                    labelStyle={{fontSize: 12, textAlign: 'left', color: '#000'}} // Adjust label font size and color
                />
            </View>
            <Text>&nbsp;&nbsp;&nbsp;</Text>
            <View>
                <TouchableOpacity style={styles.downloadButton} onPress={() => removeDocument(item)}>
                    <Text style={styles.downloadButtonText}>Remove</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <FlatList
            ListHeaderComponent={
                <>
                    <Text style={styles.detailText}>List of Selected Documents:</Text>
                </>
            }
            ListFooterComponent={
                <>
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.detailText}>
                            Write your description for the files selected:
                        </Text>
                        <TextInput
                            style={styles.descriptionInput}
                            placeholder="Add a description"
                            value={descriptions}
                            maxLength={200} // max length of the text
                            onChangeText={(text) => {
                                setDescriptions(text);
                                setLength(200 - text.length);
                            }}
                        />
                        <Text> Remaining: {length}</Text>
                    </View>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity onPress={selectDocuments}>
                            <AntDesign name="addfile" size={24} color="black"/>
                        </TouchableOpacity>
                        <Text> &nbsp;&nbsp;&nbsp; </Text>
                        <TouchableOpacity onPress={handleUpload}>
                            <AntDesign name="clouduploado" size={24} color="black"/>
                        </TouchableOpacity>
                    </View>
                </>
            }
            ListEmptyComponent={() => (
                <View style={styles.emptyListContainer}>
                    <MaterialIcons name="description" size={40} color="lightgray"/>
                    <Text style={styles.emptyListText}>
                        Your selected documents would appear here.
                    </Text>
                </View>
            )}
            data={selectedDocuments}
            keyExtractor={(item, index) =>
                item.id ? item.id.toString() : index.toString()
            }
            renderItem={renderDocumentItem}
        />
    );
};

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

