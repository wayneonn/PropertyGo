const express = require('express');
const router = express.Router();

const {
    getFlaggedForumPosts,
    markForumPostInappropriate,
    resetForumPostAppropriate
} = require('../../controllers/admin/forumPostController');

router.route('/getFlaggedForumPosts')
    .get(getFlaggedForumPosts);

router.route('/updateForumPostStatus/:id')
    .patch(markForumPostInappropriate);

router.route('/resetAppropriateForumPost/:id')
    .patch(resetForumPostAppropriate);

module.exports = router;