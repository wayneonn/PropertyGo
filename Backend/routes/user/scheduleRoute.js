const express = require('express');
const router = express.Router();
const { createSchedule, getScheduleById, 
    updateScheduleByUserIdAndDate, deleteSchedule, getScheduleByDateAndPropertyId } = require('../../controllers/user/scheduleController');

router.post('/', createSchedule);
router.get('/date-property', getScheduleByDateAndPropertyId);
router.get('/:scheduleId', getScheduleById);
router.put('/:userId/:date', updateScheduleByUserIdAndDate);
router.delete('/:scheduleId', deleteSchedule);

module.exports = router;
