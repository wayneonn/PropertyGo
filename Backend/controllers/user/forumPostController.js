const { sequelize, ForumPost, User, Image, Notification } = require("../../models");
const Sequelize = require('sequelize');
const sharp = require('sharp');

const createForumPost = async (req, res) => {
    const { userId } = req.params;

    // console.log("Form")
    // console.log(req.files);
    // console.log("forum topic ID:", req.body.forumTopicId)

    const transaction = await sequelize.transaction();

    try {
        const images = req.files;


        const forumPost = await ForumPost.create({
            userId: userId,
            title: req.body.title,
            message: req.body.message,
            isInappropriate: false,
            forumTopicId: req.body.forumTopicId,
        });


        const failedImages = [];


        for (let index = 0; index < images.length; index++) {
            const image = images[index];

            try {
                const processedImageBuffer = await sharp(image.buffer)
                    .resize({ width: 800, height: 600 }) // You can set the dimensions accordingly
                    .webp()
                    .toBuffer();

                currentImage = await Image.create({ image: processedImageBuffer }, { transaction });
                await forumPost.addImage(currentImage, { transaction });

            } catch (imageError) {
                console.error('Error creating image:', imageError);
                failedImages.push({ index, error: 'Failed to create image' });
            }
        }

        if (failedImages.length > 0) {
            // If there were failed images, roll back the transaction
            await transaction.rollback();
            console.log('Rolled back transaction due to errors in creating images.');
            return res.status(500).json({ error: 'Error creating some images', failedImages });
        }

        await transaction.commit();
        console.log('Transaction committed successfully.');

        res.status(201).json({ forumPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const getAllForumPost = async (req, res) => {

    try {
        const sort = req.query.sort;
        const increase = JSON.parse(req.query.increase);
        const forumTopicId = parseInt(req.query.forumTopicId);
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
                        Sequelize.literal('(SELECT COUNT(*) FROM `UserPostUpvoted` AS `UserPostUpvoted` WHERE `ForumPost`.`forumPostId` = `UserPostUpvoted`.`forumPostId`) - (SELECT COUNT(*) FROM `UserPostDownvoted` AS `UserPostDownvoted` WHERE `ForumPost`.`forumPostId` = `UserPostDownvoted`.`forumPostId`)'),
                        'DESC',
                    ],
                ];
            } else {
                orderCriteria = [
                    [
                        Sequelize.literal('(SELECT COUNT(*) FROM `UserPostUpvoted` AS `UserPostUpvoted` WHERE `ForumPost`.`forumPostId` = `UserPostUpvoted`.`forumPostId`) - (SELECT COUNT(*) FROM `UserPostDownvoted` AS `UserPostDownvoted` WHERE `ForumPost`.`forumPostId` = `UserPostDownvoted`.`forumPostId`)'),
                        'ASC',
                    ],
                ]
            }
        }

        const forumPosts = await ForumPost.findAll({
            order: orderCriteria,
            where: {
                isInappropriate: {
                    [Sequelize.Op.not]: true,
                },
                forumTopicId: forumTopicId,
                forumPostId: {
                    [Sequelize.Op.notIn]: Sequelize.literal(
                        `(SELECT forumPostId FROM \`UserPostFlagged\` AS \`UserPostFlagged\` WHERE \`ForumPost\`.\`forumPostId\` = \`UserPostFlagged\`.\`forumPostId\` AND \`UserPostFlagged\`.\`userId\` = ${userId})`
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

        res.status(200).json(forumPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllForumPostById = async (req, res) => {
    try {

        const forumPostId = parseInt(req.params.forumPostId);


        const forumPost = await ForumPost.findByPk(forumPostId, {
            include: [
                {
                    model: Image,
                    as: 'images',
                },
            ],
        });

        res.status(200).json(forumPost);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllForumPostByUserId = async (req, res) => {
    try {
        const increase = JSON.parse(req.query.increase);
        const userId = parseInt(req.params.userId);

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let orderCriteria = [['updatedAt', 'DESC']];

        if (increase) {
            orderCriteria = [['updatedAt', 'ASC']];
        }

        const forumPosts = await user.getForumPosts({
            order: orderCriteria,
            where: {
                isInappropriate: {
                    [Sequelize.Op.not]: true,
                },
            },
            include: [
                {
                    model: Image,
                    as: 'images',
                },
            ],
        })

        // console.log(forumPosts)
        res.status(200).json(forumPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllUserUpvotedForumPost = async (req, res) => {
    try {
        const increase = JSON.parse(req.query.increase);
        const userId = parseInt(req.params.userId);

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let orderCriteria = [['updatedAt', 'DESC']];

        if (increase) {
            orderCriteria = [['updatedAt', 'ASC']];
        }

        const forumPosts = await ForumPost.findAll({
            order: orderCriteria,
            where: {
                isInappropriate: {
                    [Sequelize.Op.not]: true,
                },
                forumPostId: {
                    [Sequelize.Op.notIn]: Sequelize.literal(
                        `(SELECT forumPostId FROM \`UserPostFlagged\` AS \`UserPostFlagged\` WHERE \`ForumPost\`.\`forumPostId\` = \`UserPostFlagged\`.\`forumPostId\` AND \`UserPostFlagged\`.\`userId\` = ${userId})`
                    ),
                    [Sequelize.Op.in]: Sequelize.literal(
                        `(SELECT forumPostId FROM \`UserPostUpvoted\` AS \`UserPostUpvoted\` WHERE \`ForumPost\`.\`forumPostId\` = \`UserPostUpvoted\`.\`forumPostId\` AND \`UserPostUpvoted\`.\`userId\` = ${userId})`
                    ),
                },
            },
            include: [
                {
                    model: Image,
                    as: 'images',
                },
            ],
        });

        // console.log(forumPosts)
        res.status(200).json(forumPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllUserDownvotedForumPost = async (req, res) => {
    try {
        const increase = JSON.parse(req.query.increase);
        const userId = parseInt(req.params.userId);

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let orderCriteria = [['updatedAt', 'DESC']];

        if (increase) {
            orderCriteria = [['updatedAt', 'ASC']];
        }

        const forumPosts = await ForumPost.findAll({
            order: orderCriteria,
            where: {
                isInappropriate: {
                    [Sequelize.Op.not]: true,
                },
                forumPostId: {
                    [Sequelize.Op.notIn]: Sequelize.literal(
                        `(SELECT forumPostId FROM \`UserPostFlagged\` AS \`UserPostFlagged\` WHERE \`ForumPost\`.\`forumPostId\` = \`UserPostFlagged\`.\`forumPostId\` AND \`UserPostFlagged\`.\`userId\` = ${userId})`
                    ),
                    [Sequelize.Op.in]: Sequelize.literal(
                        `(SELECT forumPostId FROM \`UserPostDownvoted\` AS \`UserPostDownvoted\` WHERE \`ForumPost\`.\`forumPostId\` = \`UserPostDownvoted\`.\`forumPostId\` AND \`UserPostDownvoted\`.\`userId\` = ${userId})`
                    ),
                },
            },
            include: [
                {
                    model: Image,
                    as: 'images',
                },
            ],
        });

        // console.log(forumPosts)
        res.status(200).json(forumPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllUserFlaggedForumPost = async (req, res) => {
    try {
        const increase = JSON.parse(req.query.increase);
        const userId = parseInt(req.params.userId);

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let orderCriteria = [['updatedAt', 'DESC']];

        if (increase) {
            orderCriteria = [['updatedAt', 'ASC']];
        }

        const forumPosts = await ForumPost.findAll({
            order: orderCriteria,
            where: {
                isInappropriate: {
                    [Sequelize.Op.not]: true,
                },
                forumPostId: {
                    [Sequelize.Op.in]: Sequelize.literal(
                        `(SELECT forumPostId FROM \`UserPostFlagged\` AS \`UserPostFlagged\` WHERE \`ForumPost\`.\`forumPostId\` = \`UserPostFlagged\`.\`forumPostId\` AND \`UserPostFlagged\`.\`userId\` = ${userId})`
                    ),
                },
            },
            include: [
                {
                    model: Image,
                    as: 'images',
                },
            ],
        });

        // console.log(forumPosts)
        res.status(200).json(forumPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getForumPostVoteDetails = async (req, res) => {
    try {

        const userId = parseInt(req.params.userId);
        const forumPostId = parseInt(req.params.forumPostId);
        const forumPost = await ForumPost.findByPk(forumPostId);

        if (!forumPost) {
            return res.status(404).json({ message: 'ForumPost not found' });
        }

        const userUpvote = await forumPost.hasUsersUpvoted(userId);
        const userDownvote = await forumPost.hasUsersDownvoted(userId);
        const totalUpvote = await forumPost.countUsersUpvoted();
        const totalDownvote = await forumPost.countUsersDownvoted();
        const totalCommentCount = await forumPost.countForumComments();

        const voteDetails = {
            userUpvote,
            userDownvote,
            totalUpvote,
            totalDownvote,
            totalCommentCount,
        };


        res.status(200).json(voteDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateForumPostFlaggedStatus = async (req, res) => {
    try {
        const forumPostId = parseInt(req.params.forumPostId);
        const userId = parseInt(req.params.userId);

        // Check if the ForumPost exists
        const forumPost = await ForumPost.findByPk(forumPostId);

        if (!forumPost) {
            return res.status(404).json({ message: 'ForumPost not found' });
        }

        // Check if the user is already flagged for the Post
        const isFlagged = await forumPost.hasUsersFlagged(userId);
        // console.log("User ID: " + userId + " Forum Post ID: " + forumPostId)
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
            await forumPost.removeUsersFlagged(userId);

            req.body.content = `${user.userName.charAt(0).toUpperCase() + user.userName.slice(1)} has removed the flag on the forum post title of "${forumPost.title}"`;

            await Notification.create(req.body);

            req.io.emit("newRemoveFlaggedForumPostNotification", `Remove flagged forum post`);

            res.status(200).json({ message: 'Flag removed successfully' });
        } else {
            // If the user is not flagged, add the flag
            await forumPost.addUsersFlagged(userId);

            req.body.content = `${user.userName.charAt(0).toUpperCase() + user.userName.slice(1)} has flagged the forum post title of "${forumPost.title}"`;

            await Notification.create(req.body);

            req.io.emit("newFlaggedForumPostNotification", `Flagged forum post`);
            res.status(200).json({ message: 'Flag added successfully' });
        }

        await forumPost.save();

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateForumPostVote = async (req, res) => {
    try {
        const forumPostId = parseInt(req.params.forumPostId);
        const userId = parseInt(req.params.userId);
        const { voteType } = req.query;

        // Check if the user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the Post exists
        const forumPost = await ForumPost.findByPk(forumPostId);
        if (!forumPost) {
            return res.status(404).json({ message: 'Forum Post not found' });
        }

        // Check if the user has already voted on this Post
        const existingUpvote = await forumPost.hasUsersUpvoted(user);
        const existingDownvote = await forumPost.hasUsersDownvoted(user)

        // Create a new vote record based on the user's choice
        if (voteType === 'upvote') {
            if (existingUpvote) {
                await forumPost.removeUsersUpvoted(user);
            } else {
                if (existingDownvote) {
                    await forumPost.removeUsersDownvoted(user);
                }
                await forumPost.addUsersUpvoted(user);
            }
        } else if (voteType === 'downvote') {
            if (existingDownvote) {
                await forumPost.removeUsersDownvoted(user);
            } else {
                if (existingUpvote) {
                    await forumPost.removeUsersUpvoted(user);
                }
                await forumPost.addUsersDownvoted(user);
            }
        } else {
            return res.status(400).json({ message: 'Invalid vote type' });
        }
        await forumPost.save();

        res.status(200).json({ message: `${voteType} recorded successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateForumPost = async (req, res) => {
    try {
        const forumPostId = parseInt(req.body.forumPostId);
        const userId = parseInt(req.params.userId);

        // Check if the user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the Post exists
        const forumPost = await ForumPost.findByPk(forumPostId);
        if (!forumPost) {
            return res.status(404).json({ message: 'Forum Post not found' });
        }

        // Check if the user owns the forum Post
        if (forumPost.userId !== userId) {
            return res.status(403).json({ message: 'You do not have permission to update this Post' });
        }

        if (req.body.title != null) {
            forumPost.title = req.body.title;
        }

        if (req.body.message != null) {
            forumPost.message = req.body.message;
        }

        await forumPost.save();

        res.status(200).json({ message: `Post ID${forumPostId}: Post name successfully updated` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const deleteForumPost = async (req, res) => {
    try {
        const forumPostId = parseInt(req.params.forumPostId);
        const userId = parseInt(req.params.userId);


        // Check if the user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the Post exists
        const forumPost = await ForumPost.findByPk(forumPostId);
        if (!forumPost) {
            return res.status(404).json({ message: 'Forum Post not found' });
        }

        // Check if the user owns the forum Post
        if (forumPost.userId !== userId) {
            return res.status(403).json({ message: 'You do not have permission to delete this Post' });
        }

        // Delete the forum Post
        await forumPost.destroy();

        res.status(200).json({ message: `Post ID ${forumPostId}: Post successfully deleted` });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createForumPost,
    getAllForumPost,
    getForumPostVoteDetails,
    updateForumPostFlaggedStatus,
    updateForumPostVote,
    updateForumPost,
    deleteForumPost,
    getAllForumPostById,
    getAllForumPostByUserId,
    getAllUserUpvotedForumPost,
    getAllUserDownvotedForumPost,
    getAllUserFlaggedForumPost
};