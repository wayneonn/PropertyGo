import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
// Using Axios to handle API request
import axios from "axios";

const url = "127.0.0.1:3000/documents/upload";

// TODO: Add the API backend to consume the documents added.
// Got to figure out what the API spits back.
function UploadScreen({ navigation }) {
  const [selectedDocuments, setSelectedDocuments] = useState([]);

  const handleUpload = async () => {
    try {
      const results = await DocumentPicker.getDocumentAsync({ multiple: true });
      if (results.canceled === false) {
        const newSelectedDocuments = results.assets;
        setSelectedDocuments([...selectedDocuments, ...newSelectedDocuments]);

        //Begin logic to send data to API
        // Is FormData the appropriate one?
        const fileData = new FormData();
        // Append each selected document to the FormData object
        newSelectedDocuments.forEach((document) => {
          fileData.append("documents[]", {
            uri: document.uri,
            type: document.type,
            name: document.name,
          });
          console.log(document);
        });
        // Display the key/value pairs for FormData
        // This is kinda finnicky because it is not sending the file properly.
        console.log(fileData.get("documents"));

        // Send data to the endpoint.
        // HTTP needs to be added on...
        // Send the fileData to the endpoint using fetch
        const response = await fetch("http://127.0.0.1:3000/documents/upload", {
          method: "POST",
          body: fileData,
        });

        // Check the response status and log the result
        if (response.ok) {
          const data = await response.json();
          console.log("Upload response:", data);
        } else {
          throw new Error("File upload failed");
        }
      }
    } catch (error) {
      console.log("Error selecting documents:", error);
    }
  };

  const documents = [
    { id: 1, name: "Document 1.pdf" },
    { id: 2, name: "Document 2.docx" },
    { id: 3, name: "Document 3.txt" },
    // Add more dummy documents as needed
  ];

  const renderDocumentItem = ({ item }) => (
    <TouchableOpacity style={styles.documentItem}>
      <Text style={styles.documentText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Upload your documents here!</Text>
      <Button title="Upload" onPress={handleUpload} />

      {/* Wrap the FlatList in a View with border styles */}
      <View style={styles.documentListContainer}>
        <Text style={styles.detailText}>List of Documents:</Text>
        <FlatList
          data={selectedDocuments.length > 0 ? selectedDocuments : documents}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : index.toString()
          }
          renderItem={renderDocumentItem}
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
