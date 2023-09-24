const express = require("express");
const { TransactionController } = require("../../controllers/user/transactionController")

const router = express.Router();

router.get("/transactions/:id", TransactionController.getTransactions);

module.exports = router;
