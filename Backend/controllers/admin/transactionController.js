const {Transaction} = require("../../models");

const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.findAll();
        res.status(200).json({transactions: transactions});
    } catch (error) {
        res.status(500).json({message: "Fetching all transaction error: ", error: error.message});
    }
};

module.exports = {
    getAllTransactions,
};
