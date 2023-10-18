const express = require("express");
const router = express.Router();

const {
  createPaymentIntent,
  refundPayment,
} = require("../../controllers/admin/paymentController");

router.post("/createPayment", createPaymentIntent);
router.post("/refundPayment", refundPayment);

module.exports = router;
