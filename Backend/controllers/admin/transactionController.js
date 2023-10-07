const { Transaction } = require("../../models");

const getAllTransactions = async (req, res) => {
  const transactions = await Transaction.findAll();

  res.status(200).json({ transactions: transactions });
};

module.exports = {
  getAllTransactions,
};
