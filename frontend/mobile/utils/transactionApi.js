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

export const fetchAverageCountryCount = async() => {
    try {
        const res = await fetch(`${BASE_URL}/user/transactions/data/average`)
        const results = await res.json();
        console.log(results, "Average count.")
        return results;
    } catch (error) {
        console.log("Error fetching average transaction values: ", error)
    }
}

export const fetchAverageTransactionCount = async() => {
    try {
        const res = await fetch(`${BASE_URL}/user/transactions/data/count`)
        const results = await res.json();
        console.log(results, "Average count of transactions.")
        return results;
    } catch (error) {
        console.log("Error fetching average transaction values: ", error)
    }
}

export const createTransaction = async (transactionData) => {
    // console.log("transactionData: ", transactionData)
    try {
      const response = await fetch(`${BASE_URL}/user/transactions/createTransaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
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
  };

  export const createOptionFeeTransaction = async (transactionData) => {
    // console.log("transactionData: ", transactionData)
    try {
      const response = await fetch(`${BASE_URL}/user/transactions/createOptionFeeTransaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
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
  };

  export const sellerUploadedOTP = async (transactionId, transactionData) => {
    // console.log("transactionData: ", transactionData)
    try {
      const response = await fetch(`${BASE_URL}/user/transactions/sellerUploadedOTP/${transactionId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
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
  };

  export const getTransactionByTransactionId = async (transactionId) => {
    // console.log("transactionData: ", transactionData)
    try {
      const response = await fetch(`${BASE_URL}/user/transactions/byTransactionId/${transactionId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
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
  };


  export const fetchUserTransactions = async (USER_ID) => {
    try {
        const response = await fetch(`${BASE_URL}/user/transactions/byUserId/${USER_ID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        console.log("response: ", response)
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { success: false, message: errorData.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };