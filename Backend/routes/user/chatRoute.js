const express = require('express');
const router = express.Router();

const {
    createChat,
    getUserReceiverChat,
    getUserSenderChat,
    getChatById
} = require('../../controllers/user/chatController');

router.route('/:senderId/chat')
    .post(createChat)

router.route('/:userId/chat/getUserReceiverChat')
    .get(getUserReceiverChat)

router.route('/:userId/chat/getUserSenderChat')
    .get(getUserSenderChat)

router.route('/chat/:chatId')
    .get(getChatById)

module.exports = router;