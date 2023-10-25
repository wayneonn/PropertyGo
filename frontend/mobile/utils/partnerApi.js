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

export const uploadCompanyPhotos = async(USER_ID, images) => {
    try {
        const formData = new FormData();

        images.forEach((image, index) => {
            console.log("URI: ", image.uri)
            const imageBlob = {
                uri: image.uri,
                type: 'image/jpeg',
                name: `companyImage${index}.jpg`,
            };

            formData.append(`images`, imageBlob);
        });

        const response = await fetch(`${BASE_URL}/${USER_ID}/addCompanyPhotos`, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.ok) {
            const data = await response.json();
            return {success: true, data};
        } else {
            const errorData = await response.json();
            console.log("Image upload error data: ", errorData)
            return {success: false, message: errorData.error};
        }
    } catch (error) {
        return {success: false, message: error.message};
    }
}