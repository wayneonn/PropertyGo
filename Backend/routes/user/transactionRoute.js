const express = require("express");
const { Transaction } = require("../../models");

const router = express.Router();

router.get("/transactions/:id", async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { userId: req.params.id },
    });
    res.json({ transactions });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching transaction: ", error: error.message });
  }
});

module.exports = router;
