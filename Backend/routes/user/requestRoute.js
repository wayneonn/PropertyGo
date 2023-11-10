const express = require('express');
const router = express.Router();

const {
    createRequest,
    updateRequest
} = require('../../controllers/user/requestController');

router.route('/:userId/request')
    .post(createRequest)

router.route('/updateRequest/:requestId')
    .put(updateRequest)

module.exports = router;