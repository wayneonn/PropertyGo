const express = require('express');
const router = express.Router();
const { getImagesByPropertyId, getImageById, 
    removeImageById, updateImageById, createImageWithPropertyId} = require('../../controllers/user/imageController'); // Import the image controller

// Define a route to get images by property ID
router.get('/getImagesByPropertyId/:propertyListingId', getImagesByPropertyId);
router.get('/:imageId', getImageById);
router.delete('/:imageId', removeImageById);
router.put('/:imageId', updateImageById);
router.post('/createImageWithPropertyId/:propertyId', createImageWithPropertyId);

module.exports = router;
