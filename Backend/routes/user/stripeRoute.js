const express = require('express');
const router = express.Router();

const { paymentSheet} = require('../../controllers/user/stripeController'); // Import the image controller

// Define a route to get images by property ID
router.post('/stripe/payment-sheet', paymentSheet);

module.exports = router;
