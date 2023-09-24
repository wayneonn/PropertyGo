const express = require('express');
const router = express.Router();

const {
    // createForumPostTestData,
    createForumPost,
} = require('../../controllers/user/forumPostController');


router.route('/:userId/forumPost')
    // .get(getUserContactUs)
    .post(createForumPost)

module.exports = router;