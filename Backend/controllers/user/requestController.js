const { Request, User, Notification, Chat, Property } = require("../../models");
const sequelize = require('sequelize');
const { loggedInUsers } = require('../../shared');

const createRequest = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const { chatId, price } = req.body;
    
        // Assuming you want to set userId in the Request model
        req.body.userId = userId;
    
        const chat = await Chat.findByPk(chatId, {
            include: [{
                model: Property,
                as:"propertyListing"
            }]
        });

        if (!chat) {
            return res.status(404).json({ message: 'Chat Not Found' });
        }


        const sender = await User.findByPk(userId);
        const reveiver = await chat.getReceiver();

        const content = `${sender.userName.charAt(0).toUpperCase() + sender.userName.slice(1)} has made a request on "${chat.propertyListing.title}"`;

        const notificationBody = {
            "isRecent": true,
            "isPending": true,
            "isCompleted": false,
            "hasRead": false,
            "userNotificationId": userId,
            "userId" : reveiver.userId,
            "content" : content,
            // "userNavigationScreen" : "sellerChat"
        };

        await Notification.create(notificationBody);

        if (reveiver && loggedInUsers.has(reveiver.userId) && reveiver.userId !== userId){
            req.io.emit("userNotification", {"pushToken": reveiver.pushToken, "title": chat.propertyListing.title, "body": content});
            // console.log("Emitted userNewForumCommentNotification");
        }


        const request = await Request.create(req.body);


        res.status(201).json({ request });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateRequest = async (req, res) => {
    const requestId = parseInt(req.params.requestId);
    const {requestStatus , price} = req.body

    const request = await Request.findByPk(requestId)

    if (!request) {
        return res.status(404).json({ message: 'Request not found' });
    }

    try {

        if (requestStatus) {
            request.requestStatus = requestStatus;
        }
        
        if(price) {
            request.price = price;
        }
        
        await request.save(); // Use 'await' to ensure the save operation is complete
        res.status(200).json({ message: 'Request updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createRequest,
    updateRequest
};