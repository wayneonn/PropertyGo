const express = require('express');
const partnerApplicationController = require('../../controllers/user/partnerApplicationController'); // Adjust the path as needed

const router = express.Router();

router.get('/partner/list/:id', partnerApplicationController.getPartnerApplicationsByUserID);
router.post('/partner/new_app/', partnerApplicationController.postPartnerApplicationByUserID);

module.exports = router;
