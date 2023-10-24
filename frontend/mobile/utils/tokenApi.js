import axios from 'axios';
import configData from "../config.json"

const BASE_URL = configData.BASE_URL;

export const savePushToken = async (tokenData) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/user/savePushToken`,
            tokenData
        );
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
