import configData from "../config.json"

// const BASE_URL = "http://localhost:3000";
// Please change it back to whatever your IP address is.
const BASE_URL = configData.BASE_URL;
//const BASE_URL = "http://10.0.0.17:3000"; //Wayne's IP address
const USER_ENDPOINT = "user";
const PROPERTY_ENDPOINT = "property";
const IMAGE_ENDPOINT = "image";
const REVIEW_ENDPOINT = "review";

export const loginUser = async (userName, password) => {
    try {
        const response = await fetch(`${BASE_URL}/${USER_ENDPOINT}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({userName, password}),
        });

        if (response.ok) {
            const data = await response.json();
            return {success: true, data};
        } else {
            const errorData = await response.json();
            return {success: false, message: errorData.message};
        }
    } catch (error) {
        return {success: false, message: error.message};
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
            return {success: true, data};
        } else {
            return {success: false, error: data.error};
        }
    } catch (error) {
        return {success: false, error: error.message};
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
            return {success: true, data};
        } else {
            const errorData = await response.json();
            console.error('Update Profile Error:', errorData.error); // Add this log statement
            return {success: false, message: errorData.error};
        }
    } catch (error) {
        console.error("Update Profile Error:", error); // Add this log statement
        return {success: false, message: error.message};
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
            return {success: true, data};
        } else {
            const errorData = await responseUpload.json();
            console.error("Update Profile Picture Error:", errorData);
            return {success: false, message: errorData.message};
        }
    } catch (error) {
        console.error("Update Profile Picture Error:", error);
        return {success: false, message: error.message};
    }
};

export const createProperty = async (propertyData, images) => {
  try {
    const formData = new FormData();

    images.forEach((image, index) => {
      const imageBlob = {
        uri: image.uri,
        type: 'image/jpeg',
        name: `propertyImage${index}.jpg`,
      };

      formData.append(`images`, imageBlob);
    });

    formData.append('property', JSON.stringify(propertyData));

    const response = await fetch(`${BASE_URL}/${PROPERTY_ENDPOINT}`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // console.log('Formdata:', formData)

    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      const errorData = await response.json();
      return { success: false, message: errorData.error };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getPropertyListing = (propertyId) => {
  return `${BASE_URL}/${PROPERTY_ENDPOINT}/${propertyId}`;
};

export const getImageUriById = (imageId) => {
  return `${BASE_URL}/${IMAGE_ENDPOINT}/${imageId}`;
};

export const getUserById = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/${USER_ENDPOINT}/${userId}`, {
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

export const addFavoriteProperty = async (userId, propertyId) => {
  try {
    const response = await fetch(`${BASE_URL}/${USER_ENDPOINT}/${userId}/addFavorite/${propertyId}`, {
      method: 'POST',
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

export const removeFavoriteProperty = async (userId, propertyId) => {
  try {
    const response = await fetch(`${BASE_URL}/${USER_ENDPOINT}/${userId}/removeFavorite/${propertyId}`, {
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

export const getUserFavorites = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/${USER_ENDPOINT}/${userId}/favorites`, {
      method: 'GET',
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

export const isPropertyInFavorites = async (userId, propertyId) => {
  try {
    const response = await fetch(`${BASE_URL}/${USER_ENDPOINT}/${userId}/isPropertyInFavorites/${propertyId}`, {
      method: 'GET',
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

// Add a new route to filter properties by region
export const getPropertiesByRegion = async (region) => {
  try {
    const response = await fetch(`${BASE_URL}/${PROPERTY_ENDPOINT}/propertiesByRegion/${region}`, {
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

// Add a new route to get properties sorted by favorite count in descending order
export const getPropertiesByFavoriteCount = async () => {
  try {
    const response = await fetch(`${BASE_URL}/${PROPERTY_ENDPOINT}/topFavoritedProperty`, {
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

// Count the number of users who have favorited a property
export const countUsersFavoritedProperty = async (propertyId) => {
  try {
    const response = await fetch(`${BASE_URL}/${PROPERTY_ENDPOINT}/${propertyId}/numOfFavorite`, {
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

// Add a new route to get properties sorted by favorite count in descending order
export const getRecentlyAddedProperties = async () => {
  try {
    const response = await fetch(`${BASE_URL}/${PROPERTY_ENDPOINT}/recently-added`, {
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

// Add a new route to get properties posted by a specific user
export const getPropertiesByUser = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/${PROPERTY_ENDPOINT}/propertiesByUser/${userId}`, {
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

export const removeProperty = async (propertyId) => {
  try {
    const response = await fetch(`${BASE_URL}/${PROPERTY_ENDPOINT}/${propertyId}`, {
      method: "DELETE",
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

export const editProperty = async (propertyId, propertyData) => {
  try {
    const response = await fetch(`${BASE_URL}/${PROPERTY_ENDPOINT}/${propertyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json', // Use JSON content type
      },
      body: JSON.stringify(propertyData), // Send propertyData as JSON string
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


export const removeImageById = async (imageId) => {
  try {
    const response = await fetch(`${BASE_URL}/${IMAGE_ENDPOINT}/${imageId}`, {
      method: "DELETE",
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

// Update an image by its ID
export const updateImageById = async (imageId, updatedImage) => {
  try {
    const formData = new FormData();
    // console.log('Updated Image:', updatedImage.uri)
    // Append the updated image properties to the FormData object
    formData.append('image', {
      uri: updatedImage.uri, // Use the uri field to specify the URI
      type: 'image/jpeg',    // Modify the type according to your needs
      name: 'propertyImage.jpg',
    });

    formData.append('title', 'Updated Image Title'); // Modify the title as needed

    const response = await fetch(`${BASE_URL}/${IMAGE_ENDPOINT}/${imageId}`, {
      method: "PUT",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.ok) {
      // console.log('formData update image:', formData)
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


export const createImageWithPropertyId = async (propertyId, image) => {
  try {
    // console.log('Image:', image);
    const formData = new FormData();
    formData.append('image', {
      uri: image.uri,
      type: 'image/jpeg', // Modify the type according to your needs
      name: 'propertyImage.jpg',
    });
    formData.append('title', 'Property Image');

    const response = await fetch(`${BASE_URL}/${IMAGE_ENDPOINT}/createImageWithPropertyId/${propertyId}`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // console.log('Formdata Create Property:', formData)

    if (response.ok) {
      const data = await response.json();
      // console.log('Data:', data);
      return { success: true, data };
    } else {
      const errorData = await response.json();
      return { success: false, message: errorData.error };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const searchProperties = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}/${PROPERTY_ENDPOINT}/search?q=${query}`, {
      method: 'GET',
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

export const getRatingByUser = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/${REVIEW_ENDPOINT}/getRatingForUser/${userId}`, {
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

