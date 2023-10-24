const express = require('express');
const router = express.Router();

const {
    addResponse,
} = require('../../controllers/user/responseController');


router.route('/response')
    .post(addResponse)

module.exports = router;