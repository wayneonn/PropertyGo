const { Notification } = require("../../models");
const sequelize = require('sequelize');

const createForumTopic = async (req, res) => {

    try {
        const notification = await Notification.create(req.body);
        res.status(201).json({ notification });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};