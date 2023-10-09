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

module.exports = router;