import axios from 'axios';
import configData from "../config.json"

const BASE_URL = configData.BASE_URL;

// Function to create a new ContactUs record
export const createChat = async (senderId, chatData) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/user/${senderId}/chat`,
            chatData
        );
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Function to get ContactUs records for a specific user
export const getUserReceiverChat = async (userId) => {
    try {
        const response = await axios.get(`${BASE_URL}/user/${userId}/chat/getUserReceiverChat`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Function to get ContactUs records for a specific user
export const getUserSenderChat = async (userId) => {
    try {
        const response = await axios.get(`${BASE_URL}/user/${userId}/chat/getUserSenderChat`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getChatById = async (chatId) => {
    try {
        const response = await axios.get(`${BASE_URL}/user/chat/${chatId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};