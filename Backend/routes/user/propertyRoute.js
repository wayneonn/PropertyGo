const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getAllProperties, createProperty, updateProperty, getPropertyById, countUsersFavoritedProperty} = require('../../controllers/user/propertyController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', getAllProperties);
router.post('/', upload.array('images', 15), createProperty);
router.get('/:propertyId/numOfFavorite', countUsersFavoritedProperty);
router.put('/:id', upload.single('images'), updateProperty);
router.get('/:propertyListingId', getPropertyById);

module.exports = router;
