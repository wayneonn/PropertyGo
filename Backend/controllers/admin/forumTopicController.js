const moment = require("moment");
const { ForumTopic, ForumPost } = require("../../models");

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

        const formattedForumTopics = forumTopics.map((forumTopic) => {
            return {
                forumTopicId: forumTopic.forumTopicId,
                topicName: forumTopic.topicName,
                isInappropriate: forumTopic.isInappropriate,
                adminId: forumTopic.adminId,
                userId: forumTopic.userId,
                createdAt: moment(forumTopic.createdAt)
                    .tz("Asia/Singapore")
                    .format("YYYY-MM-DD HH:mm:ss"),
                updatedAt: moment(forumTopic.updatedAt)
                    .tz("Asia/Singapore")
                    .format("YYYY-MM-DD HH:mm:ss"),
            };
        });

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

const unflagForumTopic = async (req, res) => {
    const { id: forumTopicId } = req.params;

    const forumTopic = await ForumTopic.findByPk(forumTopicId);

    forumTopic.isInappropriate = false;

    await forumTopic.save();

    res.status(200).json({ forumTopic });
};

module.exports = {
    getAllForumTopics,
    getSingleForumTopic,
    createForumTopic,
    updateForumTopic,
    deleteForumTopic,
    unflagForumTopic
};