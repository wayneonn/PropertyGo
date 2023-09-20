import { Platform } from "react-native";

const BASE_URL = "http://10.249.191.117:3000";
// Please change it back to whatever your IP address is. 
const BASE_URL_WAYNE = "http://10.0.0.17:3000";
const USER_ENDPOINT = "user";

export const loginUser = async (userName, password) => {
  try {
    const response = await fetch(`${BASE_URL}/${USER_ENDPOINT}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

export const updateUserProfile = async (userId, formData) => {
  try {
    const response = await fetch(`${BASE_URL}/${USER_ENDPOINT}/${userId}`, {
      method: "PUT",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data", // Explicitly set the Content-Type
      },
    });

    if (response.ok) {
      const data = await response.json();
      // console.log('Update Profile Response:', data); // Add this log statement
      return { success: true, data };
    } else {
      const errorData = await response.json();
      console.error("Update Profile Error:", errorData); // Add this log statement
      return { success: false, message: errorData.message };
    }
  } catch (error) {
    console.error("Update Profile Error:", error); // Add this log statement
    return { success: false, message: error.message };
  }
};

export const updateUserProfilePicture = async (userId, imageUri) => {
  try {
    const formData = new FormData();
    formData.append("profileImage", {
      uri: imageUri,
      type: "image/jpeg",
      name: "profile.jpg",
    });

    const responseUpload = await fetch(
      `${BASE_URL}/${USER_ENDPOINT}/${userId}/profilePicture`,
      {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (responseUpload.ok) {
      const data = await responseUpload.json();
      return { success: true, data };
    } else {
      const errorData = await responseUpload.json();
      console.error("Update Profile Picture Error:", errorData);
      return { success: false, message: errorData.message };
    }
  } catch (error) {
    console.error("Update Profile Picture Error:", error);
    return { success: false, message: error.message };
  }
};
