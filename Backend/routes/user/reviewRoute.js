const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { getRatingForUser } = require('../../controllers/user/reviewController'); // Import the image controller

// Define a route to get images by property ID
router.get('/getRatingForUser/:revieweeId', getRatingForUser);

module.exports = router;