const express = require('express');
const router = express.Router();

const {
    getFlaggedForumComments,
    markForumCommentInappropriate,
    resetForumCommentAppropriate
} = require('../../controllers/admin/forumCommentController');

router.route('/getFlaggedForumComments')
    .get(getFlaggedForumComments);

router.route('/updateForumCommentStatus/:id')
    .patch(markForumCommentInappropriate);

router.route('/resetAppropriateForumComment/:id')
    .patch(resetForumCommentAppropriate);

module.exports = router;