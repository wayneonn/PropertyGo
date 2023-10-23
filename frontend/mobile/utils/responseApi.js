import axios from 'axios';
import configData from "../config.json"

const BASE_URL = configData.BASE_URL;

export const createResponse = async (responseData) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/user/response`,
            responseData
        );
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};