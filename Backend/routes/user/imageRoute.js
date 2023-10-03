const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { getImagesByPropertyId, getImageById, 
    removeImageById, updateImageById, createImageWithPropertyId} = require('../../controllers/user/imageController'); // Import the image controller

// Define a route to get images by property ID
router.get('/getImagesByPropertyId/:propertyListingId', getImagesByPropertyId);
router.get('/:imageId', getImageById);
router.delete('/:imageId', removeImageById);
router.put('/:imageId', upload.single('image'), updateImageById);
router.post('/createImageWithPropertyId/:propertyId', upload.single('image'), createImageWithPropertyId);

module.exports = router;
