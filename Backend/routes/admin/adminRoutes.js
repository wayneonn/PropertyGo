const express = require('express');
const router = express.Router();

const {
    getSingleAdmin,
    updateAdminUsername,
    updateAdminPassword
} = require('../../controllers/admin/adminController');

router.get('/', getSingleAdmin);
router.patch('/updateUserName', updateAdminUsername);
router.patch('/updatePassword', updateAdminPassword);

module.exports = router;