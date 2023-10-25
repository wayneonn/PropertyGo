const { Touchscreen } = require("puppeteer");
const { Notification, ForumPost, User, Admin, Image, ForumTopic } = require("../../models");
const Sequelize = require('sequelize');

//Helper function!
const updateHasUserRead = (userId) => {
    Notification.update({ hasUserRead: true }, { where: { userId, hasUserRead: false } })
        .then((result) => {
            console.log('Updated rows:', result[0]);
        })
        .catch((error) => {
            console.error('Error updating rows:', error);
        });
};

const createForumTopic = async (req, res) => {

    try {
        const notification = await Notification.create(req.body);
        res.status(201).json({ notification });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllNotification = async (req, res) => {
    try {
        const { filter } = req.params;
        const userId = parseInt(req.params.userId);

        let orderCriteria = [['createdAt', 'DESC']];
        let whereCriteria = { userId };

        if (filter === 'isPending') {
            whereCriteria.isPending = true;
        } else if (filter === 'isCompleted') {
            whereCriteria.isCompleted = true;
        }

        const notification = await Notification.findAll({
            order: orderCriteria,
            where: whereCriteria,
            include: [
                // Include the associated Images
                {
                    model: ForumPost,
                    as: 'forumPost',
                    include: [
                        {
                          model: Image,
                          as: 'images',
                        },
                      ],
                },
                {
                    model: ForumTopic,
                    as: 'forumTopic',
                },
                {
                    model: User,
                    as: "userNotification",
                },
                {
                    model: Admin,
                    as: "adminNotification"
                }
            ],
        });

        res.status(200).json(notification);
        updateHasUserRead(userId);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const countUnreadNotifications = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const unreadCount = await Notification.count({
            where: {
                userId,
                hasUserRead: false,
            },
        });
        res.json({ unreadCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    createForumTopic,
    getAllNotification,
    countUnreadNotifications,
}