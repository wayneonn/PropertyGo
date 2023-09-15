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

// I should really just set this aside for a moment and focus on the backend in more detail.
// Since I need to do Firebase as well.

// TODO: Add the API backend to consume the documents added.
// Got to figure out what the API spits back.
function UploadScreen({ navigation }) {
  const [selectedDocuments, setSelectedDocuments] = useState([]);

  const handleUpload = async () => {
    try {
      // Limit to only PDF for documents.
      const results = await DocumentPicker.getDocumentAsync({
        multiple: true,
        type: "application/pdf",
      });

      // If there is a file that is selected.
      if (results.canceled === false) {
        const newSelectedDocuments = results.assets;
        setSelectedDocuments([...selectedDocuments, ...newSelectedDocuments]);

        //Begin logic to send data to API
        const fileData = new FormData();
        // Append each selected document to the FormData object
        newSelectedDocuments.forEach((document) => {
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
      }
    } catch (error) {
      console.log("Error selecting documents:", error);
    }
  };

  // Initial dummy documents.
  const documents = [{ id: 1, name: "Your document here.pdf" }];

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
