const express = require('express');
const router = express.Router();
const { createSchedule, getScheduleById, 
    updateScheduleByUserIdAndDate, deleteSchedule, getScheduleByDateAndPropertyId,
    getScheduleByUserId, getScheduleByPropertyId, getScheduleBySellerId, 
    sellerApprovesViewing, sellerRejectsViewing, sellerCancelsViewing,
    buyerCancelsViewing} = require('../../controllers/user/scheduleController');

router.post('/', createSchedule);
router.get('/date-property', getScheduleByDateAndPropertyId);
router.get('/byUserId/:userId', getScheduleByUserId);
router.get('/bySellerId/:sellerId', getScheduleBySellerId);
router.get('/byPropertyId/:propertyId', getScheduleByPropertyId);
router.get('/:scheduleId', getScheduleById);
router.put('/:userId/:date', updateScheduleByUserIdAndDate);
router.delete('/:scheduleId', deleteSchedule);
router.post('/sellerApprovesViewing/:scheduleId', sellerApprovesViewing);
router.post('/sellerRejectsViewing/:scheduleId', sellerRejectsViewing);
router.post('/sellerCancelsViewing/:scheduleId', sellerCancelsViewing);
router.post('/buyerCancelsViewing/:scheduleId', buyerCancelsViewing);

module.exports = router;
