// This is all the API calls for Documents.
import configData from "../config.json"

export const BASE_URL = configData.BASE_URL

// Dumping all my API's here.
export const fetchFolders = async (USER_ID) => {
    try {
        const response = await fetch(`${BASE_URL}/user/folders/${USER_ID}}`);
        const results = await response.json();
        return results.folders;
    } catch (error) {
        console.error(error);
    }
};

export const fetchTransactions = async (USER_ID) => {
    try {
        const response = await fetch(`${BASE_URL}/user/transactions/${USER_ID}`);
        const results = await response.json();
        return results.transactions;
    } catch (error) {
        console.error(error);
    }
};

export const fetchDocuments = async (USER_ID) => {
    try {
        const response = await fetch(
            `${BASE_URL}/user/documents/list/metadata/${USER_ID}}`
        );
        const documents = await response.json();
        return documents;
    } catch (error) {
        console.error(error);
    }
};

export const fetchDocumentById = async (APP_ID) => {
    try {
        const response = await fetch(
            `${BASE_URL}/user/documents/app/metadata/${APP_ID}`
        );
        const documents = await response.json();
        return documents;
    } catch (error) {
        console.error(error);
    }
}