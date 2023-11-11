const express = require('express');
const router = express.Router();

const {
    addMessage,
} = require('../../controllers/user/messageController');


router.route('/message')
    .post(addMessage)

module.exports = router;