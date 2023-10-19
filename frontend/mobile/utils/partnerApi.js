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