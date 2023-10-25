import RNHTMLtoPDF from "react-native-html-to-pdf";
import * as Sharing from "expo-sharing";
import * as FileSystem from 'expo-file-system';
import {Alert} from "react-native";
import {BASE_URL} from "../utils/documentApi";

exports.createPDF = async () => {
    try {
        const options = {
            html: '<h1>Hello World!</h1><p>This is a sample PDF document generated using react-native-html-to-pdf.</p>',
            fileName: 'sample',
            directory: 'Documents',
        };

        const pdf = await RNHTMLtoPDF.convert(options);
        console.log("PDF: ", pdf);
        const fileuri = pdf.filePath
        Alert.alert('PDF Created!', `PDF Path: ${pdf.filePath}`);
        const isAvailable = await Sharing.isAvailableAsync();
        if (!isAvailable) {
            Alert.alert(`Uh oh, sharing isn't available on your platform`);
            return;
        }

        if (fileuri) {
            Alert.alert("Downloaded to " + fileuri);
            await Sharing.shareAsync(fileuri);
        } else {
            alert("Failed to download PDF");
        }
    } catch (error) {
        Alert.alert('Error', 'Sorry, something went wrong. ', error);
    }
};

exports.downloadAndOpenPDF = async (USER_ID) => {
    try {
        // URL of your Express server that generates the PDF
        const pdfURL = `${BASE_URL}/user/transactions/pdf/${USER_ID}`;
        // Download the PDF to a temporary location on the device
        const { uri } = await FileSystem.downloadAsync(
            pdfURL,
            FileSystem.cacheDirectory + 'temp.pdf'
        );
        // Check if sharing is possible
        if (!(await Sharing.isAvailableAsync())) {
            alert("Sharing isn't available on your platform");
            return;
        }
        // Share the PDF using the device's native share modal
        await Sharing.shareAsync(uri);
    } catch (error) {
        console.error("Error fetching, saving or sharing PDF:", error);
    }
};

exports.downloadInvoicePDF = async (transactionId) => {
    try {
        // URL of your Express server that generates the PDF
        const pdfURL = `${BASE_URL}/user/transactions/invoicePdf/${transactionId}`;
        // Download the PDF to a temporary location on the device
        const { uri } = await FileSystem.downloadAsync(
            pdfURL,
            FileSystem.cacheDirectory + 'invoice.pdf'
        );
        // Check if sharing is possible
        if (!(await Sharing.isAvailableAsync())) {
            alert("Sharing isn't available on your platform");
            return;
        }
        // Share the PDF using the device's native share modal
        await Sharing.shareAsync(uri);
    } catch (error) {
        console.error("Error fetching, saving or sharing PDF:", error);
    }
};

