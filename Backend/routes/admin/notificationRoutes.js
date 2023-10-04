const express = require('express');
const router = express.Router();

const {
    getAllNotifications,
    markAsRead,
    markAllAsRead
} = require('../../controllers/admin/notificationController');

router.route('/')
    .get(getAllNotifications);

router.route('/markAsRead/:id')
    .patch(markAsRead);

router.route('/markAllAsRead')
    .patch(markAllAsRead);

module.exports = router;