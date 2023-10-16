const express = require('express');
const router = express.Router();
const { createSchedule, getScheduleById, updateSchedule, deleteSchedule } = require('../../controllers/user/scheduleController');

router.post('/', createSchedule);
router.get('/:scheduleId', getScheduleById);
router.put('/:scheduleId', updateSchedule);
router.delete('/:scheduleId', deleteSchedule);

module.exports = router;
