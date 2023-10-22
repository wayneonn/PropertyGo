import axios from 'axios';
import configData from "../config.json"

const BASE_URL = configData.BASE_URL;

export const getAllNotification = async (userId, filter) => {
    try {
        const response = await axios.get(`${BASE_URL}/user/${userId}/notification/${filter}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const countUnreadNotifications = async (userId) => {
    try {
        const response = await axios.get(`${BASE_URL}/user/${userId}/countUnreadNotifications`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};