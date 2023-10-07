const express = require('express');
const router = express.Router();

const {
    getAllForumTopics,
    getSingleForumTopic,
    createForumTopic,
    updateForumTopic,
    deleteForumTopic, 
    unflagForumTopic,
} = require('../../controllers/admin/forumTopicController');

router.route('/')
    .get(getAllForumTopics)
    .post(createForumTopic);
    
router.route('/:id')
    .get(getSingleForumTopic)
    .patch(updateForumTopic)
    .delete(deleteForumTopic);

router.route('/updateForumTopicStatus/:id')
    .patch(unflagForumTopic);

module.exports = router;