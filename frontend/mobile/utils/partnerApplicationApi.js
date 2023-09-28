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
