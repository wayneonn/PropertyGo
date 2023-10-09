const express = require('express');
const router = express.Router();

const {
    // createForumTopicTestData,
    createForumTopic,
    getAllForumTopic,
    updateForumTopicFlaggedStatus,
    updateForumTopicVote,
    updateForumTopicName,
    deleteForumTopicName,
    getForumTopicVoteDetails,
    getAllForumTopicByUserId,
    getAllUserUpvotedForumTopic,
    getAllUserDownvotedForumTopic,
    getAllUserFlaggedForumTopic,
} = require('../../controllers/user/forumTopicController');


router.route('/:userId/forumTopic')
    .post(createForumTopic)
    .get(getAllForumTopic)

router.route('/:userId/forumTopicsUserUpvoted')
    .get(getAllUserUpvotedForumTopic)

router.route('/:userId/forumTopicsUserDownvoted')
    .get(getAllUserDownvotedForumTopic)

router.route('/:userId/forumTopicsUserFlagged')
    .get(getAllUserFlaggedForumTopic)

router.route('/:userId/forumTopicsByUserId')
    .get(getAllForumTopicByUserId)

router.route('/:userId/forumTopic/:forumTopicId/voteDetails')
    .get(getForumTopicVoteDetails)

router.route('/:userId/forumTopic/:forumTopicId/flagTopic')
    .put(updateForumTopicFlaggedStatus)

router.route('/:userId/forumTopic/:forumTopicId/voteTopic')
    .put(updateForumTopicVote)

router.route('/:userId/forumTopic/:forumTopicId/updateTopicName')
    .put(updateForumTopicName)

router.route('/:userId/forumTopic/:forumTopicId/deleteForumTopic')
    .delete(deleteForumTopicName)

module.exports = router;