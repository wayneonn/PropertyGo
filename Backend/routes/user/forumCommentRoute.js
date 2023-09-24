const express = require('express');
const router = express.Router();

const {
    // createForumCommentTestData,
    createForumComment,
} = require('../../controllers/user/forumCommentController');


router.route('/:userId/forumComment')
    // .get(getUserContactUs)
    .post(createForumComment)

module.exports = router;