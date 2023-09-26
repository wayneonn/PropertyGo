const { Transaction } = require("../../models")

exports.getTransactions = async (req, res) => {
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
}

