const express = require('express');
const router = express.Router();

const {
    getAllContactUs,
    getSingleContactUs,
    respondContactUs
} = require('../../controllers/admin/contactUsController');

router.route('/')
    .get(getAllContactUs);
    
router.route('/:id')
    .get(getSingleContactUs)
    .patch(respondContactUs);

module.exports = router;