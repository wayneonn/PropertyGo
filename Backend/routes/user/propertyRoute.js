const express = require('express');
const router = express.Router();
const multer = require('multer');
const { sequelize } = require('../../models');
const { getAllProperties, createProperty, updateProperty, getPropertyById, 
    countUsersFavoritedProperty, getPropertiesByFavoriteCount, getPropertiesByRegion, 
    getRecentlyAddedProperties, getPropertiesByUser, removeProperty, 
    editProperty, searchProperties} = require('../../controllers/user/propertyController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/:propertyId/numOfFavorite', countUsersFavoritedProperty);
router.get('/topFavoritedProperty', getPropertiesByFavoriteCount);
router.get('/recently-added', getRecentlyAddedProperties);
router.get('/search', searchProperties);
router.get('/propertiesByRegion/:region', getPropertiesByRegion);
router.get('/propertiesByUser/:userId', getPropertiesByUser);
router.get('/', getAllProperties);
router.post('/', upload.array('images', 5), createProperty);
router.put('/:propertyId', editProperty);
router.delete('/:propertyId', removeProperty);
router.get('/:propertyListingId', getPropertyById);

module.exports = router;
