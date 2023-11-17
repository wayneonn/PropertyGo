const express = require('express');
const router = express.Router();
const multer = require('multer');
const { sequelize } = require('../../models');
const { getAllUsers, createUser, updateUser, uploadProfilePicture, getUserById, addFavoriteProperty, removeFavoriteProperty, getUserFavorites, isPropertyInFavorites, getPartnerByRangeAndType,
    editUserBoost, savePushToken,
    uploadCompanyPictures, uploadPartnerChatPictures
} = require('../../controllers/user/userController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', getAllUsers);
router.post('/', upload.single('profileImage'), createUser);
router.get('/:userId', getUserById);
router.put('/:id', upload.single('profileImage'), updateUser);
router.post('/:userId/profilePicture', upload.single('profileImage'), uploadProfilePicture);
router.post('/:userId/addFavorite/:propertyId', addFavoriteProperty);
router.delete('/:userId/removeFavorite/:propertyId', removeFavoriteProperty);
router.get('/:userId/favorites', getUserFavorites);
router.get('/:userId/isPropertyInFavorites/:propertyId', isPropertyInFavorites);
router.get('/partners/:type/:start/:end', getPartnerByRangeAndType);
router.put('/:id/boost', editUserBoost);
router.post('/:id/addCompanyPhotos', upload.array('images', 10), uploadCompanyPictures)
router.post('/:id/addChatPhotos', upload.array('images', 10), uploadPartnerChatPictures)
router.route('/savePushToken').post(savePushToken)

module.exports = router;
