const { ForumTopic, User, ForumPost, Notification } = require("../../models");
const sequelize = require('sequelize');


const createForumTopic = async (req, res) => {
    const userId = parseInt(req.params.userId);

    // Assuming you want to set userId in the ForumTopic model
    req.body.userId = userId;
    req.body.isInappropriate = false

    try {
        const forumTopic = await ForumTopic.create(req.body);
        res.status(201).json({ forumTopic });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllForumTopic = async (req, res) => {
    try {
        const sort = req.query.sort;
        const increase = JSON.parse(req.query.increase);

        const userId = parseInt(req.params.userId);

        let orderCriteria = [['updatedAt', 'DESC']];

        if (sort !== 'vote' && increase) {
            orderCriteria = [['updatedAt', 'ASC']];

        }

        if (sort === 'vote') {
            // Sorting by the difference between upvotes and downvotes
            if (!increase) {
                orderCriteria = [
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM `UserTopicUpvoted` AS `UserTopicUpvoted` WHERE `ForumTopic`.`forumTopicId` = `UserTopicUpvoted`.`forumTopicId`) - (SELECT COUNT(*) FROM `UserTopicDownvoted` AS `UserTopicDownvoted` WHERE `ForumTopic`.`forumTopicId` = `UserTopicDownvoted`.`forumTopicId`)'),
                        'DESC',
                    ],
                ];
            } else {
                orderCriteria = [
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM `UserTopicUpvoted` AS `UserTopicUpvoted` WHERE `ForumTopic`.`forumTopicId` = `UserTopicUpvoted`.`forumTopicId`) - (SELECT COUNT(*) FROM `UserTopicDownvoted` AS `UserTopicDownvoted` WHERE `ForumTopic`.`forumTopicId` = `UserTopicDownvoted`.`forumTopicId`)'),
                        'ASC',
                    ],
                ]
            }
        }

        const forumTopics = await ForumTopic.findAll({
            order: orderCriteria,
            where: {
                isInappropriate: {
                    [sequelize.Op.not]: true,
                },
                forumTopicId: {
                    [sequelize.Op.notIn]: sequelize.literal(
                        `(SELECT forumTopicId FROM \`UserTopicFlagged\` AS \`UserTopicFlagged\` WHERE \`ForumTopic\`.\`forumTopicId\` = \`UserTopicFlagged\`.\`forumTopicId\` AND \`UserTopicFlagged\`.\`userId\` = ${userId})`
                    ),
                },
            },
        });
        // console.log(forumTopics)
        res.status(200).json(forumTopics);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getForumTopicVoteDetails = async (req, res) => {
    try {

        const userId = parseInt(req.params.userId);
        const forumTopicId = parseInt(req.params.forumTopicId);
        const forumTopic = await ForumTopic.findByPk(forumTopicId);

        if (!forumTopic) {
            return res.status(404).json({ message: 'ForumTopic not found' });
        }

        const userUpvote = await forumTopic.hasUsersUpvoted(userId);
        const userDownvote = await forumTopic.hasUsersDownvoted(userId);
        const totalUpvote = await forumTopic.countUsersUpvoted();
        const totalDownvote = await forumTopic.countUsersDownvoted();
        const totalPostCount = await forumTopic.countForumPosts();

        const voteDetails = {
            userUpvote,
            userDownvote,
            totalUpvote,
            totalDownvote,
            totalPostCount,
        };


        res.status(200).json(voteDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateForumTopicFlaggedStatus = async (req, res) => {
    try {
        const forumTopicId = parseInt(req.params.forumTopicId);
        const userId = parseInt(req.params.userId);

        // Check if the ForumTopic exists
        const forumTopic = await ForumTopic.findByPk(forumTopicId);

        if (!forumTopic) {
            return res.status(404).json({ message: 'ForumTopic not found' });
        }

        // Check if the user is already flagged for the topic
        const isFlagged = await forumTopic.hasUsersFlagged(userId);
        console.log("User ID: " + userId + " Forum Topic ID: " + forumTopicId)
        // console.log("is Flagged? " + isFlagged)

        const user = await User.findByPk(userId);

        req.body = {
            "isRecent": false,
            "isPending": false,
            "isCompleted": true,
            "hasRead": false,
            "userId": userId
        };

        if (isFlagged) {
            // If the user is flagged, remove the flag
            await forumTopic.removeUsersFlagged(userId);

            req.body.content = `${user.userName.charAt(0).toUpperCase() + user.userName.slice(1)} has removed the flag on the forum topic name of "${forumTopic.topicName}"`;

            await Notification.create(req.body);

            req.io.emit("newRemoveFlaggedForumTopicNotification", `Remove flagged forum topic`);
            res.status(200).json({ message: 'Flag removed successfully' });
        } else {
            // If the user is not flagged, add the flag
            await forumTopic.addUsersFlagged(userId);

            req.body.content = `${user.userName.charAt(0).toUpperCase() + user.userName.slice(1)} has flagged the forum topic name of "${forumTopic.topicName}"`;

            await Notification.create(req.body);

            req.io.emit("newFlaggedForumTopicNotification", `Flagged forum topic`);
            res.status(200).json({ message: 'Flag added successfully' });
        }

        await forumTopic.save();

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateForumTopicVote = async (req, res) => {
    try {
        const forumTopicId = parseInt(req.params.forumTopicId);
        const userId = parseInt(req.params.userId);
        const { voteType } = req.query;

        // Check if the user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the topic exists
        const forumTopic = await ForumTopic.findByPk(forumTopicId);
        if (!forumTopic) {
            return res.status(404).json({ message: 'Forum topic not found' });
        }

        // Check if the user has already voted on this topic
        const existingUpvote = await forumTopic.hasUsersUpvoted(user);
        const existingDownvote = await forumTopic.hasUsersDownvoted(user)

        // Create a new vote record based on the user's choice
        if (voteType === 'upvote') {
            if (existingUpvote) {
                await forumTopic.removeUsersUpvoted(user);
            } else {
                if (existingDownvote) {
                    await forumTopic.removeUsersDownvoted(user);
                }
                await forumTopic.addUsersUpvoted(user);
            }
        } else if (voteType === 'downvote') {
            if (existingDownvote) {
                await forumTopic.removeUsersDownvoted(user);
            } else {
                if (existingUpvote) {
                    await forumTopic.removeUsersUpvoted(user);
                }
                await forumTopic.addUsersDownvoted(user);
            }
        } else {
            return res.status(400).json({ message: 'Invalid vote type' });
        }
        await forumTopic.save();

        res.status(200).json({ message: `${voteType} recorded successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateForumTopicName = async (req, res) => {
    try {
        const forumTopicId = parseInt(req.params.forumTopicId);
        const userId = parseInt(req.params.userId);
        const { topicName } = req.body;

        // Check if the user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the topic exists
        const forumTopic = await ForumTopic.findByPk(forumTopicId);
        if (!forumTopic) {
            return res.status(404).json({ message: 'Forum topic not found' });
        }

        // Check if the user owns the forum topic
        if (forumTopic.userId !== userId) {
            return res.status(403).json({ message: 'You do not have permission to update this topic' });
        }

        // Update the topic name
        forumTopic.topicName = topicName;
        await forumTopic.save();

        res.status(200).json({ message: `Topic ID ${forumTopicId}: topic name successfully updated` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteForumTopicName = async (req, res) => {
    try {
        const forumTopicId = parseInt(req.params.forumTopicId);
        const userId = parseInt(req.params.userId);


        // Check if the user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the topic exists
        const forumTopic = await ForumTopic.findByPk(forumTopicId);
        if (!forumTopic) {
            return res.status(404).json({ message: 'Forum topic not found' });
        }

        // Check if the user owns the forum topic
        if (forumTopic.userId !== userId) {
            return res.status(403).json({ message: 'You do not have permission to delete this topic' });
        }

        // Delete the forum topic
        await forumTopic.destroy();

        res.status(200).json({ message: `Topic ID ${forumTopicId}: topic successfully deleted` });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createForumTopic,
    getAllForumTopic,
    updateForumTopicFlaggedStatus,
    updateForumTopicVote,
    updateForumTopicName,
    deleteForumTopicName,
    getForumTopicVoteDetails
};
