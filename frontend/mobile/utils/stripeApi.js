import configData from "../config.json";

const BASE_URL = configData.BASE_URL;
const USER_ENDPOINT = "user"; 
const STRIPE_ENDPOINT = "stripe"; // Change this to your desired endpoint

export const paymentSheet = async (paymentData) => {
  console.log("paymentData:", JSON.stringify(paymentData));
  try {
    const response = await fetch(`${BASE_URL}/${USER_ENDPOINT}/${STRIPE_ENDPOINT}/payment-sheet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });
    console.log("Response:", response);
    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      const errorData = await response.json();
      return { success: false, message: errorData.message };
    }
  } catch (error) {
    console.log("Error:", error)
    return { success: false, message: error.message };
  }
};
