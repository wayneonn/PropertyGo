const express = require('express');
const partnerApplicationController = require('../../controllers/user/partnerApplicationController'); // Adjust the path as needed

const router = express.Router();

router.get('/partner/list/:id', partnerApplicationController.getPartnerApplicationsByUserID);
router.post('/partner/new_app/', partnerApplicationController.postPartnerApplicationByUserID);
router.get('/partner/admin/approval/', partnerApplicationController.getAllPartnerApplicationsNotApproved);
router.put('/partner/admin/approve/:id', partnerApplicationController.updatePartnerApplicationByID);
router.put('/partner/admin/reject/:id', partnerApplicationController.rejectPartnerApplicationByID);
router.get('/partner/list', partnerApplicationController.getPartnerApplications);
module.exports = router;
