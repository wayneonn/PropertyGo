const express = require('express');
const router = express.Router();

const {
    // createForumTopicTestData,
    createForumTopic,
} = require('../../controllers/user/forumTopicController');


router.route('/:userId/forumTopic')
    // .get(getUserContactUs)
    .post(createForumTopic)

module.exports = router;