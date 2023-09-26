import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  FlatList,
  TextInput,
  Platform,
  Modal,
  ScrollView,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { openBrowserAsync } from "expo-web-browser";
import { AuthContext } from "../../AuthContext";
import base64 from "react-native-base64";
import { Base64 } from "js-base64";

//Conditional FileSaver import.
let FileSaver;
if (__DEV__ && Platform.OS === "web") {
  FileSaver = require("file-saver").default;
}

// I know my code is fuuuuuuucked up lol, I am going to be splitting them into smaller components soon so each parts has its own component.
// This is some omega-level one JS file app XDDDDDDD

/* CONSTANTS FOR THE WHOLE PAGE */
// This may need to be responsive if we want auto-UI scaling per window size, but this only applies to Web.
const { width, height } = Dimensions.get("window");
const responsiveWidth = width * 0.8;
const BASE_URL = "http://192.168.50.157:3000";

function UploadScreen({ navigation }) {
  const [selectedDocuments, setSelectedDocuments] = useState([]); // Documents to upload
  const [descriptions, setDescriptions] = useState(""); // Description text
  const [length, setLength] = useState(200); // Description text length
  const [prevDocuments, setPrevDocuments] = useState([]); // This is suppose to be the list of documents that you have uploaded previously.
  const [searchQuery, setSearchQuery] = useState(""); // This is for the search bar.
  const [selectedFolder, setSelectedFolder] = useState(); // Add state for selected folder
  const [folders, setFolders] = useState([]); // Add state for folders list
  const [folderSelection, setFoldersSelection] = useState({}); // Add state for folder selection -> map document to folder
  const [newFolderModalOpen, setNewFolderModalOpen] = useState(false); // Modal boolean for folder creation
  const [newFolderName, setNewFolderName] = useState(""); // New folder name
  const [transactions, setTransactions] = useState([]); // Add state for transactions list
  const [documentTransactions, setDocumentTransactions] = useState({}); // Document transactions
  const [defaultTransactionId, setDefaultTransactionId] = useState(1); // Default transaction id
  const [defaultFolderId, setDefaultFolderId] = useState(1); // Default folder id
  const [filteredDocs, setFilteredDocs] = useState(prevDocuments); // Filtered documents
  const { user } = useContext(AuthContext);
  const USER_ID = user.user.userId;

  // General issue here seems to be that the Data Array is too big
  // It is in one omega array? I think we need to split it up into smaller arrays.
  const fetchDocuments = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/user/documents/list/metadata/${USER_ID}}`
      );
      const documents = await response.json();
      setPrevDocuments(documents);
      setFilteredDocs(documents);
      setSelectedFolder(defaultFolderId); //
      console.log(user);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch list of folders from API
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

  const downloadPDF = async (document) => {
    if (Platform.OS === "web") {
      // Web download logic
      // Web: convert buffer to blob
      const response = await fetch(
        `${BASE_URL}/user/documents/${document.documentId}/data`
      );
      const result = await response.json();
      const doc = result.document;
      console.log(doc);
      // Some how the blob is double writing.
      // Supposing that document.data.data is in base64 format
      // Assuming document.data takes the form {type: 'Buffer', data: Array}
      const byteArray = new Uint8Array(result.document.data);
      // Create a blob from the typed array
      const blob = new Blob([byteArray], { type: "application/pdf" });
      console.log(blob);
      const url = URL.createObjectURL(blob);
      // Use FileSaver to download
      openBrowserAsync(url);
      FileSaver.saveAs(blob, document.name);
      URL.revokeObjectURL(url);
    } else {
      // Native FileSystem logic
      // Need to make sure it works.
      const { uri } = await FileSystem.writeAsStringAsync(
        FileSystem.documentDirectory + document.name,
        document.data,
        { encoding: FileSystem.EncodingType.Base64 }
      );
    }
    if (uri) {
      alert("Downloaded to " + uri);
    } else {
      alert("Failed to download PDF");
    }
  };

  // Fetch the previous documents from the server.
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Call fetchFolders on initial mount
  useEffect(() => {
    fetchFolders();
  }, []);

  // Fetch transactions on mount
  // Currently dummy user set to 1.
  useEffect(() => {
    fetchTransactions();
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
    console.log(transactions);
    setTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    console.log(prevDocuments);
    setPrevDocuments(prevDocuments);
  }, [prevDocuments]);

  useEffect(() => {
    console.log(folders);
    setFolders(folders);
  }, [folders]);

  useEffect(() => {
    console.log(filteredDocs);
    setFilteredDocs(filteredDocs);
  }, [filteredDocs]);

  // Function to create new folder
  const createNewFolder = async () => {
    // Title of folder
    const title = newFolderName;
    // Call API to create folder
    try {
      const response = await fetch(
        `${BASE_URL}/user/folders/create/${USER_ID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ folderTitle: title }),
        }
      );
      if (response.ok) {
        console.log("Folder created successfully");
      } else {
        throw "Error creating folder";
      }
      // Close modal
      setNewFolderModalOpen(false);
      // Fetch updated folders list
      fetchFolders();
    } catch (error) {
      console.error(error);
    }
  };

  // This is suppose to show all the documents that you selected.
  const selectDocuments = async () => {
    try {
      const results = await DocumentPicker.getDocumentAsync({
        multiple: true,
        type: "application/pdf",
      });

      // If there is a file that is selected.
      if (results.canceled === false) {
        const newSelectedDocuments = results.assets;
        setSelectedDocuments([...newSelectedDocuments]);
      }
    } catch (error) {
      console.log("Error selecting documents:", error);
    }
  };

  // This is suppose to remove a documents from the selected documents list.
  const removeDocument = (document) => {
    const newSelectedDocuments = selectedDocuments.filter(
      (doc) => doc.name !== document.name
    );
    setSelectedDocuments([...newSelectedDocuments]);
  };

  const removeDocumentFromServer = async (document) => {
    try {
      const url = `${BASE_URL}/user/documents/${document.documentId}`;
      const response = await fetch(url, {
        method: "DELETE",
      });
      if (response.ok) {
        console.log("Document deleted successfully");
        // redirect or update state
        fetchDocuments();
      } else {
        throw "Error deleting document";
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

  // This then uploads the documents you selected.
  const handleUpload = async () => {
    try {
      //Begin logic to send data to API
      const fileData = new FormData();
      // Append each selected document to the FormData object
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
        console.log(documentTransactions);
        console.log(folderSelection);
        console.log(fileuri, filetype);

        // Extract the base64-encoded data from the URI
        // Dependent on Platform
        let base64Data;

        // Create a Blob object from the decoded data
        if (Platform.OS === "web") {
          base64Data = fileuri.split(",")[1];
          const base64String = base64.decode(base64Data);
          const bytes = new Uint8Array(base64String.length);
          for (let i = 0; i < base64String.length; i++) {
            bytes[i] = base64String.charCodeAt(i);
          }
          const fileBlob = new Blob([bytes], { type: filetype });
          // console.log(fileBlob);
          // console.log(descriptions);
          // console.log(fileData.get("description"));
          // console.log(...selectedDocuments);
          fileData.append("documents", fileBlob, filename);
          fileData.append("description", descriptions);
          fileData.append("transactionId", transactionId);
          fileData.append("folderId", folderId);
          fileData.append("userId", USER_ID);
          fileData.append("fileData", {
            uri: fileuri,
            type: filetype,
            name: filename,
          });
          // Convert to regular JS object
          const obj = Object.fromEntries(fileData.entries());
          console.log(obj);
        } else {
          fileBlob = {
            uri: fileuri,
            type: filetype,
            name: filename,
          };
          // console.log(fileBlob);
          // console.log(descriptions);
          // console.log(fileData.get("description"));
          // console.log(...selectedDocuments);
          fileData.append("documents", fileBlob);
          fileData.append("description", descriptions);
          fileData.append("transactionId", transactionId);
          fileData.append("folderId", folderId);
          fileData.append("userId", USER_ID);
          fileData.append("fileData", {
            uri: fileuri,
            type: filetype,
            name: filename,
          });
          // Convert to regular JS object
          // const obj = Object.fromEntries(fileData.entries());
          // console.log(obj);
        }
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
        fetchDocuments();
      } else {
        throw new Error("File upload failed");
      }
    } catch (error) {
      console.log("Error upload:", error);
    }
  };

  // This is for the Select Documents
  // Probably going to add a Partner Application Box as well.
  const renderDocumentItem = ({ item }) => (
    <ScrollView contentContainerStyle={styles.documentItem} horizontal={true}>
      <Text style={styles.documentText}>{item.name}</Text>
      <Text>&nbsp; &nbsp;</Text>
      <View>
        <Button
          style={styles.downloadButton}
          title="Remove"
          onPress={() => removeDocument(item)}
        />
        <Text>&nbsp;</Text>
        <Text style={styles.descriptionText}>Transaction ID: </Text>
        <Picker
          selectedValue={documentTransactions[item.name]}
          onValueChange={(transaction) => {
            setDocumentTransactions({
              ...documentTransactions,
              [item.name]: transaction,
            });
          }}
        >
          {transactions.map((transaction) => (
            <Picker.Item
              label={transaction.transactionId.toString()}
              value={transaction.transactionId}
              key={transaction.transactionId}
            />
          ))}
        </Picker>
        <Text>&nbsp;</Text>
        <Text style={styles.descriptionText}>Folder for Document: </Text>
        <Picker
          selectedValue={folderSelection[item.name]}
          onValueChange={(folder) => {
            setFoldersSelection({
              ...folderSelection,
              [item.name]: folder,
            });
          }}
        >
          {folders.map((folder) => (
            <Picker.Item
              label={folder.title}
              value={folder.folderId}
              key={folder.folderId}
            />
          ))}
        </Picker>
      </View>
    </ScrollView>
  );

  // This is for the Previously Uploaded Documents
  const renderDocumentListItem = ({ item }) => (
    <ScrollView contentContainerStyle={styles.documentItem} horizontal={true}>
      <Text style={styles.documentText}>{item.title}</Text>
      <Text>&nbsp; &nbsp;</Text>
      <View>
        <Text style={styles.descriptionText}>Description: </Text>
        <Text style={styles.documentText}>{item.description}</Text>
      </View>
      <View>
        <Text style={styles.descriptionText}>Transaction ID: </Text>
        <Text style={styles.documentText}>{item.transactionId}</Text>
        <Text style={styles.descriptionText}>Folder: </Text>
        <Text style={styles.documentText}>{getFolderTitle(item.folderId)}</Text>
      </View>
      <Text>&nbsp; &nbsp;</Text>
      <View>
        <Button
          style={styles.downloadButton}
          title="Remove"
          onPress={() => removeDocumentFromServer(item)}
        />
        <Text>&nbsp;</Text>
        <Button
          style={styles.downloadButton}
          title="Download"
          onPress={() => downloadDocumentFromServer(item)}
        />
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Upload your documents here!</Text>
      {/* Wrap the FlatList in a View with border styles */}
      <View style={styles.documentListContainer}>
        <Text style={styles.detailText}>List of selected Documents:</Text>
        <FlatList
          ListEmptyComponent={() => (
            <Text style={styles.emptyListText}>
              {" "}
              Your selected documents would appear here.
            </Text>
          )}
          data={selectedDocuments}
          keyExtractor={(item) => item.name.toString()}
          renderItem={renderDocumentItem}
        />
      </View>
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
      <View style={styles.buttonContainer}>
        <Button
          style={styles.downloadButton}
          title="Select Documents"
          onPress={selectDocuments}
        />
        <Text> &nbsp;&nbsp;&nbsp; </Text>
        <Button
          style={styles.downloadButton}
          title="Upload Documents"
          onPress={handleUpload}
        />
      </View>

      <View>
        <View
          style={{
            borderBottomColor: "black",
            borderBottomWidth: 1,
            marginVertical: 10,
          }}
        />

        <Text style={styles.detailText}>Previously Uploaded Documents: </Text>
        <View style={styles.documentListContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search documents..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Text> Select your Folder Below: </Text>
          <Picker
            selectedValue={selectedFolder}
            onValueChange={setSelectedFolder}
          >
            {folders.map((folder) => (
              <Picker.Item
                label={folder.title}
                value={folder.folderId}
                key={folder.folderId}
              />
            ))}
          </Picker>
          <Text>&nbsp;</Text>
          <Button
            title="Create New Folder"
            onPress={() => setNewFolderModalOpen(true)}
          />
          {newFolderModalOpen && (
            <Modal
              animationType="fade"
              transparent={true}
              visible={newFolderModalOpen}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <TextInput
                    placeholder="New folder name"
                    value={newFolderName}
                    onChangeText={setNewFolderName}
                    style={styles.searchBar}
                  />
                  <Text>&nbsp;</Text>
                  <Button title="Create Folder" onPress={createNewFolder} />
                  <Text>&nbsp;</Text>
                  <Button
                    title="Cancel"
                    onPress={() => setNewFolderModalOpen(false)}
                  />
                </View>
              </View>
            </Modal>
          )}
          <FlatList
            data={filteredDocs}
            renderItem={renderDocumentListItem}
            ListEmptyComponent={() => (
              <Text style={styles.emptyListText}>
                {" "}
                Your previous documents would appear here.
              </Text>
            )}
            keyExtractor={(item, index) =>
              item.id ? item.id.toString() : index.toString()
            }
          />
        </View>
      </View>
      <Text style={styles.graytext}>
        Welcome, {user.user.name}, you are the #{USER_ID} user!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: responsiveWidth * 0.02,
    backgroundColor: "#fff",
    overflow: "scroll",
  },

  headerText: {
    fontSize: responsiveWidth * 0.06,
    marginBottom: responsiveWidth * 0.02,
    textAlign: "center",
  },

  searchBar: {
    height: responsiveWidth * 0.1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: responsiveWidth * 0.02,
    paddingHorizontal: responsiveWidth * 0.02,
    marginVertical: responsiveWidth * 0.02,
  },

  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: responsiveWidth * 0.04,
  },

  descriptionContainer: {
    marginVertical: responsiveWidth * 0.04,
  },

  descriptionInput: {
    height: responsiveWidth * 0.1,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: responsiveWidth * 0.02,
    marginVertical: responsiveWidth * 0.02,
    padding: responsiveWidth * 0.02,
  },

  downloadButton: {
    backgroundColor: "#007AFF",
    color: "#fff",
    padding: responsiveWidth * 0.04,
    borderRadius: responsiveWidth * 0.02,
  },

  detailText: {
    fontSize: responsiveWidth * 0.04,
    marginBottom: responsiveWidth * 0.02,
    fontWeight: "bold",
  },

  documentListContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: responsiveWidth * 0.02,
    padding: responsiveWidth * 0.03,
    paddingTop: responsiveWidth * 0.035,
  },

  documentItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: responsiveWidth * 0.03,
    marginBottom: responsiveWidth * 0.02,
    backgroundColor: "#F8F8F8",
    borderRadius: responsiveWidth * 0.02,
    width: "100%",
  },

  documentText: {
    fontSize: responsiveWidth * 0.035,
    color: "#333",
  },

  descriptionText: {
    fontSize: responsiveWidth * 0.035,
    fontStyle: "italic",
    fontWeight: "bold",
  },

  descriptiontContainer: {
    alignContent: "top-left",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalView: {
    backgroundColor: "white",
    borderRadius: responsiveWidth * 0.025,
    padding: responsiveWidth * 0.05,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  picker: {
    fontSize: responsiveWidth * 0.03,
    paddingVertical: responsiveWidth * 0.03,
    paddingHorizontal: responsiveWidth * 0.025,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: responsiveWidth * 0.01,
    backgroundColor: "white",
    color: "black",
  },

  graytext: {
    fontSize: responsiveWidth * 0.02, // or whatever relative size you want
    color: "#808080",
  },
});

export default UploadScreen;
