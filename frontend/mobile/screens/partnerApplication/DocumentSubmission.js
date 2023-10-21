// This is a Document Submission screen.
// Prompt the User to create the Documents as needed.
// I need to work this properly.
import React, {useContext, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, SafeAreaView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFormData } from '../../contexts/PartnerApplicationFormDataContext';
import {DocumentSelector} from "../../components/DocumentSelector";
import {fetchDocuments, fetchFolders} from "../../utils/documentApi";
import {fetchPartnerApplication} from "../../utils/partnerApplicationApi";
import {AuthContext} from "../../AuthContext";

const DocumentSubmissionScreen = ({route}) => {
    const navigation = useNavigation();
    const { formData, setFormData } = useFormData(); // Using your context
    const [folders, setFolders] = useState([]) // For Document Selector
    const [selectedDocuments, setSelectedDocuments] = useState([]); // Local state to keep track of selected documents
    const {user} = useContext(AuthContext);
    const USER_ID = user.user.userId;

    useEffect(() => {
        fetchDataFromServer().then(r => console.log("Data completed."));
    }, []);

    useEffect(() => {
        console.log("Folder state has been updated:", folders);
    }, [folders]);

    const handleSubmit = () => {
        // Update the context with the new values
        setFormData({ ...formData, documents: selectedDocuments });
        // Navigate to the next screen or submit the form
        navigation.navigate('Ending'); // Replace with your actual next screen
    };

    const uploadSucceed = () => {
        console.log("Upload Done.")
        navigation.navigate("Login Portal");
    }

    // Slight bit of repeat here, need to clean this up.
    // Really the data fetching should all be done somewhere else to not repeat this.
    const fetchDataFromServer = async () => {
        try {
            const partnerApp = await fetchPartnerApplication(USER_ID)
            console.log(partnerApp.partnerApp);
            const folders = await fetchFolders(USER_ID) // Check if users have uploaded docs.
            console.log(folders)
            setFolders([...folders]);
        } catch (error) {
            console.error(error);
        }
    };


    // Do we still need to fetch data???
    // I think it just ignores it if it does not exist.
    // Probably just turn it into a free signal.
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Upload Documents</Text>
            <DocumentSelector documentFetch={uploadSucceed} folderState={folders} isTransaction={false}/>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#fff"
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
        marginTop: 60,
    },
    button: {
        marginTop: 20,
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
    },
});

export default DocumentSubmissionScreen;