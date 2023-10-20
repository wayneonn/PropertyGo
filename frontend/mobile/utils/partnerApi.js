// This is the API for PartnerApp

import {BASE_URL} from "./documentApi";

export const fetchPartnerByRangeAndType = async(USER_TYPE, START, END) => {
    try {
        const res = await fetch(`${BASE_URL}/user/partners/${USER_TYPE}/${START}/${END}`)
        const results = await res.json();
        return results
    } catch (error) {
        console.error("Fetch partners failed: ", error)
    }
}

export const editUserBoost = async(USER_ID, userData) => {
        try {
            const response = await fetch(`${BASE_URL}/user/${USER_ID}/boost`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json', // Use JSON content type
                },
                body: JSON.stringify(userData), // Send propertyData as JSON string
            });

            if (response.ok) {
                const data = await response.json();
                return { success: true, data };
            } else {
                const errorData = await response.json();
                return { success: false, message: errorData.message };
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
}