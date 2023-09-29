const express = require('express');
const router = express.Router();
const multer = require('multer');
const { sequelize } = require('../../models');
const { getAllProperties, createProperty, updateProperty, getPropertyById, countUsersFavoritedProperty, getPropertiesByFavoriteCount, getPropertiesByRegion} = require('../../controllers/user/propertyController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/:propertyId/numOfFavorite', countUsersFavoritedProperty);
router.get('/topFavoritedProperty', getPropertiesByFavoriteCount);
router.get('/propertiesByRegion/:region', getPropertiesByRegion);
router.get('/', getAllProperties);
router.post('/', upload.array('images', 15), createProperty);
router.put('/:id', upload.single('images'), updateProperty);
router.get('/:propertyListingId', getPropertyById);

module.exports = router;
