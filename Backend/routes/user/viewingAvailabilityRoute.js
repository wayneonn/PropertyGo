const express = require('express');
const router = express.Router();
const { createViewingAvailability, getViewingAvailabilityById, updateViewingAvailability, deleteViewingAvailability, getViewingAvailabilityByDateAndPropertyId } = require('../../controllers/user/viewingAvailabilityController');

router.post('/', createViewingAvailability);
router.get('/date-property', getViewingAvailabilityByDateAndPropertyId);
router.get('/:availabilityId', getViewingAvailabilityById);
router.put('/:availabilityId', updateViewingAvailability);
router.delete('/:availabilityId', deleteViewingAvailability);


module.exports = router;
