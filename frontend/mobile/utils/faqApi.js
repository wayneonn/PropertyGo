import axios from 'axios';
import configData from "../config.json"

const BASE_URL = configData.BASE_URL;

export const getAllBuyerFAQ = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/user/faq/buyer`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getAllSellerFAQ = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/user/faq/seller`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};