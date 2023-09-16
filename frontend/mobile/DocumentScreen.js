import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";

function UploadScreen({ navigation }) {
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [descriptions, setDescriptions] = useState({});

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
        console.log(document.uri);

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
        console.log(fileBlob);

        fileData.append("documents", fileBlob, filename);
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

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Upload your documents here!</Text>
      {/* Wrap the FlatList in a View with border styles */}
      <View style={styles.documentListContainer}>
        <Text style={styles.detailText}>List of selected Documents:</Text>
        <FlatList
          data={selectedDocuments.length > 0 ? selectedDocuments : documents}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : index.toString()
          }
          renderItem={renderDocumentItem}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          style={styles.downloadButton}
          title="Select Documents"
          onPress={selectDocuments}
        />
        <Button
          style={styles.downloadButton}
          title="Upload Documents"
          onPress={handleUpload}
        />
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
  downloadButton: {
    backgroundColor: "#007AFF",
    color: "#fff",
    padding: 16,
    borderRadius: 8,
    paddingRight: 8,
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
});

export default UploadScreen;
