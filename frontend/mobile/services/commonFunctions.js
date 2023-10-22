import base64 from "react-native-base64";

export const dateFormatter = (dateString) => {
    const dateObj = new Date(dateString);
    return dateObj.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

export function convertImage(profileImage) {
    console.log("This is the data array sent in for photos: ", profileImage)
    return base64.encodeFromByteArray(profileImage);
}