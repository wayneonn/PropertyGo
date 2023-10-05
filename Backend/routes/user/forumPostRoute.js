const express = require('express');
const router = express.Router();
const multer = require('multer');


const {
    // createForumPostTestData,
    createForumPost,
    getAllForumPost,
    updateForumPostFlaggedStatus,
    updateForumPostVote,
    updateForumPost,
    deleteForumPost,
    getForumPostVoteDetails,
    getAllForumPostById
} = require('../../controllers/user/forumPostController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route('/:userId/forumPost')
    .post(upload.array("images", 5),createForumPost)
    .get(getAllForumPost)
    
router.route('/forumPost/:forumPostId')
    .get(getAllForumPostById)

router.route('/:userId/forumPost/:forumPostId/voteDetails')
    .get(getForumPostVoteDetails)

router.route('/:userId/forumPost/:forumPostId/flagPost')
    .put(updateForumPostFlaggedStatus)

router.route('/:userId/forumPost/:forumPostId/votePost')
    .put(updateForumPostVote)

router.route('/:userId/forumPost/updatePost')
    .put(updateForumPost)

router.route('/:userId/forumPost/:forumPostId/deleteForumPost')
    .delete(deleteForumPost)

module.exports = router;