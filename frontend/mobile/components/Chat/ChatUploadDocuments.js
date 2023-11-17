import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';
import {BASE_URL, createFolder} from "../../utils/documentApi";

const ChatDocumentUpload = ({ chatId, userId, isVisible, onClose, sendMessage }) => {
    const [selectedDocuments, setSelectedDocuments] = useState([]);
    const [isDocumentUploaded, setIsDocumentUploaded] = useState(false);
    const [chatFolderId, setFolderId] = useState([]);

    const handleSelectDocument = async () => {
        const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
        if (status === 'granted') {
            const results = await DocumentPicker.getDocumentAsync({
                multiple: true,
                type: 'application/pdf',
            });

            if (!results.cancelled) {
                setSelectedDocuments(results.assets);
            }
        } else {
            console.warn('Media library permission denied.');
        }
    };

    const fetchFolderData = async () => {
        try {
            // const documents = await fetchDocuments(USER_ID);
            const { success, data, message } = await createFolder(userId, { folderTitle: `Chat ${chatId} Folder` });
            if (success) {
                setFolderId(data.folderId);
            } else {
                setFolderId(data.folderId);
            }
            return data.folderId
            // console.log(user);
        } catch (error) {
            console.error('Error fetching Folder data:', error);
        }
    };

    const openPdf = async (filePath) => {
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        if (fileInfo.exists) {
            await Sharing.shareAsync(filePath);
        } else {
            console.warn('Selected document file does not exist.');
        }
    };

    const createDocument = async () => {
        console.log("createDocument", selectedDocuments);
        try {
            const chatFolderId = await fetchFolderData()
            const fileData = new FormData();
            let fileNameStored;



            selectedDocuments.forEach((document) => {
                const fileUri = document.uri;
                const fileType = document.mimeType;
                const fileName = document.name;
                fileNameStored = document.name
                const folderId = chatFolderId;

                fileData.append("documents", {
                    uri: fileUri,
                    name: fileName,
                    type: fileType,
                });

                console.log("File URI: ", fileUri);

                // Append other required data to the FormData object
                fileData.append("chatId", chatId);
                fileData.append("description", `Chat ${chatId}: (${fileName})`);
                fileData.append("folderId", folderId);
                fileData.append("userId", userId);
            });

            const response = await fetch(`${BASE_URL}/user/documents/upload`, {
                method: "post",
                body: fileData,
            });

            // Check the response status and log the result
            if (response.ok) {
                const data = await response.json();
                console.log("Upload response:", data);
                Alert.alert(`Files uploaded successfully.`)
                sendMessage(`Document ID: ${data.documentIds} ${fileNameStored} sent.`)
            } else {
                console.log("File upload failed ", response);
                Alert.alert("File upload failed.")
            }
        } catch (error) {
            console.log("Error upload:", error);
        }
    }

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={isVisible}
            onRequestClose={onClose}
        >
        <View style={styles.container}>
            <Text style={styles.label}>Select Document</Text>
            {selectedDocuments && selectedDocuments.length > 0 ? (
                <View style={styles.documentContainer}>
                    <TouchableOpacity
                        style={styles.selectedDocumentContainer}
                        onPress={async () => {
                            if (selectedDocuments && selectedDocuments[0].uri) {

                                const filePath = selectedDocuments[0].uri;
                                console.log('Opening document:', filePath);

                                // Check if the file exists
                                const fileInfo = await FileSystem.getInfoAsync(filePath);
                                // console.log('File exists:', fileInfo)
                                if (fileInfo.exists) {
                                    // Request permission to access the file
                                    console.log('File exists:', filePath)
                                    const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
                                    openPdf(filePath);
                                } else {
                                    console.warn('Selected document file does not exist.');
                                }
                            } else {
                                console.warn('Selected document URI is not valid.');
                            }
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', alignSelf: "center" }}>
                            <Ionicons name="document-text-outline" size={24} color="blue" />
                            <Text style={styles.selectedDocumentText}> Selected Document: </Text>
                            <Text style={styles.selectedDocumentName}>
                                {selectedDocuments[0].name}
                            </Text>
                        </View>

                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row' }}>
                        <View>
                            <TouchableOpacity
                                style={styles.replaceDocumentButton}
                                onPress={handleSelectDocument}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons name="repeat-outline" size={24} color="white" />
                                    <Text style={styles.buttonText}> Replace</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.removeDocumentButton}
                                onPress={() => {
                                    // Handle removing the selected document
                                    setSelectedDocuments([]);
                                    setIsDocumentUploaded(false);
                                }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons name="trash-bin-outline" size={24} color="white" />
                                    <Text style={styles.buttonText}> Remove</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <Text>&nbsp;&nbsp;</Text>
                        <View>
                            <TouchableOpacity
                                style={styles.viewDocumentButton}
                                onPress={async () => {
                                    if (selectedDocuments && selectedDocuments[0].uri) {

                                        const filePath = selectedDocuments[0].uri;
                                        console.log('Opening document:', filePath);

                                        // Check if the file exists
                                        const fileInfo = await FileSystem.getInfoAsync(filePath);
                                        // console.log('File exists:', fileInfo)
                                        if (fileInfo.exists) {
                                            // Request permission to access the file
                                            console.log('File exists:', filePath)
                                            const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
                                            openPdf(filePath);
                                        } else {
                                            console.warn('Selected document file does not exist.');
                                        }
                                    } else {
                                        console.warn('Selected document URI is not valid.');
                                    }
                                }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons name="eye-outline" size={24} color="white" />
                                    <Text style={styles.buttonText}> View</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.viewDocumentButton}
                                onPress={createDocument}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons name="arrow-up" size={24} color="white" />
                                    <Text style={styles.buttonText}> Upload</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            ) : (
                <TouchableOpacity
                    style={styles.selectDocumentButton}
                    onPress={handleSelectDocument}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="add-outline" size={24} color="white" />
                        <Text style={styles.buttonText}>Upload Documents to Chat</Text>
                    </View>
                </TouchableOpacity>
            )}
            <TouchableOpacity
                style={[styles.selectDocumentButton, {marginBottom: 10, marginHorizontal: 5}]}
                onPress={onClose}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="close-circle" size={24} color="white" />
                    <Text style={styles.buttonText}>Hide</Text>
                </View>
            </TouchableOpacity>
        </View>
        </Modal>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        padding: 20,
        flexDirection: "column",
        justifyContent: "center"
    },
    label: {
        marginTop: 10,
        fontWeight: '600',
        fontSize: 18,
        color: '#333',
    },
    selectDocumentButton: {
        backgroundColor: '#3498db',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 15,
    },
    selectDocumentButtonText: {
        color: 'white',
        fontSize: 16,
        marginLeft: 10,
    },
    documentContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 15,
        marginTop: 20,
        backgroundColor: '#fff',
        alignItems: "center",
        justifyContent: "center"
    },
    selectedDocumentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    documentName: {
        fontSize: 14,
        color: '#333',
        flex: 1,
        marginLeft: 10,
    },
    replaceDocumentButton: {
        backgroundColor: '#f1c40f',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    removeDocumentButton: {
        backgroundColor: '#e74c3c',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    viewDocumentButton: {
        backgroundColor: '#2ecc71',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});


export default ChatDocumentUpload;
