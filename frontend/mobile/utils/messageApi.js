import axios from 'axios';
import configData from "../config.json"

const BASE_URL = configData.BASE_URL;

export const addMessage = async (messageData) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/user/message`,
            messageData
        );
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const changeMessage = async(messageData) => {
    try {
        const response = await axios.put(
            `${BASE_URL}/user/message/update`,
            messageData
        );
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}