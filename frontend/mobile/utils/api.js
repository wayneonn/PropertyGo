const BASE_URL = 'http://localhost:3000';
const BASE_URL_WAYNE = 'http://10.0.0.17:3000';
const USER_ENDPOINT = 'user';

export const loginUser = async (userName, password) => {
    try {
      const response = await fetch(`${BASE_URL}/${USER_ENDPOINT}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName, password }),
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

  export const signUpUser = async (userData) => {
    try {
      const response = await fetch(`${BASE_URL}/${USER_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  export const updateUserProfile = async (userId, userData) => {
    try {
      const response = await fetch(`${BASE_URL}/${USER_ENDPOINT}/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
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
  
  
  