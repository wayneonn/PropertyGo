const { Chat, User, Message, Request, Property, Image } = require("../../models");

const createChat = async (req, res) => {
    const { senderId } = req.params;
    const { receiverId, propertyId } = req.body;

    // Convert userId to an integer
    const parsedSenderId = parseInt(senderId);

    if (isNaN(parsedSenderId)) {
        return res.status(400).json({ message: 'Invalid userId' });
    }

    try {
        // Check if a chat with the same combination of senderId, receiverId, and propertyId already exists
        const existingChat = await Chat.findOne({
            where: {
                senderId: parsedSenderId,
                receiverId,
                propertyId,
            },
        });

        if (existingChat) {
            return res.status(201).json({ chatId: existingChat.chatId });
        }

        // If no existing chat is found, create a new chat
        const chat = await Chat.create({ senderId: parsedSenderId, receiverId, propertyId });
        res.status(201).json({ chatId: chat.chatId});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const getUserReceiverChat = async (req, res) => {
    try {

        const user = await User.findByPk(req.params.userId);

        if (!user) {
            return res.status(404).json({ message: 'User Not Found' });
        }

        const receiverChats = await user.getReceiverChats({
            order: [['updatedAt', 'DESC']],
            include: [{
                model: User,
                as: 'sender'
            },
            {
                model: Property,
                as: 'propertyListing',
                include: [{
                    model: Image,
                    as: 'propertyImages',
                }]
            },
            {
                model: Message,
                as: 'messages'
            },
            {
                model: Request,
                as: 'request'
            }]
        });

        // console.log(receiverChats);
        res.status(200).json(receiverChats);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getUserSenderChat = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userId);

        if (!user) {
            return res.status(404).json({ message: 'User Not Found' });
        }

        const senderChats = await user.getSenderChats({
            order: [['updatedAt', 'DESC']],
            include: [{
                model: User,
                as: 'receiver',
            },
            {
                model: User,
                as: 'sender',
            },
            {
                model: Property,
                as: 'propertyListing',
                include: [{
                    model: Image,
                    as: 'propertyImages',
                }]
            },
            {
                model: Message,
                as: 'messages'
            }],
        });
        // console.log(senderChats);

        res.status(200).json(senderChats);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getChatById = async (req, res) => {
    try {
        // Validate chatId
        const chatId = req.params.chatId;
        if (!chatId) {
            return res.status(400).json({ message: 'Invalid chat ID' });
        }

        // Fetch chat information
        const chat = await Chat.findByPk(chatId, {
            include: [{
                model: User,
                as: 'receiver',
            },
            {
                model: User,
                as: 'sender',
            },
            {
                model: Property,
                as: 'propertyListing',
                include: [{
                    model: Image,
                    as: 'propertyImages',
                }]
            },
            {
                model: Message,
                as: 'messages'
            },
            {
                model: Request,
                as: 'request'
            }],
        });

        if (chat) {
            res.status(200).json(chat);
        } else {
            res.status(404).json({ message: 'Chat not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = {
    createChat,
    getUserReceiverChat,
    getUserSenderChat,
    getChatById
};
