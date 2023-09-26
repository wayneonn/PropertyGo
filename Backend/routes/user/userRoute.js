const express = require('express');
const router = express.Router();
const multer = require('multer');
const { sequelize } = require('../../models');
const { getAllUsers, createUser, updateUser, uploadProfilePicture } = require('../../controllers/user/userController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', getAllUsers);
router.post('/', upload.single('profileImage'), createUser);
router.put('/:id', upload.single('profileImage'), updateUser);
router.post('/:userId/profilePicture', upload.single('profileImage'), uploadProfilePicture);

module.exports = router;
