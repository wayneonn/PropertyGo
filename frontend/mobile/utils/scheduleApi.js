import configData from "../config.json"
const BASE_URL = configData.BASE_URL;
const SCHEDULE_ENDPOINT = "schedule"; // Change this to your desired endpoint
const VIEWING_AVAILABILITY_ENDPOINT = "viewingAvailability"; // Change this to your desired endpoint

export const createSchedule = async (scheduleData) => {
  try {
    const response = await fetch(`${BASE_URL}/${SCHEDULE_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(scheduleData),
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

export const getScheduleById = async (scheduleId) => {
  try {
    const response = await fetch(`${BASE_URL}/${SCHEDULE_ENDPOINT}/${scheduleId}`, {
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

export const createViewingAvailability = async (availabilityData) => {
  try {
    const response = await fetch(`${BASE_URL}/${VIEWING_AVAILABILITY_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(availabilityData),
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

export const updateViewingAvailability = async (availabilityData, availabilityId) => {
    try {
      const response = await fetch(`${BASE_URL}/${VIEWING_AVAILABILITY_ENDPOINT}/${availabilityId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(availabilityData),
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
  

export const getViewingAvailabilityById = async (availabilityId) => {
  try {
    const response = await fetch(`${BASE_URL}/${VIEWING_AVAILABILITY_ENDPOINT}/${availabilityId}`, {
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

export const getViewingAvailabilityByDateAndPropertyId = async (date, propertyId) => {
    try {
      const response = await fetch(`${BASE_URL}/${VIEWING_AVAILABILITY_ENDPOINT}/date-property?date=${date}&propertyId=${propertyId}`, {
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
  
  export const getViewingAvailabilityByPropertyId = async (propertyId) => {

    try {
      const response = await fetch(`${BASE_URL}/${VIEWING_AVAILABILITY_ENDPOINT}/property?propertyId=${propertyId}`, {
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

  export const removeViewingAvailability = async (availabilityId) => {
    try {
        const response = await fetch(`${BASE_URL}/${VIEWING_AVAILABILITY_ENDPOINT}/${availabilityId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
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

  export const getScheduleByDateAndPropertyId = async (meetupDate, propertyId) => {
    try {
      const response = await fetch(`${BASE_URL}/${SCHEDULE_ENDPOINT}/date-property?meetupDate=${meetupDate}&propertyId=${propertyId}`, {
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

  export const updateSchedule = async (scheduleData, userId, date) => {
    console.log("updateSchedule date: ", date)
    try {
      const response = await fetch(`${BASE_URL}/${SCHEDULE_ENDPOINT}/${userId}/${date}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scheduleData),
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

  export const removeSchedule = async (scheduleId) => {
    try {
        const response = await fetch(`${BASE_URL}/${SCHEDULE_ENDPOINT}/${scheduleId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
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

  export const getScheduleByUserId = async (userId) => {
    try {
      const response = await fetch(`${BASE_URL}/${SCHEDULE_ENDPOINT}/byUserId/${userId}`, {
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

  export const getScheduleByPropertyId = async (propertyId) => {
    try {
      const response = await fetch(`${BASE_URL}/${SCHEDULE_ENDPOINT}/byPropertyId/${propertyId}`, {
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

  export const getScheduleBySellerId = async (sellerId) => {
    try {
      const response = await fetch(`${BASE_URL}/${SCHEDULE_ENDPOINT}/bySellerId/${sellerId}`, {
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

  export const sellerApprovesViewing = async (scheduleId) => {
    try {
      const response = await fetch(`${BASE_URL}/${SCHEDULE_ENDPOINT}/sellerApprovesViewing/${scheduleId}`, {
        method: "POST",
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

  export const sellerRejectsViewing = async (scheduleId) => {
    try {
      const response = await fetch(`${BASE_URL}/${SCHEDULE_ENDPOINT}/sellerRejectsViewing/${scheduleId}`, {
        method: "POST",
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

  export const sellerCancelsViewing = async (scheduleId) => {
    try {
      const response = await fetch(`${BASE_URL}/${SCHEDULE_ENDPOINT}/sellerCancelsViewing/${scheduleId}`, {
        method: "POST",
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

  export const buyerCancelsViewing = async (scheduleId) => {
    try {
      const response = await fetch(`${BASE_URL}/${SCHEDULE_ENDPOINT}/buyerCancelsViewing/${scheduleId}`, {
        method: "POST",
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