const express = require('express');
const router = express.Router();

const {
    createContactUs,
    getUserContactUs
} = require('../../controllers/user/contactUsController');


router.route('/:userId/contactUs')
    .get(getUserContactUs)
    .post(createContactUs)

module.exports = router;