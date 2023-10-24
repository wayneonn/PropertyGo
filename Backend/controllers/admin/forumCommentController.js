const { ForumComment, ForumTopic, ForumPost, User, Notification, Image } = require("../../models");

const getFlaggedForumComments = async (req, res) => {
    try {
        const forumComments = await ForumComment.findAll({
            attributes: [
                "forumCommentId",
                "forumPostId",
                "userId"
            ],
        });

        const imageIdToPropertyIdMap = {};

        const images = await Image.findAll();
        images.forEach((image) => {
            const forumCommentId = image.forumCommentId;
            const imageId = image.imageId;
            if (!imageIdToPropertyIdMap[forumCommentId]) {
                imageIdToPropertyIdMap[forumCommentId] = [];
            }
            imageIdToPropertyIdMap[forumCommentId].push(imageId);
        });

        const formattedForumComments = await Promise.all(
            forumComments.map(async (forumComment) => {
                const forumCommentFromDB = await ForumComment.findByPk(forumComment.forumCommentId);
                const forumPostFromDB = await ForumPost.findByPk(forumComment.forumPostId);
                const forumTopic = await ForumTopic.findByPk(forumPostFromDB.forumTopicId);
                const user = await User.findByPk(forumComment.userId);

                const totalFlagged = await forumCommentFromDB.countUsersFlagged();

                return {
                    forumComment: forumCommentFromDB,
                    forumPost: forumPostFromDB,
                    totalFlagged: totalFlagged,
                    forumTopic: forumTopic,
                    user: user.userName,
                    images: imageIdToPropertyIdMap[forumComment.forumCommentId] || []
                };
            })
        );

        res.status(200).json(formattedForumComments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const markForumCommentInappropriate = async (req, res) => {
    const { id: forumCommentId } = req.params;

    const { typeOfResponse, adminId } = req.body;

    const forumComment = await ForumComment.findByPk(forumCommentId);

    if (typeOfResponse === "no") {
        // const forumComments = await ForumComment.findByPk(forumCommentId, {
        //     include: {
        //       model: User,
        //       as: 'usersFlagged', 
        //     }
        //   });

        // for (const usersFlaggedForumComment of forumComments.usersFlagged) {
        //     const userIdFlagged = usersFlaggedForumComment.dataValues.userId;

        //     await forumComment.removeUsersFlagged(userIdFlagged);
        // }
    } else {
        forumComment.isInappropriate = true;
    }

    await forumComment.save();

    req.body = {
        "content": `You have successfully flagged the forum comment of "${forumComment.message}" as ${typeOfResponse === "no" ? "appropriate" : "inappropriate"}`,
        "isRecent": false,
        "isPending": false,
        "isCompleted": true,
        "hasRead": false,
        "adminId": adminId
    };

    await Notification.create(req.body);

    req.io.emit("newAdminFlaggedForumComment", "Admin has flagged forum comment");
    res.status(200).json({ forumComment });
};

const resetForumCommentAppropriate = async (req, res) => {
    const { id: forumCommentId } = req.params;

    const { adminId } = req.body;

    const forumComment = await ForumComment.findByPk(forumCommentId);

    forumComment.isInappropriate = false;

    // const forumComments = await ForumComment.findByPk(forumCommentId, {
    //     include: {
    //       model: User,
    //       as: 'usersFlagged', 
    //     }
    //   });

    // for (const usersFlaggedForumComment of forumComments.usersFlagged) {
    //     const userIdFlagged = usersFlaggedForumComment.dataValues.userId;

    //     await forumComment.removeUsersFlagged(userIdFlagged);
    // }

    await forumComment.save();

    req.body = {
        "content": `You have successfully reset the forum comment of "${forumComment.message}" to appropriate`,
        "isRecent": false,
        "isPending": false,
        "isCompleted": true,
        "hasRead": false,
        "adminId": adminId
    };

    await Notification.create(req.body);

    req.io.emit("newAdminResetAppropriateForumComment", "Admin has reset forum comment to appropriate");

    res.status(200).json({ forumComment });
};

module.exports = {
    getFlaggedForumComments,
    markForumCommentInappropriate,
    resetForumCommentAppropriate
};