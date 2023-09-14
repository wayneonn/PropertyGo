const BASE_URL = 'http://localhost:3000';
const BASE_URL_WAYNE = 'http://172.25.106.189:3000';
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
  