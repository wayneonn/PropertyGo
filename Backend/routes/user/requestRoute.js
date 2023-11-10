const express = require('express');
const router = express.Router();

const {
    getRequest,
    findRequest,
    getSingleRequest,
    updateRequest,
    deleteRequest, findRequestByPartnerId
} = require('../../controllers/user/requestController');

// Assuming that your path and method names are appropriate for your API design
router.route('/')
    .post(getRequest)
    .get(findRequest);

router.route('/:id')
    .get(getSingleRequest)
    .put(updateRequest)
    .delete(deleteRequest);

// Route to find requests by receiverId
router.route('/partner/:partnerId')
    .get(findRequestByPartnerId);

module.exports = router;