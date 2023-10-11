const express = require('express');
const router = express.Router();

const {
    getAllForumTopics,
    getSingleForumTopic,
    createForumTopic,
    updateForumTopic,
    deleteForumTopic, 
    markForumTopicInappropriate,
    getFlaggedForumTopics,
    resetForumTopicAppropriate
} = require('../../controllers/admin/forumTopicController');

router.route('/getFlaggedForumTopics')
    .get(getFlaggedForumTopics);

router.route('/')
    .get(getAllForumTopics)
    .post(createForumTopic);
    
router.route('/:id')
    .get(getSingleForumTopic)
    .patch(updateForumTopic)
    .delete(deleteForumTopic);

router.route('/updateForumTopicStatus/:id')
    .patch(markForumTopicInappropriate);

router.route('/resetAppropriateForumTopic/:id')
    .patch(resetForumTopicAppropriate);

module.exports = router;