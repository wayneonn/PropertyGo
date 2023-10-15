const express = require('express');
const router = express.Router();
const { createViewingAvailability, getViewingAvailabilityById, updateViewingAvailability, deleteViewingAvailability } = require('../../controllers/user/viewingAvailabilityController.js');

router.post('/', createViewingAvailability);
router.get('/:availabilityId', getViewingAvailabilityById);
router.put('/:availabilityId', updateViewingAvailability);
router.delete('/:availabilityId', deleteViewingAvailability);

module.exports = router;
