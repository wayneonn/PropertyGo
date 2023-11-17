const { Message, Chat, User, Property } = require("../../models");
const { loggedInUsers } = require('../../shared');

const addMessage = async (req, res) => {
    try {
        // Validate the request data (e.g., req.body) to ensure required fields are present
        const { messageText, chatId, userId } = req.body;
        if (!messageText || !chatId || !userId) {
            return res.status(400).json({ message: 'Invalid message data' });
        }

        // Create a new message associated with the chat
        const message = await Message.create(req.body);

        const chat = await Chat.findByPk(chatId, {
            include: [{
                model: Property,
                as:"propertyListing"
            }]
        })
        
        if (!chat) {
            return res.status(404).json({ message: 'Chat Not Found' });
        }

        let user; 

        if (chat.senderId === userId) {
            chat.senderReplied = true;
            user = await User.findByPk(chat.receiverId);
        } else {
            chat.senderReplied = false;
            user = await User.findByPk(chat.senderId);
        }

        chat.save()

        const messageUser = await User.findByPk(userId);
        const content = `${messageUser.userName.charAt(0).toUpperCase() + messageUser.userName.slice(1)} has replied: "${messageText}" `;

        if (user && loggedInUsers.has(user.userId) && user.userId !== userId){
            req.io.emit("userChatNotification", {"pushToken": user.pushToken, "title": chat.propertyListing.title, "body": content, "chatNotificationBoolean" : true});
            // console.log("Emitted userNewForumCommentNotification");
        }
        
        res.status(201).json({ message });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = {
    addMessage
};