const express = require('express');
const router = express.Router();

const {
    getAllAdmins,
    getSingleAdmin,
    updateAdminUsername,
    updateAdminPassword
} = require('../../controllers/admin/adminController');

router.get('/', getAllAdmins);
router.get('/:id', getSingleAdmin);
router.patch('/updateUserName', updateAdminUsername);
router.patch('/updatePassword', updateAdminPassword);

module.exports = router;