const express = require('express');
const router = express.Router();

const {
    createContactUs,
    getUserContactUs,
    getUserContactUsId
} = require('../../controllers/user/contactUsController');


router.route('/:userId/contactUs')
    .get(getUserContactUs)
    .post(createContactUs)

router.route('/contactUs/:contactUsId')
    .get(getUserContactUsId)

module.exports = router;