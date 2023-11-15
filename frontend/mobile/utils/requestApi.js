
import axios from 'axios';
import configData from "../config.json"

const BASE_URL = configData.BASE_URL;

export const createRequest = async(USER_TYPE, START, END) => {
    try {
        const res = await fetch(`${BASE_URL}/user/partners/${USER_TYPE}/${START}/${END}`)
        const results = await res.json();
        return results
    } catch (error) {
        console.error("Fetch partners failed: ", error)
    }
}

export const createRequest = async (userId, requestData) => {
    try {

        // Make a POST request with the requestData
        const response = await axios.post(
            `${BASE_URL}/user/${userId}/request`,
            requestData
        );
        return response.data;

    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateRequest = async(requestId, requestData) => {
    try {
        const response = await axios.put(
            `${BASE_URL}/user/updateRequest/${requestId}`,
            requestData
        );
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
