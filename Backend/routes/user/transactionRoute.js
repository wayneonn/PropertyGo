const express = require("express");
const { getTransactions, getTopTenTransactions, getTransactionValueByLastSixMonths, getTransactionValueByBuyerId} = require("../../controllers/user/transactionController")

const router = express.Router();

router.get("/transactions/:id", getTransactions);
router.get("/transactions/top/:id", getTopTenTransactions);
router.get("/transactions/sixmonths/:id", getTransactionValueByLastSixMonths)
router.get("/transactions/buyerid/:id", getTransactionValueByBuyerId)

module.exports = router;
