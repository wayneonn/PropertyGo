const express = require('express');
const router = express.Router();

const {
    getRequest,
    findRequest,
    getSingleRequest,
    deleteRequest, findRequestByPartnerId,
  createRequest,
    updateRequest
} = require('../../controllers/user/requestController');

// Assuming that your path and method names are appropriate for your API design
router.route('/')
    .post(getRequest)
    .get(findRequest);

router.route('/:id')
    .get(getSingleRequest)
    .delete(deleteRequest);

// Route to find requests by receiverId
router.route('/partner/:partnerId')
    .get(findRequestByPartnerId);

router.route('/:userId/request')
    .post(createRequest)

router.route('/updateRequest/:requestId')
    .put(updateRequest)

module.exports = router;