const express = require('express');
const router = express.Router();

const {
    getAllFaqs,
    getSingleFaq
} = require('../../controllers/admin/faqController');

router.get('/', getAllFaqs);
router.get('/:id', getSingleFaq);

module.exports = router;