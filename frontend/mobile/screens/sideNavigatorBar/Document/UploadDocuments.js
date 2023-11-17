import {DocumentSelector} from "../../../components/DocumentSelector";
import {StyleSheet, View} from "react-native";
import React, {useCallback, useContext, useState} from "react";
import {BASE_URL, fetchDocuments, fetchFolders} from "../../../utils/documentApi";
import {AuthContext} from "../../../AuthContext";
import {useFocusEffect} from "@react-navigation/native";

const UploadDocuments = () => {
    const [prevDocuments, setPrevDocuments] = useState([]); // This is suppose to be the list of documents that you have uploaded previously.
    const [selectedFolder, setSelectedFolder] = useState(""); // Add state for selected folder
    const [folders, setFolders] = useState([]); // Add state for folders list
    const [defaultFolderId, setDefaultFolderId] = useState(1); // Default folder id
    const [filteredDocs, setFilteredDocs] = useState(prevDocuments); // Filtered documents
    const {user} = useContext(AuthContext);
    const USER_ID = user.user.userId;

    const useParentCallback = useCallback(() => {
        fetchData();
    }, [])

    useFocusEffect(useParentCallback);

    const fetchData = async () => {
        try {
            const documents = await fetchDocuments(USER_ID);
            const folders = await fetchFolders(USER_ID);
            setFolders(folders);
            setPrevDocuments(documents);
            setFilteredDocs(documents);
            setSelectedFolder(defaultFolderId.toString());
            console.log(user);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <View style={styles.documentListContainer}>
            <DocumentSelector documentFetch={fetchData} folderState={folders} isTransaction={true}/>
        </View>
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
        height: 190
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
    },
});

export default UploadDocuments;