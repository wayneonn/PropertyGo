const express = require('express');
const router = express.Router();
const { getImagesByPropertyId, getImageById } = require('../../controllers/user/imageController'); // Import the image controller

// Define a route to get images by property ID
router.get('/getImagesByPropertyId/:propertyListingId', getImagesByPropertyId);
router.get('/:imageId', getImageById);

module.exports = router;
