const express = require('express');
const router = express.Router();

const {
    getAllContactUs,
    getSingleContactUs,
    closeContactUs
} = require('../../controllers/admin/contactUsController');

router.route('/')
    .get(getAllContactUs);
    
router.route('/:id')
    .get(getSingleContactUs)
    .patch(closeContactUs);

module.exports = router;