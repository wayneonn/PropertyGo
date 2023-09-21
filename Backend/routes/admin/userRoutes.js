const express = require('express');
const router = express.Router();

const {
    getUserName,
} = require('../../controllers/admin/userController');
    
router.route('/:id')
    .get(getUserName)

module.exports = router;