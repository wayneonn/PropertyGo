const moment = require("moment");
const { Notification } = require("../../models");

const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      attributes: [
        "notificationId",
        "content",
        "isRecent",
        "isPending",
        "isCompleted",
        "hasRead",
        "createdAt",
        "updatedAt",
        "adminId"
      ],
    });

    const formattedNotifcations = notifications.map((notification) => {
      return {
        notificationId: notification.notificationId,
        content: notification.content,
        isRecent: notification.isRecent,
        isPending: notification.isPending,
        isCompleted: notification.isCompleted,
        hasRead: notification.hasRead,
        createdAt: moment(notification.createdAt)
          .tz("Asia/Singapore")
          .format("YYYY-MM-DD HH:mm:ss"),
        updatedAt: moment(notification.updatedAt)
          .tz("Asia/Singapore")
          .format("YYYY-MM-DD HH:mm:ss"),
        adminId: notification.adminId
      };
    });

    res.status(200).json({ notifications: formattedNotifcations });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const markAsRead = async (req, res) => {
  const { id: notificationId } = req.params;

  req.body.hasRead = true;

  const notification = await Notification.findByPk(notificationId);
  await notification.update(req.body);

  const updatedNotification = await Notification.findByPk(notificationId);

  return res.status(200).json({ notification: updatedNotification });
};

const markAllAsRead = async (req, res) => {
  const { notifications } = req.body;

  for (const notification of notifications) {
    req.body.hasRead = true;

    const foundNotification = await Notification.findByPk(
      notification.notificationId
    );
    await foundNotification.update(req.body);
  }

  return res
    .status(200)
    .json({ message: "All notifcations have been marked as read" });
};

module.exports = {
  getAllNotifications,
  markAsRead,
  markAllAsRead,
};
