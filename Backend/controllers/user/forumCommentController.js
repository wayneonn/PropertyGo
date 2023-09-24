const { ForumComment, User } = require("../../models");


const createForumCommentTestData = async (req, res) => {

    try {
        const forumComment = await ForumComment.create(req.body);
        res.status(201).json({ forumComment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const createForumComment = async (req, res) => {
    const { userId } = req.params; // Use destructuring to get userId

    // Assuming you want to set userId in the ForumComment model
    req.body.userId = userId;

    try {
        const forumComment = await ForumComment.create(req.body);
        res.status(201).json({ forumComment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// const getUserContactUs = async (req, res) => {
//     try {
//         const user = await User.findByPk(req.params.userId, {
//             include: [{ model: ContactUs, as: 'contactUs-es' }],
//         });

//         if (!user) {
//             return res.status(404).json({ message: 'User Not Found' });
//         }

//         const contactUses = user['contactUs-es'];
//         console.log(contactUses);
//         res.status(200).json(contactUses);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

module.exports = {
    // createForumCommentTestData,
    createForumComment,
    // getUserContactUs
};