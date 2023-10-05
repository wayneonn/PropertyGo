const express = require('express');
const router = express.Router();

const {
    // createForumCommentTestData,
    createForumComment,
    getAllForumComment,
    updateForumCommentFlaggedStatus,
    updateForumCommentVote,
    updateForumComment,
    deleteForumComment,
    getForumCommentVoteDetails
} = require('../../controllers/user/forumCommentController');


router.route('/:userId/forumComment')
    .post(createForumComment)
    .get(getAllForumComment)

router.route('/:userId/forumComment/:forumCommentId/flagComment')
    .put(updateForumCommentFlaggedStatus)

router.route('/:userId/forumComment/:forumCommentId/voteDetails')
    .get(getForumCommentVoteDetails)

router.route('/:userId/forumComment/:forumCommentId/voteComment')
    .put(updateForumCommentVote)

router.route('/:userId/forumComment/updateComment')
    .put(updateForumComment)

router.route('/:userId/forumComment/:forumCommentId/deleteForumComment')
    .delete(deleteForumComment)

module.exports = router;