const express = require('express');
const router = express.Router();
const multer = require('multer');

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

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route('/:userId/forumComment')
    .post(upload.array("images", 5), createForumComment)
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