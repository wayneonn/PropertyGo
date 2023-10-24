const moment = require("moment");
const { ForumTopic, ForumPost, Admin, User, Notification } = require("../../models");

// helper function
const getForumTopicForUniqueness = ({ topicName }) => {
    return ForumTopic.findOne({
        where: {
            topicName
        },
    });
};

const getAllForumTopics = async (req, res) => {
    try {
        const forumTopics = await ForumTopic.findAll({
            attributes: [
                "forumTopicId",
                "topicName",
                "isInappropriate",
                "adminId",
                "userId",
                "createdAt",
                "updatedAt",
            ],
        });

        const formattedForumTopics = await Promise.all(
            forumTopics.map(async (forumTopic) => {

                let actor = null;

                if (forumTopic.adminId === null) { // forum topic created by user
                    actor = await User.findByPk(forumTopic.userId);
                } else { // forum topic created by admin
                    actor = await Admin.findByPk(forumTopic.adminId);
                }

                return {
                    forumTopicId: forumTopic.forumTopicId,
                    topicName: forumTopic.topicName,
                    isInappropriate: forumTopic.isInappropriate,
                    actor: actor,
                    createdAt: moment(forumTopic.createdAt)
                        .tz("Asia/Singapore")
                        .format("YYYY-MM-DD HH:mm:ss"),
                    updatedAt: moment(forumTopic.updatedAt)
                        .tz("Asia/Singapore")
                        .format("YYYY-MM-DD HH:mm:ss"),
                };
            })
        );

        res.status(200).json({ forumTopics: formattedForumTopics });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getSingleForumTopic = async (req, res) => {
    try {
        const { id: forumTopicId } = req.params;

        const forumTopic = await ForumTopic.findByPk(forumTopicId);

        if (!forumTopic) {
            return res.status(404).json({ message: "Forum Topic not found" });
        }

        res.status(200).json(forumTopic);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getFlaggedForumTopics = async (req, res) => {
    try {
        const forumTopics = await ForumTopic.findAll({
            attributes: [
                "forumTopicId",
            ],
        });

        const formattedForumTopics = await Promise.all(
            forumTopics.map(async (forumTopic) => {

                const forumTopicFromDB = await ForumTopic.findByPk(forumTopic.forumTopicId);

                const totalFlagged = await forumTopicFromDB.countUsersFlagged();

                return {
                    forumTopic: forumTopicFromDB,
                    totalFlagged: totalFlagged
                };
            })
        );

        res.status(200).json(formattedForumTopics);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const createForumTopic = async (req, res) => {
    const { adminId } = req.query;

    const { topicName } = req.body;

    const forumTopicNameFound = await getForumTopicForUniqueness({ topicName });

    if (forumTopicNameFound) {
        return res
            .status(409)
            .json({ message: `Forum Topic Name already exist.` });
    }

    req.body.adminId = adminId;
    req.body.isInappropriate = false;

    const forumTopic = await ForumTopic.create(req.body);
    res.status(201).json({ forumTopic });
};

const updateForumTopic = async (req, res) => {
    const { id: forumTopicId } = req.params;

    const { topicName } = req.body;

    const forumTopic = await ForumTopic.findByPk(forumTopicId);

    if (
        forumTopic.topicName === topicName
    ) {
        return res.status(200).json({ forumTopic });
    }

    const forumTopicFound = await getForumTopicForUniqueness({ topicName });

    if (forumTopicFound) {
        return res
            .status(409)
            .json({ message: `Forum Topic Name already exists.` });
    }

    try {
        const forumTopic = await ForumTopic.findByPk(forumTopicId);

        if (!forumTopic) {
            return res.status(404).json({ message: "Forum Topic not found" });
        }

        await forumTopic.update(req.body);

        const updatedForumTopic = await ForumTopic.findByPk(forumTopicId);

        res.status(200).json({ forumTopic: updatedForumTopic });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const deleteForumTopic = async (req, res) => { // this includes both deleting normal forum topic and flagged forum topic
    const { id: forumTopicId } = req.params;

    const forumTopic = await ForumTopic.findByPk(forumTopicId);

    if (!forumTopic) {
        return res.status(404).json({ message: "Forum Topic not found" });
    }

    await ForumPost.destroy({
        where: { forumTopicId }
    });

    await forumTopic.destroy();
    res.status(200).json({ msg: "Success! Forum Topic removed." });
};

const markForumTopicInappropriate = async (req, res) => {
    const { id: forumTopicId } = req.params;

    const { typeOfResponse, adminId } = req.body;

    const forumTopic = await ForumTopic.findByPk(forumTopicId);

    if (typeOfResponse === "no") {
        // const forumTopics = await ForumTopic.findByPk(forumTopicId, {
        //     include: {
        //       model: User,
        //       as: 'usersFlagged', 
        //     }
        //   });

        // for (const usersFlaggedForumTopic of forumTopics.usersFlagged) {
        //     const userIdFlagged = usersFlaggedForumTopic.dataValues.userId;

        //     await forumTopic.removeUsersFlagged(userIdFlagged);
        // }
    } else {
        forumTopic.isInappropriate = true;
    }

    await forumTopic.save();

    req.body = {
        "content": `You have successfully flagged the forum topic of "${forumTopic.topicName}" as ${typeOfResponse === "no" ? "appropriate" : "inappropriate"}`,
        "isRecent": false,
        "isPending": false,
        "isCompleted": true,
        "hasRead": false,
        "adminId": adminId
    };

    await Notification.create(req.body);

    req.io.emit("newAdminFlaggedForumTopic", "Admin has flagged forum topic");
    res.status(200).json({ forumTopic });
};

const resetForumTopicAppropriate = async (req, res) => {
    const { id: forumTopicId } = req.params;

    const { adminId } = req.body;

    const forumTopic = await ForumTopic.findByPk(forumTopicId);

    forumTopic.isInappropriate = false;

    // const forumTopics = await ForumTopic.findByPk(forumTopicId, {
    //     include: {
    //       model: User,
    //       as: 'usersFlagged', 
    //     }
    //   });

    // for (const usersFlaggedForumTopic of forumTopics.usersFlagged) {
    //     const userIdFlagged = usersFlaggedForumTopic.dataValues.userId;

    //     await forumTopic.removeUsersFlagged(userIdFlagged);
    // }

    await forumTopic.save();

    req.body = {
        "content": `You have successfully reset the forum topic of "${forumTopic.topicName}" to appropriate`,
        "isRecent": false,
        "isPending": false,
        "isCompleted": true,
        "hasRead": false,
        "adminId": adminId
    };

    await Notification.create(req.body);

    req.io.emit("newAdminResetAppropriateForumTopic", "Admin has reset forum topic to appropriate");

    res.status(200).json({ forumTopic });
};

module.exports = {
    getAllForumTopics,
    getSingleForumTopic,
    getFlaggedForumTopics,
    createForumTopic,
    updateForumTopic,
    deleteForumTopic,
    markForumTopicInappropriate,
    resetForumTopicAppropriate
};
