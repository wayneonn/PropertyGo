import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

// Function to create a new ContactUs record
export const createContactUs = async (userId, contactUsData) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/user/${userId}/contactUs`,
            contactUsData
        );
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Function to get ContactUs records for a specific user
export const getUserContactUs = async (userId) => {
    try {
        const response = await axios.get(`${BASE_URL}/user/${userId}/contactUs`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};