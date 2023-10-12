const express = require("express");
const { getTransactions, getTopTenTransactions, getTransactionValueByLastSixMonths, getTransactionValueByBuyerId,
    getTopTenTransactionsWithUsers, getTopTenTransactionsWithUsersPaid, getTopTenTransactionsWithUsersPending,
    getTransactionPDFReport, getUserCountsByCountry
} = require("../../controllers/user/transactionController")

const router = express.Router();

router.get("/transactions/:id", getTransactions);
router.get("/transactions/top/:id", getTopTenTransactions);
router.get("/transactions/sixmonths/:id", getTransactionValueByLastSixMonths)
router.get("/transactions/buyerid/:id", getTransactionValueByBuyerId)
router.get("/transactions/omega_top/:id", getTopTenTransactionsWithUsers)
router.get("/transactions/omega_top/paid/:id", getTopTenTransactionsWithUsersPaid)
router.get("/transactions/omega_top/pending/:id", getTopTenTransactionsWithUsersPending)
router.get("/transactions/pdf/:id", getTransactionPDFReport)
router.get("/transactions/countrycount/:id", getUserCountsByCountry)
module.exports = router;
