const { ForumTopic, ForumPost, User, Notification, Image } = require("../../models");
const { loggedInUsers } = require('../../shared');

const getFlaggedForumPosts = async (req, res) => {
    try {
        const forumPosts = await ForumPost.findAll({
            attributes: [
                "forumPostId",
                "forumTopicId",
                "userId"
            ],
        });

        const imageIdToPropertyIdMap = {};

        const images = await Image.findAll();
        images.forEach((image) => {
            const forumPostId = image.forumPostId;
            const imageId = image.imageId;
            if (!imageIdToPropertyIdMap[forumPostId]) {
                imageIdToPropertyIdMap[forumPostId] = [];
            }
            imageIdToPropertyIdMap[forumPostId].push(imageId);
        });

        const formattedForumPosts = await Promise.all(
            forumPosts.map(async (forumPost) => {

                const forumPostFromDB = await ForumPost.findByPk(forumPost.forumPostId);
                const forumTopic = await ForumTopic.findByPk(forumPost.forumTopicId);
                const user = await User.findByPk(forumPost.userId);

                const totalFlagged = await forumPostFromDB.countUsersFlagged();

                return {
                    forumPost: forumPostFromDB,
                    totalFlagged: totalFlagged,
                    forumTopic: forumTopic,
                    user: user.userName,
                    images: imageIdToPropertyIdMap[forumPost.forumPostId] || []
                };
            })
        );

        res.status(200).json(formattedForumPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const markForumPostInappropriate = async (req, res) => {
    const { id: forumPostId } = req.params;

    const { typeOfResponse, adminId } = req.body;

    const forumPost = await ForumPost.findByPk(forumPostId);

    if (typeOfResponse === "no") {
        // const forumPosts = await ForumPost.findByPk(forumPostId, {
        //     include: {
        //       model: User,
        //       as: 'usersFlagged', 
        //     }
        //   });

        // for (const usersFlaggedForumPost of forumPosts.usersFlagged) {
        //     const userIdFlagged = usersFlaggedForumPost.dataValues.userId;

        //     await forumPost.removeUsersFlagged(userIdFlagged);
        // }
    } else {
        forumPost.isInappropriate = true;
    }

    await forumPost.save();

    req.body = {
        "content": `You have successfully flagged the forum post of "${forumPost.title}" as ${typeOfResponse === "no" ? "appropriate" : "inappropriate"}`,
        "isRecent": false,
        "isPending": false,
        "isCompleted": true,
        "hasRead": false,
        "adminId": adminId
    };

    
    const userNotification = {
        "content" : `The admin have flagged the forum post of "${forumPost.title}" as ${typeOfResponse === "no" ? "appropriate" : "inappropriate"}`,
        "adminNotificationId": adminId,
        "userId" : forumPost.userId,
        "forumPostId" : forumPost.forumPostId,
    };

    console.log("userId  " , forumPost.userId)

    await Notification.create(req.body);
    await Notification.create(userNotification);
    const forumPostUser = await forumPost.getUser();

    if (forumPostUser && loggedInUsers.has(forumPostUser.userId) && forumPostUser.userId !== userId){
        req.io.emit("userNotification", {"pushToken": forumPostUser.pushToken, "title": forumPost.title, "body": content});
        // console.log("Emitted userNewForumCommentNotification");
    }


    req.io.emit("newAdminFlaggedForumPost", "Admin has flagged forum post");
    res.status(200).json({ forumPost });
};

const resetForumPostAppropriate = async (req, res) => {
    const { id: forumPostId } = req.params;

    const { adminId } = req.body;

    const forumPost = await ForumPost.findByPk(forumPostId);

    forumPost.isInappropriate = false;

    // const forumPosts = await ForumPost.findByPk(forumPostId, {
    //     include: {
    //       model: User,
    //       as: 'usersFlagged', 
    //     }
    //   });

    // for (const usersFlaggedForumPost of forumPosts.usersFlagged) {
    //     const userIdFlagged = usersFlaggedForumPost.dataValues.userId;

    //     await forumPost.removeUsersFlagged(userIdFlagged);
    // }

    await forumPost.save();

    req.body = {
        "content": `You have successfully reset the forum post of "${forumPost.title}" to appropriate`,
        "isRecent": false,
        "isPending": false,
        "isCompleted": true,
        "hasRead": false,
        "adminId": adminId
    };

    await Notification.create(req.body);

    req.io.emit("newAdminResetAppropriateForumPost", "Admin has reset forum post to appropriate");

    res.status(200).json({ forumPost });
};

module.exports = {
    getFlaggedForumPosts,
    markForumPostInappropriate,
    resetForumPostAppropriate
};