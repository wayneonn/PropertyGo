const { ForumComment, User, Image } = require("../../models");
const sequelize = require('sequelize');

const createForumComment = async (req, res) => {
    const { userId } = req.params; // Use destructuring to get userId

    // Assuming you want to set userId in the ForumComment model
    req.body.userId = userId;
    req.body.isInappropriate = false

    try {
        const forumComment = await ForumComment.create(req.body);
        res.status(201).json({ forumComment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllForumComment = async (req, res) => {
    try {
        const { sort } = req.query;
        const increase = JSON.parse(req.query.increase);
        const forumPostId = parseInt(req.query.forumPostId);
        const userId = parseInt(req.params.userId);

        let orderCriteria = [['createdAt', 'DESC']];

        if (sort !== 'vote' && increase) {
            orderCriteria = [['updatedAt', 'ASC']];

        }

        if (sort === 'vote') {
            // Sorting by the difference between upvotes and downvotes
            if (!increase) {
                orderCriteria = [
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM `UserCommentUpvoted` AS `UserCommentUpvoted` WHERE `ForumComment`.`forumCommentId` = `UserCommentUpvoted`.`forumCommentId`) - (SELECT COUNT(*) FROM `UserCommentDownvoted` AS `UserCommentDownvoted` WHERE `ForumComment`.`forumCommentId` = `UserCommentDownvoted`.`forumCommentId`)'),
                        'DESC',
                    ],
                ];
            } else {
                orderCriteria = [
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM `UserCommentUpvoted` AS `UserCommentUpvoted` WHERE `ForumComment`.`forumCommentId` = `UserCommentUpvoted`.`forumCommentId`) - (SELECT COUNT(*) FROM `UserCommentDownvoted` AS `UserCommentDownvoted` WHERE `ForumComment`.`forumCommentId` = `UserCommentDownvoted`.`forumCommentId`)'),
                        'ASC',
                    ],
                ];
            }
        }

        const forumComments = await ForumComment.findAll({
            order: orderCriteria,
            where: {
                isInappropriate: {
                    [sequelize.Op.not]: true,
                },
                forumPostId: forumPostId,
                forumCommentId: {
                    [sequelize.Op.notIn]: sequelize.literal(
                        `(SELECT forumCommentId FROM \`UserCommentFlagged\` AS \`UserCommentFlagged\` WHERE \`ForumComment\`.\`forumCommentId\` = \`UserCommentFlagged\`.\`forumCommentId\` AND \`UserCommentFlagged\`.\`userId\` = ${userId})`
                    ),
                },
            },
            include: [
                // Include the associated Images
                {
                    model: Image,
                    as: 'images',
                },
            ],
        });

        res.status(200).json(forumComments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getForumCommentVoteDetails = async (req, res) => {
    try {

        const userId = parseInt(req.params.userId);
        const forumCommentId = parseInt(req.params.forumCommentId);
        const forumComment = await ForumComment.findByPk(forumCommentId);

        if (!forumComment) {
            return res.status(404).json({ message: 'ForumComment not found' });
        }

        const userUpvote = await forumComment.hasUsersUpvoted(userId);
        const userDownvote = await forumComment.hasUsersDownvoted(userId);
        const totalUpvote = await forumComment.countUsersUpvoted();
        const totalDownvote = await forumComment.countUsersDownvoted();

        const voteDetails = {
            userUpvote,
            userDownvote,
            totalUpvote,
            totalDownvote,
        };


        res.status(200).json(voteDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateForumCommentFlaggedStatus = async (req, res) => {
    try {
        const forumCommentId = parseInt(req.params.forumCommentId);
        const userId = parseInt(req.params.userId);

        // Check if the ForumComment exists
        const forumComment = await ForumComment.findByPk(forumCommentId);

        if (!forumComment) {
            return res.status(404).json({ message: 'ForumComment not found' });
        }

        // Check if the user is already flagged for the Comment
        const isFlagged = await forumComment.hasUsersFlagged(userId);
        console.log("User ID: " + userId + " Forum Comment ID: " + forumCommentId)
        // console.log("is Flagged? " + isFlagged)

        if (isFlagged) {
            // If the user is flagged, remove the flag
            await forumComment.removeUsersFlagged(userId);
            res.status(200).json({ message: 'Flag removed successfully' });
        } else {
            // If the user is not flagged, add the flag
            await forumComment.addUsersFlagged(userId);
            res.status(200).json({ message: 'Flag added successfully' });
        }

        await forumComment.save();

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateForumCommentVote = async (req, res) => {
    try {
        const forumCommentId = parseInt(req.params.forumCommentId);
        const userId = parseInt(req.params.userId);
        const { voteType } = req.query;

        // Check if the user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the Comment exists
        const forumComment = await ForumComment.findByPk(forumCommentId);
        if (!forumComment) {
            return res.status(404).json({ message: 'Forum Comment not found' });
        }

        // Check if the user has already voted on this Comment
        const existingUpvote = await forumComment.hasUsersUpvoted(user);
        const existingDownvote = await forumComment.hasUsersDownvoted(user)

        // Create a new vote record based on the user's choice
        if (voteType === 'upvote') {
            if (existingUpvote) {
                await forumComment.removeUsersUpvoted(user);
            } else {
                if (existingDownvote) {
                    await forumComment.removeUsersDownvoted(user);
                }
                await forumComment.addUsersUpvoted(user);
            }
        } else if (voteType === 'downvote') {
            if (existingDownvote) {
                await forumComment.removeUsersDownvoted(user);
            } else {
                if (existingUpvote) {
                    await forumComment.removeUsersUpvoted(user);
                }
                await forumComment.addUsersDownvoted(user);
            }
        } else {
            return res.status(400).json({ message: 'Invalid vote type' });
        }
        await forumComment.save();

        res.status(200).json({ message: `${voteType} recorded successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateForumComment = async (req, res) => {
    try {
        const forumCommentId = parseInt(req.body.forumCommentId);
        const userId = parseInt(req.params.userId);

        // Check if the user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the Comment exists
        const forumComment = await ForumComment.findByPk(forumCommentId);
        if (!forumComment) {
            return res.status(404).json({ message: 'Forum Comment not found' });
        }

        // Check if the user owns the forum Comment
        if (forumComment.userId !== userId) {
            return res.status(403).json({ message: 'You do not have permission to update this Comment' });
        }

        if (req.body.title != null) {
            forumComment.title = req.body.title;
        }

        if (req.body.message != null) {
            forumComment.message = req.body.message;
        }

        await forumComment.save();

        res.status(200).json({ message: `Comment ID${forumCommentId}: Comment name successfully updated` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const deleteForumComment = async (req, res) => {
    try {
        const forumCommentId = parseInt(req.params.forumCommentId);
        const userId = parseInt(req.params.userId);


        // Check if the user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the Comment exists
        const forumComment = await ForumComment.findByPk(forumCommentId);
        if (!forumComment) {
            return res.status(404).json({ message: 'Forum Comment not found' });
        }

        // Check if the user owns the forum Comment
        if (forumComment.userId !== userId) {
            return res.status(403).json({ message: 'You do not have permission to delete this Comment' });
        }

        // Delete the forum Comment
        await forumComment.destroy();

        res.status(200).json({ message: `Comment ID ${forumCommentId}: Comment successfully deleted` });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createForumComment,
    getAllForumComment,
    updateForumCommentFlaggedStatus,
    updateForumCommentVote,
    updateForumComment,
    deleteForumComment,
    getForumCommentVoteDetails

};