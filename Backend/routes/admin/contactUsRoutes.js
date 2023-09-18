const express = require('express');
const router = express.Router();

const {
    getAllContactUs,
    getSingleContactUs
} = require('../../controllers/admin/contactUsController');

router.route('/')
    .get(getAllContactUs);
    
router.route('/:id')
    .get(getSingleContactUs);

module.exports = router;