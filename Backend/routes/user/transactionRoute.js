const express = require("express");
const { getTransactions } = require("../../controllers/user/transactionController")

const router = express.Router();

router.get("/transactions/:id", getTransactions);

module.exports = router;
