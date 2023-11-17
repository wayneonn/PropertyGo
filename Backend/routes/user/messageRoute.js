const express = require('express');
const router = express.Router();

const {
    addMessage,
    updateMessage
} = require('../../controllers/user/messageController');


router.route('/message')
    .post(addMessage)

// Route for updating an existing message
router.route('/message/update')
    .put(updateMessage); // Use PUT method for updating

module.exports = router;