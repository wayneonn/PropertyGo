// This is the API for Partner Applications.

import {BASE_URL} from "./documentApi";

export const fetchPartnerApplication = async(USER_ID) => {
    try {
        const response = await fetch(`${BASE_URL}/user/partner/list/${USER_ID}}`);
        const results = await response.json();
        return results;
    } catch (error) {
        console.error(error);
    }
}

export const sendPartnerApplication = async(USER_ID, formData) => {
    try {
        const response = await fetch(`${BASE_URL}/user/partner/list/${USER_ID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Data received:', data);
            return data;
        } else {
            console.log('Server responded with status:', response.status);
            return response.status;
        }
    } catch (error) {
        console.error('Fetch failed:', error);
    }
}
