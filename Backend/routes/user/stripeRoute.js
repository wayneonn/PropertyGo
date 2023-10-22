const express = require('express');
const router = express.Router();

const { paymentSheet, refundPayment} = require('../../controllers/user/stripeController'); // Import the image controller

// Define a route to get images by property ID
router.post('/stripe/payment-sheet', paymentSheet);
router.post('/stripe/refundPayment', refundPayment);

module.exports = router;
