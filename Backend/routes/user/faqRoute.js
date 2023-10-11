const express = require('express');
const router = express.Router();

const {
    getAllBuyerFAQ,
    getAllSellerFAQ,
} = require('../../controllers/user/faqController');

router.route('/faq/buyer')
    .get(getAllBuyerFAQ)


router.route('/faq/seller')
    .get(getAllSellerFAQ)


module.exports = router;