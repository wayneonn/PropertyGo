const {Chat, User, Message, Request} = require("../../models");

const createChat = async (req, res) => {
    const { userId } = req.params;

    req.body.userId = userId;

    try {
        const chat = await Chat.create(req.body);
        res.status(201).json({ chat });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getUserReceiverChat = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userId, {
            include: [{
                model: Chat,
                as: 'receiverChats',
            }]
        });

        if (!user) {
            return res.status(404).json({ message: 'User Not Found' });
        }

        const receiverChats = user['receiverChats'];
        // console.log(receiverChats);
        res.status(200).json(receiverChats);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getUserSenderChat = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userId, {
            include: [{
                model: Chat,
                as: 'senderChats',
            }]
        });

        if (!user) {
            return res.status(404).json({ message: 'User Not Found' });
        }

        const senderChats = user['senderChats'];
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
            include: [{ model: Message, as: 'messages' }, { model: Request, as: 'request' }],
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
