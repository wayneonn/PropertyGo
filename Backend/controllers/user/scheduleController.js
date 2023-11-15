const { Schedule, Notification, User, Property, Chat } = require('../../models');
const { loggedInUsers } = require('../../shared');

async function createSchedule(req, res) {
    const scheduleData = req.body;
    try {
        const createdSchedule = await Schedule.create(scheduleData);
        const userId = parseInt(createdSchedule.userId);

        const user = await User.findByPk(createdSchedule.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const property = await Property.findByPk(createdSchedule.propertyId);
        // const propertyUser = await property.getUser();

        const content = `${user.userName.charAt(0).toUpperCase() + user.userName.slice(1)} has made a viewing appointing on the ${createdSchedule.meetupDate} at ${createdSchedule.meetupTime} for your property ${property.title}`;

        const notificationBody = {
            "isRecent": true,
            "isPending": false,
            "isCompleted": false,
            "hasRead": false,
            "userNotificationId": userId,
            "userId" : property.sellerId,
            "content" : content,
            "scheduleId" : createdSchedule.scheduleId,
        };

        await Notification.create(notificationBody);

        const propertyUser = await property.getSeller();

        if (propertyUser && loggedInUsers.has(propertyUser.userId)){
            // console.log("propertyUser :", propertyUser)
            req.io.emit("userNotification", {"pushToken": propertyUser.pushToken, "title": property.title, "body": content});
            console.log("Emitted userNewForumCommentNotification");
        }

        res.json(createdSchedule);
    } catch (error) {
        console.error("Error creating schedule:", error);
        res.status(500).json({ error: "Error creating schedule" });
    }
}

async function sellerApprovesViewing(req, res) {
    try {
      const { scheduleId } = req.params;
  
      // Find the user by ID
      const schedule = await Schedule.findByPk(scheduleId);
  
      if (!schedule) {
        return res.status(404).json({ message: 'Schedule not found' });
      }

      schedule.ScheduleStatus = 'SELLER_CONFIRMED';
  
      // Add the property to the user's favorites
      await schedule.save();

      //Notification

      const user = await User.findByPk(schedule.sellerId); // Seller Info
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const property = await Property.findByPk(schedule.propertyId);

      const content = `${user.userName.charAt(0).toUpperCase() + user.userName.slice(1)} has confirmed your request on viewing for the ${schedule.meetupDate} at ${schedule.meetupTime} for ${property.title}`;

      const notificationBody = {
          "isRecent": true,
          "isPending": false,
          "isCompleted": false,
          "hasRead": false,
          "userNotificationId": schedule.sellerId, 
          "userId" : schedule.userId,
          "content" : content,
          "scheduleId" : schedule.scheduleId,
      };

      await Notification.create(notificationBody);

      const scheduleUser = await schedule.getSeller();

      if (scheduleUser && loggedInUsers.has(scheduleUser.userId)){
          // console.log("propertyUser :", propertyUser)
          req.io.emit("userNotification", {"pushToken": scheduleUser.pushToken, "title": property.title, "body": content});
          console.log("Emitted userNewForumCommentNotification");
      }
  
      res.status(201).json({ message: 'Schedule is approved' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  async function sellerRejectsViewing(req, res) {
    try {
      const { scheduleId } = req.params;
  
      // Find the user by ID
      const schedule = await Schedule.findByPk(scheduleId);
  
      if (!schedule) {
        return res.status(404).json({ message: 'Schedule not found' });
      }

      schedule.ScheduleStatus = 'SELLER_REJECT';
  
      // Add the property to the user's favorites
      await schedule.save();

      //Notification

      const user = await User.findByPk(schedule.sellerId); // Seller Info
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const property = await Property.findByPk(schedule.propertyId);

      const content = `${user.userName.charAt(0).toUpperCase() + user.userName.slice(1)} has rejected your request on viewing for the ${schedule.meetupDate} at ${schedule.meetupTime} for ${property.title}`;

      const notificationBody = {
          "isRecent": true,
          "isPending": false,
          "isCompleted": false,
          "hasRead": false,
          "userNotificationId": schedule.sellerId, 
          "userId" : schedule.userId,
          "content" : content,
          "scheduleId" : schedule.scheduleId,
      };

      await Notification.create(notificationBody);

      const scheduleUser = await schedule.getSeller();

      if (scheduleUser && loggedInUsers.has(scheduleUser.userId)){
          // console.log("propertyUser :", propertyUser)
          req.io.emit("userNotification", {"pushToken": scheduleUser.pushToken, "title": property.title, "body": content});
          console.log("Emitted userNewForumCommentNotification");
      }
  
      res.status(201).json({ message: 'Schedule has been rejected by the buyer' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

async function getScheduleById(req, res) {
    const scheduleId = req.params.scheduleId;

    try {
        const schedule = await Schedule.findByPk(scheduleId);

        if (!schedule) {
            return res.status(404).json({ error: 'Schedule not found' });
        }

        res.json(schedule);
    } catch (error) {
        console.error('Error fetching schedule:', error);
        res.status(500).json({ error: 'Error fetching schedule' });
    }
}

async function sellerCancelsViewing(req, res) {
    try {
      const { scheduleId } = req.params;
  
      // Find the user by ID
      const schedule = await Schedule.findByPk(scheduleId);
  
      if (!schedule) {
        return res.status(404).json({ message: 'Schedule not found' });
      }

      schedule.ScheduleStatus = 'SELLER_CANCELLED';
  
      // Add the property to the user's favorites
      await schedule.save();

      //Notification

      const user = await User.findByPk(schedule.sellerId); // Seller Info
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const property = await Property.findByPk(schedule.propertyId);

      const content = `${user.userName.charAt(0).toUpperCase() + user.userName.slice(1)} has cancelled the viewing for the ${schedule.meetupDate} at ${schedule.meetupTime} for ${property.title}`;

      const notificationBody = {
          "isRecent": true,
          "isPending": false,
          "isCompleted": false,
          "hasRead": false,
          "userNotificationId": schedule.sellerId, 
          "userId" : schedule.userId,
          "content" : content,
          "scheduleId" : schedule.scheduleId,
      };

      await Notification.create(notificationBody);

      const scheduleUser = await schedule.getSeller();

      if (scheduleUser && loggedInUsers.has(scheduleUser.userId)){
          // console.log("propertyUser :", propertyUser)
          req.io.emit("userNotification", {"pushToken": scheduleUser.pushToken, "title": property.title, "body": content});
          console.log("Emitted userNewForumCommentNotification");
      }
  
      res.status(201).json({ message: 'Schedule has been cancelled by the seller' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  async function buyerCancelsViewing(req, res) {
    try {
      const { scheduleId } = req.params;
  
      // Find the user by ID
      const schedule = await Schedule.findByPk(scheduleId);
  
      if (!schedule) {
        return res.status(404).json({ message: 'Schedule not found' });
      }

      schedule.ScheduleStatus = 'BUYER_CANCELLED';
  
      // Add the property to the user's favorites
      await schedule.save();

      //Notification

      const user = await User.findByPk(schedule.userId); // Seller Info
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const property = await Property.findByPk(schedule.propertyId);

      const content = `${user.userName.charAt(0).toUpperCase() + user.userName.slice(1)} has cancelled the viewing for the ${schedule.meetupDate} at ${schedule.meetupTime} for ${property.title}`;

      const notificationBody = {
          "isRecent": true,
          "isPending": false,
          "isCompleted": false,
          "hasRead": false,
          "userNotificationId": schedule.userId, 
          "userId" : schedule.sellerId,
          "content" : content,
          "scheduleId" : schedule.scheduleId,
      };

      await Notification.create(notificationBody);

      const scheduleUser = await schedule.getUser();

      if (scheduleUser && loggedInUsers.has(scheduleUser.userId)){
          // console.log("propertyUser :", propertyUser)
          req.io.emit("userNotification", {"pushToken": scheduleUser.pushToken, "title": property.title, "body": content});
          console.log("Emitted userNewForumCommentNotification");
      }
  
      res.status(201).json({ message: 'Schedule has been cancelled by the buyer' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

async function getScheduleById(req, res) {
    const scheduleId = req.params.scheduleId;

    try {
        const schedule = await Schedule.findByPk(scheduleId);

        if (!schedule) {
            return res.status(404).json({ error: 'Schedule not found' });
        }

        res.json(schedule);
    } catch (error) {
        console.error('Error fetching schedule:', error);
        res.status(500).json({ error: 'Error fetching schedule' });
    }
}

async function updateScheduleByUserIdAndDate(req, res) {
    const userId = req.params.userId;
    const date = req.params.date; // Assuming date is in the format 'YYYY-MM-DD'
    const updatedScheduleData = req.body;
    const formattedDate = updatedScheduleData.meetupDate.substring(0, 10);

    console.log("updateScheduleByUserIdAndDate formattedDate: ", formattedDate)
    console.log("updateScheduleByUserIdAndDate updatedScheduleData: ", updatedScheduleData)
    console.log("updateScheduleByUserIdAndDate userId: ", userId)
    try {
        // Find the schedule by userId and date
        const schedule = await Schedule.findOne({
            where: {
                userId: updatedScheduleData.userId,
                meetupDate: formattedDate,
            },
        });

        if (!schedule) {
            console.log('Schedule not found')
            return res.status(404).json({ error: 'Schedule not found' });
        }

        // Update the schedule with the provided data
        await schedule.update(updatedScheduleData);

        console.log('Schedule updated successfully')
        res.json({ message: 'Schedule updated successfully', schedule });
    } catch (error) {
        console.error('Error updating schedule:', error);
        res.status(500).json({ error: 'Error updating schedule' });
    }
}


async function deleteSchedule(req, res) {
    const scheduleId = req.params.scheduleId;

    try {
        const schedule = await Schedule.findByPk(scheduleId);

        if (!schedule) {
            return res.status(404).json({ error: 'Schedule not found' });
        }

        await schedule.destroy();

        res.json({ message: 'Schedule removed successfully' });
    } catch (error) {
        console.error('Error deleting schedule:', error);
        res.status(500).json({ error: 'Error deleting schedule' });
    }
}

async function getScheduleByDateAndPropertyId(req, res) {
    const { meetupDate, propertyId } = req.query;

    try {
        // Query the database to find viewing availability for the specified date and property ID
        const schedule = await Schedule.findAll({
            where: {
                meetupDate,
                propertyId: propertyId,
            },
        });

        if (!schedule || schedule.length === 0) {
            return res.status(404).json({ error: 'Viewing availability not found for the specified date and property ID' });
        }

        res.json(schedule);
    } catch (error) {
        console.error('Error fetching viewing availability by date and property ID:', error);
        res.status(500).json({ error: 'Error fetching viewing availability by date and property ID' });
    }
}

async function getScheduleByUserId(req, res) {
    const userId = req.params.userId;

    try {
        // Query the database to find schedules for the specified user
        const schedule = await Schedule.findAll({
            where: {
                userId,
            },
        });

        if (!schedule || schedule.length === 0) {
            return res.status(404).json({ error: 'Schedules not found for the specified user' });
        }

        res.json(schedule);
    } catch (error) {
        console.error('Error fetching schedules by user ID:', error);
        res.status(500).json({ error: 'Error fetching schedules by user ID' });
    }
}

async function getScheduleByPropertyId(req, res) {
    const propertyId = req.params.propertyId;

    try {
        // Query the database to find schedules for the specified user
        const schedule = await Schedule.findAll({
            where: {
                propertyId,
            },
        });

        if (!schedule || schedule.length === 0) {
            return res.status(404).json({ error: 'Schedules not found for the specified property' });
        }

        res.json(schedule);
    } catch (error) {
        console.error('Error fetching schedules by Property ID:', error);
        res.status(500).json({ error: 'Error fetching schedules by Property ID' });
    }
}

async function getScheduleBySellerId(req, res) {
    const sellerId = req.params.sellerId;

    try {
        // Query the database to find schedules for the specified user
        const schedule = await Schedule.findAll({
            where: {
                sellerId,
            },
        });

        if (!schedule || schedule.length === 0) {
            return res.status(404).json({ error: 'Schedules not found for the specified seller.' });
        }

        res.json(schedule);
    } catch (error) {
        console.error('Error fetching schedules by Seller ID:', error);
        res.status(500).json({ error: 'Error fetching schedules by Seller ID' });
    }
}

async function getScheduleByChatId(req, res) {
    const chatId = req.params.chatId;
    try {
        // Query the database to find schedules for the specified chat ID
        const schedules = await Schedule.findAll({
            where: {
                chatId,
            },
        });
        if (!schedules || schedules.length === 0) {
            return res.status(404).json({ error: 'Schedules not found for the specified chat ID' });
        }
        res.json(schedules);
    } catch (error) {
        console.error('Error fetching schedules by Chat ID:', error);
        res.status(500).json({ error: 'Error fetching schedules by Chat ID' });
    }
}

async function createScheduleWithChat(req, res) {
    const scheduleData = req.body;
    try {
        // Ensure that scheduleData includes chatId
        if (!scheduleData.chatId) {
            return res.status(400).json({ message: 'Chat ID is required' });
        }
        const createdSchedule = await Schedule.create(scheduleData);
        // Fetch user details
        const user = await User.findByPk(createdSchedule.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Fetch chat details
        const chat = await Chat.findByPk(createdSchedule.chatId);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        // You might need to adjust this content based on how your Chat model is structured
        const content = `${user.userName.charAt(0).toUpperCase() + user.userName.slice(1)} has made a new schedule for a chat on ${createdSchedule.meetupDate} at ${createdSchedule.meetupTime}`;

        const notificationBody = {
            "isRecent": true,
            "isPending": false,
            "isCompleted": false,
            "hasRead": false,
            "userNotificationId": userId,
            // Assuming you want to notify partner in the chat
            "userId": chat.receiverId,
            "content": content,
            "scheduleId": createdSchedule.scheduleId,
        };

        await Notification.create(notificationBody);

        // Logic for real-time notification to the other participant in the chat
        // Adjust this based on your application's logic and structure
        const otherParticipant = await User.findByPk(chat.receiverId);
        if (otherParticipant && loggedInUsers.has(otherParticipant.userId)){
            req.io.emit("userNotification", {"pushToken": otherParticipant.pushToken, "title": "New Schedule", "body": content});
            console.log("Emitted new schedule notification");
        }
        res.json(createdSchedule);
    } catch (error) {
        console.error("Error creating schedule with chat:", error);
        res.status(500).json({ error: "Error creating schedule with chat" });
    }
}


module.exports = {
    createSchedule,
    getScheduleById,
    updateScheduleByUserIdAndDate,
    deleteSchedule,
    getScheduleByDateAndPropertyId,
    getScheduleByUserId,
    getScheduleByPropertyId,
    getScheduleBySellerId,
    sellerApprovesViewing,
    sellerRejectsViewing,
    sellerCancelsViewing,
    buyerCancelsViewing,
    // This is the break to Partner functions
    getScheduleByChatId,
    createScheduleWithChat,
};
