const express = require('express');
const router = express.Router();
const multer = require('multer');

const {
    createForumTopic,
    getAllNotification,
    countUnreadNotifications,
} = require('../../controllers/user/notificationController');

router.route('/:userId/notification/:filter')
    .get(getAllNotification)

router.route('/:userId/countUnreadNotifications')
    .get(countUnreadNotifications)

module.exports = router;