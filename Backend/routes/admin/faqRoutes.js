const express = require('express');
const router = express.Router();

const {
    getAllFaqs,
    getSingleFaq,
    createFaq,
    updateFaq,
    deleteFaq
} = require('../../controllers/admin/faqController');

router.route('/')
    .get(getAllFaqs)
    .post(createFaq);
    
router.route('/:id')
    .get(getSingleFaq)
    .patch(updateFaq)
    .delete(deleteFaq);

module.exports = router;