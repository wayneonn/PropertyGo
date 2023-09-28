const express = require('express');
const router = express.Router();
const multer = require('multer');
const { sequelize } = require('../../models');
const { getAllUsers, createUser, updateUser, uploadProfilePicture, getUserById, addFavoriteProperty, removeFavoriteProperty, getUserFavorites} = require('../../controllers/user/userController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', getAllUsers);
router.post('/', upload.single('profileImage'), createUser);
router.get('/:userId', getUserById);
router.put('/:id', upload.single('profileImage'), updateUser);
router.post('/:userId/profilePicture', upload.single('profileImage'), uploadProfilePicture);
// Add a property to a user's favorites
router.post('/:userId/addFavorite/:propertyId', addFavoriteProperty);
// Remove a property from a user's favorites
router.delete('/:userId/removeFavorite/:propertyId', removeFavoriteProperty);
// Get a list of a user's favorite properties
router.get('/:userId/favorites', getUserFavorites);


module.exports = router;
