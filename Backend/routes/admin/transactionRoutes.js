const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  getAllTransactions,
} = require("../../controllers/admin/transactionController");

router.route("/").get(getAllTransactions);

module.exports = router;
