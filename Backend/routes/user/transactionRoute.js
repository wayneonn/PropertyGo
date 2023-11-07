const express = require("express");
const { getTransactions, getTopTenTransactions, getTransactionValueByLastSixMonths, getTransactionValueByBuyerId,
    getTopTenTransactionsWithUsers, getTopTenTransactionsWithUsersPaid, getTopTenTransactionsWithUsersPending,
    getTransactionPDFReport, getUserCountsByCountry, getTransactionByTransactionId, createTransaction, getUserTransactions,
    getAverageValues, getAverageTransactions, getTransactionInvoicePdf, createOptionFeeTransaction,
    sellerUploadedOTP, buyerUploadedOTP, updateTransaction, buyerCancelOTP, buyerRequestReupload,
    sellerCancelledOTP
} = require("../../controllers/user/transactionController")


const router = express.Router();

router.get("/transactions/:id", getTransactions);
router.put("/transactions/:id", updateTransaction);
router.get("/transactions/byUserId/:id", getUserTransactions);
router.get("/transactions/byTransactionId/:id", getTransactionByTransactionId);
router.get("/transactions/top/:id", getTopTenTransactions);
router.get("/transactions/sixmonths/:id", getTransactionValueByLastSixMonths)
router.get("/transactions/buyerid/:id", getTransactionValueByBuyerId)
router.get("/transactions/omega_top/:id", getTopTenTransactionsWithUsers)
router.get("/transactions/omega_top/paid/:id", getTopTenTransactionsWithUsersPaid)
// router.get("/transactions/omega_top/pending/:id", getTopTenTransactionsWithUsersPending)
router.get("/transactions/pdf/:id", getTransactionPDFReport)
router.get("/transactions/invoicePdf/:id", getTransactionInvoicePdf)
router.get("/transactions/countrycount/:id", getUserCountsByCountry)
router.post("/transactions/createTransaction", createTransaction)
router.post("/transactions/sellerUploadedOTP/:transactionId", sellerUploadedOTP)
router.post("/transactions/buyerUploadedOTP/:transactionId", buyerUploadedOTP)
router.post("/transactions/sellerCancelledOTP/:transactionId", sellerCancelledOTP)
router.post("/transactions/buyerRequestReupload/:transactionId", buyerRequestReupload)
router.post("/transactions/buyerCancelOTP/:transactionId", buyerCancelOTP)
router.post("/transactions/createOptionFeeTransaction", createOptionFeeTransaction)
router.get("/transactions/data/average", getAverageValues)
router.get("/transactions/data/count", getAverageTransactions)
module.exports = router;
