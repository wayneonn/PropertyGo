export const getTimeAgo = (timestamp) => {
    // Convert the timestamp to a Date object
    const createdAt = new Date(timestamp);
  
    // Get the current date and time
    const currentDate = new Date();
  
    // Calculate the time difference in milliseconds
    const timeDifference = currentDate - createdAt;
  
    // Calculate the number of days, hours, minutes, and seconds
    const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hoursAgo = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesAgo = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const secondsAgo = Math.floor((timeDifference % (1000 * 60)) / 1000);
  
    // Create a string representation of the time ago
    let timeAgoString = "";
  
    if (daysAgo > 0) {
      timeAgoString += `${daysAgo} ${daysAgo === 1 ? "day" : "days"}`;
    } else if (hoursAgo > 0) {
      timeAgoString += `${hoursAgo} ${hoursAgo === 1 ? "hour" : "hours"}`;
    } else if (minutesAgo > 0) {
      timeAgoString += `${minutesAgo} ${minutesAgo === 1 ? "min" : "mins"}`;
    } else {
      timeAgoString += `${secondsAgo} ${secondsAgo === 1 ? "s" : "s"}`;
    }
  
    // Return the time ago string
    return timeAgoString.trim() + " ago";
  };
  