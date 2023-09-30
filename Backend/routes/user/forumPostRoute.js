const express = require('express');
const router = express.Router();

const {
    // createForumPostTestData,
    createForumPost,
    getAllForumPost,
    updateForumPostFlaggedStatus,
    updateForumPostVote,
    updateForumPost,
    deleteForumPost,
} = require('../../controllers/user/forumPostController');


router.route('/:userId/forumPost')
    .post(createForumPost)
    .get(getAllForumPost)

router.route('/:userId/forumPost/:forumPostId/flagPost')
    .put(updateForumPostFlaggedStatus)


router.route('/:userId/forumPost/:forumPostId/votePost')
    .put(updateForumPostVote)

router.route('/:userId/forumPost/updatePost')
    .put(updateForumPost)

router.route('/:userId/forumPost/:forumPostId/deleteForumPost')
    .delete(deleteForumPost)

module.exports = router;