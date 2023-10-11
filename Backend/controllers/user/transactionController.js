const { Transaction } = require("../../models")
const { Op, Sequelize } = require('sequelize');

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

exports.getTopTenTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            where: {
                sellerId: req.params.id,
            },
            order: [
                ['createdAt', 'DESC']  // 'DESC' for descending order; use 'ASC' for ascending if preferred
            ],
            limit: 10
        })
        res.status(200).json({transactions: transactions});
    } catch (error) {
        res.status(500).json({message: "Error fetching top ten transactions: ", error: error.message});
    }
}

exports.getTransactionValueByLastSixMonths = async (req, res) => {
    try{
        // 1. Determine Date Range
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        // 2. Construct the Query
        const transactionData = await Transaction.findAll({
            attributes: [
                [Sequelize.fn('YEAR', Sequelize.col('createdAt')), 'year'],
                [Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'month'],
                [Sequelize.fn('SUM', Sequelize.col('onHoldBalance')), 'totalOnHoldBalance'],
                [Sequelize.fn('COUNT', Sequelize.col('transactionId')), 'transactionCount']
            ],
            where: {
                sellerId: req.params.id,  // Replace with the sellerId you're interested in
                createdAt: {
                    [Op.gte]: sixMonthsAgo
                }
            },
            group: [Sequelize.fn('YEAR', Sequelize.col('createdAt')), Sequelize.fn('MONTH', Sequelize.col('createdAt'))],
            order: [[Sequelize.fn('YEAR', Sequelize.col('createdAt')), 'DESC'], [Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'DESC']]
        })
        res.status(200).json({transactions: transactionData});
    } catch (error) {
        res.status(500).json({message: "Error fetching six monthly transaction value: ", error: error.message});
    }
}

exports.getTransactionValueByBuyerId = async (req, res) => {
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const transactionData = await Transaction.findAll({
            attributes: [
                'buyerId',
                [Sequelize.fn('SUM', Sequelize.col('onHoldBalance')), 'totalOnHoldBalance'],
                [Sequelize.fn('COUNT', Sequelize.col('transactionId')), 'transactionCount']
            ],
            where: {
                sellerId: req.params.id,
                createdAt: {
                    [Op.gte]: sixMonthsAgo
                }
            },
            group: ['buyerId'],
            order: [['buyerId', 'ASC']]
        })
        res.status(200).json({transactions: transactionData});
    } catch (error){
        res.status(500).json({message: "Error fetching monthly transaction value by ID: ", error: error.message});
    }
 }


