import {BASE_URL} from "./documentApi";

export const fetchAllTransactions = async(USER_ID) => {
    try {
        const res = await fetch(`${BASE_URL}/user/transactions/${USER_ID}`)
        const results = await res.json();
        return results;
    } catch (error) {
        console.error(error);
    }
}
export const fetchTopTransactions = async(USER_ID) => {
    try {
        const res = await fetch(`${BASE_URL}/user/transactions/top/${USER_ID}`)
        const results = await res.json();
        return results;
    } catch (error) {
        console.error(error);
    }
}

export const fetchTopTransactionsWithUsers = async(USER_ID) => {
    try {
        const res = await fetch(`${BASE_URL}/user/transactions/omega_top/${USER_ID}`)
        const results = await res.json();
        return results;
    } catch (error) {
        console.error(error);
    }
}

export const fetchTopTransactionsWithUsersStatus = async(USER_ID, STATUS) => {
    try {
        const res = await fetch(`${BASE_URL}/user/transactions/omega_top/${STATUS}/${USER_ID}`)
        const results = await res.json();
        return results;
    } catch (error) {
        console.error(error);
    }
}


export const fetchMonthlyTransactions = async(USER_ID) => {
    try {
        const res = await fetch(`${BASE_URL}/user/transactions/sixmonths/${USER_ID}`)
        const results = await res.json();
        return results;
    } catch (error) {
        console.error(error);
    }
}

export const fetchBuyerIdTransactions = async(USER_ID) => {
    try {
        const res = await fetch(`${BASE_URL}/user/transactions/buyerid/${USER_ID}`)
        const results = await res.json();
        return results;
    } catch (error) {
        console.error(error);
    }
}

export const fetchTransactionCountryCount = async(USER_ID) => {
    try {
        const res = await fetch(`${BASE_URL}/user/transactions/countrycount/${USER_ID}`)
        const results = await res.json();
        return results;
    } catch (error) {
        console.error(error);
    }
}