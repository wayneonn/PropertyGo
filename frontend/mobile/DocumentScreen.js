import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  FlatList,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from 'expo-file-system';
import { openBrowserAsync } from 'expo-web-browser';
import FileSaver from 'file-saver';

function UploadScreen({ navigation }) {
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [descriptions, setDescriptions] = useState("");
  const [length, setLength] = useState(200);
  const [prevDocuments, setPrevDocuments] = useState([]); // This is suppose to be the list of documents that you have uploaded previously.

  const fetchDocuments = async() => {
    try {
      const response = await fetch('http://localhost:3000/documents/list');
      const documents = await response.json();
      setPrevDocuments(documents);
    } catch (error) {
      console.error(error);
    }
  }

  const downloadPDF = async(document) => {
    if(Platform.OS === 'web') {
      // Web download logic
      // Web: convert buffer to blob
      console.log(document.data.data)
      // Some how the blob is double writing. 
      // Supposing that document.data.data is in base64 format
      // Assuming document.data takes the form {type: 'Buffer', data: Array}
      const byteArray = new Uint8Array(document.data.data);
      // Create a blob from the typed array
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      console.log(blob)
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
    if(uri) {
      alert('Downloaded to ' + uri);
    } else {
      alert('Failed to download PDF');
    }
  
  }

  // Fetch the previous documents from the server. 
  useEffect(() => {
    fetchDocuments()
  }, []);

  useEffect(() => { 
    console.log(prevDocuments);
    setPrevDocuments(prevDocuments);
  }, [prevDocuments])

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

  const removeDocumentFromServer = async(document) => {
    try {
      const url = `http://localhost:3000/documents/${document.id}`;
      const response = await fetch(url, {
        method: 'DELETE' 
      });
      if (response.ok) {
        console.log('Document deleted successfully');
        // redirect or update state
        fetchDocuments();
      } else {
        throw 'Error deleting document';
      }
    } catch (error) {
      console.error(error);
    }
  }

  const downloadDocumentFromServer = (document) => {
    downloadPDF(document);
  }

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

        const file = {
          uri: fileuri,
          type: filetype,
          name: filename,
        };

        // Extract the base64-encoded data from the URI
        const base64Data = file.uri.split(",")[1];

        // Decode the base64 string into a Uint8Array
        const base64String = window.atob(base64Data);
        const bytes = new Uint8Array(base64String.length);
        for (let i = 0; i < base64String.length; i++) {
          bytes[i] = base64String.charCodeAt(i);
        }

        // Create a Blob object from the decoded data
        const fileBlob = new Blob([bytes], { type: file.type });
        // console.log(fileBlob);
        // console.log(descriptions);
        // console.log(fileData.get("description"));
        // console.log(...selectedDocuments);
        fileData.append("documents", fileBlob, filename);
        fileData.append("description", descriptions);
      });

      // Send the data to the API
      const response = await fetch("http://127.0.0.1:3000/documents/upload", {
        method: "post",
        body: fileData,
      });

      // Check the response status and log the result
      if (response.ok) {
        const data = await response.json();
        console.log("Upload response:", data);
        fetchDocuments()
      } else {
        throw new Error("File upload failed");
      }
    } catch (error) {
      console.log("Error upload:", error);
    }
  };

  // Initial dummy documents.
  const documents = [
    { id: 1, name: "Your selected documents would appear here." },
  ];

  const prevDummyDocuments = [
    {id: 1, name: "Your previous documents would appear here."}
  ]

  const renderDocumentItem = ({ item }) => (
    <TouchableOpacity style={styles.documentItem}>
      <Text style={styles.documentText}>{item.name}</Text>
      <Button
        style={styles.downloadButton}
        title="Remove"
        onPress={() => removeDocument(item)}
      />
    </TouchableOpacity>
  );
  
  const renderDocumentListItem = ({ item }) => (
    <TouchableOpacity style={styles.documentItem}>
      <Text style={styles.documentText}>{item.name}</Text>
      <View>
        <Text style={styles.descriptionText}>Description: </Text>
        <Text style={styles.documentText}>{item.description}</Text>
      </View>
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
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Upload your documents here!</Text>
      {/* Wrap the FlatList in a View with border styles */}
      <View style={styles.documentListContainer}>
        <Text style={styles.detailText}>List of selected Documents:</Text>
        <FlatList
          ListEmptyComponent={() => (<Text style={styles.emptyListText}> Your selected documents would appear here.</Text>)}
          data={selectedDocuments}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : index.toString()
          }
          renderItem={renderDocumentItem}
        />
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.detailText}>
          {" "}
          Write your description for the files selected:{" "}
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
        <TextInput />

        <View
          style={{
            borderBottomColor: "black",
            borderBottomWidth: 1,
            marginVertical: 10,
          }}
        />

        <Text style={styles.detailText}>Previously Uploaded Documents: </Text>
        <View style={styles.documentListContainer}> 
          <FlatList
            data={prevDocuments}
            renderItem={renderDocumentListItem}
            ListEmptyComponent={() => (<Text style={styles.emptyListText}> Your previous documents would appear here.</Text>)}
            keyExtractor={(item, index) =>
              item.id ? item.id.toString() : index.toString()
            } 
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  headerText: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  descriptionContainer: {
    marginVertical: 16,
  },
  descriptionInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 8,
    padding: 8,
  },
  downloadButton: {
    backgroundColor: "#007AFF",
    color: "#fff",
    padding: 16,
    borderRadius: 8,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "bold",
  },
  documentListContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    paddingTop: 14,
  },
  documentItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
  },
  documentText: {
    fontSize: 14,
    color: "#333",
  },
  descriptionText: {
    fontSize: 14, 
    fontStyle: "italic",
    fontWeight: "bold",
  }, 
  descriptiontContainer: {
    alignContent: "top-left",
  }
});

export default UploadScreen;
