const {Transaction, User, Property, Request} = require("../../models")
const {Op, Sequelize} = require('sequelize');
const puppeteer = require('puppeteer');

// Property ID -> Seller ID.
// Request ID -> User ID -> Partner ID
// Realistically I should ignore the Property Side since it does not concern me.
exports.getTransactions = async (req, res) => {
    try {
        // First, fetch all propertyId values associated with the sellerId
        const properties = await Property.findAll({
            where: { sellerId: req.params.id },
            attributes: ['propertyListingId']
        });

        const request = await Request.findAll({
            where: {userId: req.params.id}, attributes: ['requestId']
        })

        // Extract propertyId values from the properties objects
        const propertyIds = properties.map(property => property.propertyListingId);
        const requestIds = request.map(request => request.requestId)

        const transactions = await Transaction.findAll({
            where: { propertyId: propertyIds },
        });
        res.json({transactions});

    } catch (error) {
        res
            .status(500)
            .json({message: "Error fetching transaction: ", error: error.message});
    }
}


exports.getTransactionByTransactionId = async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            where: {transactionId: req.params.id},
        });
        res.json({transactions});
    } catch (error) {
        res
            .status(500)
            .json({message: "Error fetching transaction: ", error: error.message});
    }
}


exports.getTopTenTransactions = async (req, res) => {
    try {
        // First, fetch all propertyId values associated with the sellerId
        const properties = await Property.findAll({
            where: { sellerId: req.params.id },
            attributes: ['propertyListingId']
        });

        // Extract propertyId values from the properties objects
        const propertyIds = properties.map(property => property.propertyListingId);

        const transactions = await Transaction.findAll({
            where: {
                propertyId: propertyIds,
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
    try {
        // 1. Determine Date Range
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        // First, fetch all propertyId values associated with the sellerId
        const properties = await Property.findAll({
            where: { sellerId: req.params.id },
            attributes: ['propertyListingId']
        });

        // Extract propertyId values from the properties objects
        const propertyIds = properties.map(property => property.propertyListingId);

        // 2. Construct the Query
        const transactionData = await Transaction.findAll({
            attributes: [
                [Sequelize.fn('YEAR', Sequelize.col('createdAt')), 'year'],
                [Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'month'],
                [Sequelize.fn('SUM', Sequelize.col('onHoldBalance')), 'totalOnHoldBalance'],
                [Sequelize.fn('COUNT', Sequelize.col('transactionId')), 'transactionCount']
            ],
            where: {
                propertyId: propertyIds,  // Replace with the sellerId you're interested in
                createdAt: {
                    [Op.gte]: sixMonthsAgo
                },
                status: "PAID"
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
        // First, fetch all propertyId values associated with the sellerId
        const properties = await Property.findAll({
            where: { sellerId: req.params.id },
            attributes: ['propertyListingId']
        });

        // Extract propertyId values from the properties objects
        const propertyIds = properties.map(property => property.propertyListingId);

        const transactionData = await Transaction.findAll({
            attributes: [
                'buyerId',
                [Sequelize.fn('SUM', Sequelize.col('onHoldBalance')), 'totalOnHoldBalance'],
                [Sequelize.fn('COUNT', Sequelize.col('transactionId')), 'transactionCount']
            ],
            where: {
                propertyId: propertyIds,
                createdAt: {
                    [Op.gte]: sixMonthsAgo
                }
            },
            group: ['buyerId'],
            order: [['buyerId', 'ASC']]
        })
        res.status(200).json({transactions: transactionData});
    } catch (error) {
        res.status(500).json({message: "Error fetching monthly transaction value by ID: ", error: error.message});
    }
}

exports.getTopTenTransactionsWithUsers = async (req, res) => {
    try {
        // First, fetch all propertyId values associated with the sellerId
        const properties = await Property.findAll({
            where: { sellerId: req.params.id },
            attributes: ['propertyListingId']
        });

        // Extract propertyId values from the properties objects
        const propertyIds = properties.map(property => property.propertyListingId);
        const transactions = await Transaction.findAll({
            where: {
                propertyId: propertyIds,
            },
            order: [
                ['createdAt', 'DESC']  // 'DESC' for descending order; use 'ASC' for ascending if preferred
            ],
            limit: 10
        })
        const buyerId = transactions.map(item => item.buyerId);
        const users = []
        for (let id of buyerId) {
            const user = await User.findOne({
                where: {
                    userId: id
                }
            });
            users.push(user);
        }

        const mergedData = transactions.map((transaction, index) => ({
            transaction: transaction,
            userDetails: users[index]
        }));

        res.status(200).json({mergedData: mergedData});
    } catch (error) {
        res.status(500).json({message: "Error fetching top ten transactions: ", error: error.message});
    }
}

exports.getTopTenTransactionsWithUsersPaid = async (req, res) => {
    try {
        // First, fetch all propertyId values associated with the sellerId
        const properties = await Property.findAll({
            where: { sellerId: req.params.id },
            attributes: ['propertyListingId']
        });

        // Extract propertyId values from the properties objects
        const propertyIds = properties.map(property => property.propertyListingId);
        const transactions = await Transaction.findAll({
            where: {
                propertyId: propertyIds,
                status: "PAID",
            },
            order: [
                ['createdAt', 'DESC']  // 'DESC' for descending order; use 'ASC' for ascending if preferred
            ],
            limit: 10
        })
        const buyerId = transactions.map(item => item.buyerId);
        const users = []
        for (let id of buyerId) {
            const user = await User.findOne({
                where: {
                    userId: id
                }
            });
            users.push(user);
        }

        const mergedData = transactions.map((transaction, index) => ({
            transaction: transaction,
            userDetails: users[index]
        }));

        res.status(200).json({mergedData: mergedData});
    } catch (error) {
        res.status(500).json({message: "Error fetching top ten transactions: ", error: error.message});
    }
}

exports.getTopTenTransactionsWithUsersPending = async (req, res) => {
    try {
        // First, fetch all propertyId values associated with the sellerId
        const properties = await Property.findAll({
            where: { sellerId: req.params.id },
            attributes: ['propertyListingId']
        });

        // Extract propertyId values from the properties objects
        const propertyIds = properties.map(property => property.propertyListingId);
        const transactions = await Transaction.findAll({
            where: {
                propertyId: propertyIds,
                status: "PENDING"
            },
            order: [
                ['createdAt', 'DESC']  // 'DESC' for descending order; use 'ASC' for ascending if preferred
            ],
            limit: 10
        })
        const buyerId = transactions.map(item => item.buyerId);
        const users = []
        for (let id of buyerId) {
            const user = await User.findOne({
                where: {
                    userId: id
                }
            });
            users.push(user);
        }

        const mergedData = transactions.map((transaction, index) => ({
            transaction: transaction,
            userDetails: users[index]
        }));

        res.status(200).json({mergedData: mergedData});
    } catch (error) {
        res.status(500).json({message: "Error fetching top ten transactions: ", error: error.message});
    }
}

exports.getUserCountsByCountry = async(req, res) => {
    try {
        // First, fetch all propertyId values associated with the sellerId
        const properties = await Property.findAll({
            where: { sellerId: req.params.id },
            attributes: ['propertyListingId']
        });

        // Extract propertyId values from the properties objects
        const propertyIds = properties.length !== 0 ? properties.map(property => property.propertyListingId) : [1];
        const orderClause = Sequelize.literal(`MAX(CASE WHEN propertyId IN (${propertyIds.join(',')}) THEN 1 ELSE 0 END) DESC`);
        const orderClauseForTransactionId = [Sequelize.fn('MAX', Sequelize.col('Transaction.transactionId')), 'DESC'];

        // Count for Buyers
        const buyerCounts = await Transaction.findAll({
            attributes: [
                [Sequelize.fn('COUNT', Sequelize.col('Transaction.transactionId')), 'transactionCount'],
                [Sequelize.col('buyer.countryOfOrigin'), 'countryOfOrigin']
            ],
            include: [
                {
                    model: User,
                    as: 'buyer',
                    attributes: []
                }
            ],
            group: ['buyer.countryOfOrigin'],
            where: {
                propertyId: propertyIds
            },
            order: [orderClause], // Secondary sorting by transactionId for consistent results
            raw: true
        });



        res.status(200).json({buyer: buyerCounts});
    } catch (error) {
        console.error("Error fetching user counts by country:", error);
        throw error;
    }
}

exports.getAverageValues = async (req, res) => {
    try {
        const averageOnHoldBalances = await Transaction.findAll({
            attributes: [
                [Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'month'],
                [Sequelize.fn('YEAR', Sequelize.col('createdAt')), 'year'],
                [Sequelize.fn('AVG', Sequelize.col('onHoldBalance')), 'average_onHoldBalance']
            ],
            group: [Sequelize.fn('MONTH', Sequelize.col('createdAt')), Sequelize.fn('YEAR', Sequelize.col('createdAt'))],
            order: [[Sequelize.fn('YEAR', Sequelize.col('createdAt')), 'DESC'], [Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'DESC']],
            limit: 7
        });

        return res.status(200).json({
            data: averageOnHoldBalances
        });

    } catch (error) {
        console.error("Error getting average values: ", error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

exports.getAverageTransactions = async (req, res) => {
    try {
        // First, get the total number of users on the platform.
        const totalUsers = await User.count();

        // Guard against dividing by zero.
        if (totalUsers === 0) {
            throw new Error("No users found.");
        }

        const averageTransactionsPerUserPerMonth = await Transaction.findAll({
            attributes: [
                [Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'month'],
                [Sequelize.fn('YEAR', Sequelize.col('createdAt')), 'year'],
                [Sequelize.literal(`COUNT(transactionId) / ${totalUsers}`), 'averageTransactionsPerUser']
            ],
            group: [Sequelize.fn('MONTH', Sequelize.col('createdAt')), Sequelize.fn('YEAR', Sequelize.col('createdAt'))],
            order: [[Sequelize.fn('YEAR', Sequelize.col('createdAt')), 'DESC'], [Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'DESC']],
            limit: 7
        });

        return res.status(200).json({
            data: averageTransactionsPerUserPerMonth
        });

    } catch (error) {
        console.error("Error getting average transaction count per user: ", error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

exports.getTransactionPDFReport = async (req, res) => {
    try {
        // First, fetch all propertyId values associated with the sellerId
        const properties = await Property.findAll({
            where: { sellerId: req.params.id },
            attributes: ['propertyListingId']
        });

        // Extract propertyId values from the properties objects
        const propertyIds = properties.map(property => property.propertyListingId);
        const transactions = await Transaction.findAll({
            where: {
                propertyId: propertyIds,
                status: "PAID",
            },
            order: [
                ['createdAt', 'DESC']  // 'DESC' for descending order; use 'ASC' for ascending if preferred
            ],
            limit: 10
        })


        // Total Number of Transactions by Seller:
        const totalTransactions = await Transaction.count({
            where: {propertyId: propertyIds}
        });

// Transaction Status Breakdown:
//         const statusBreakdown = await Transaction.findAndCountAll({
//             where: {sellerId: req.params.id},
//             group: ['status'],
//         });

// Total On Hold Balance:
        const totalOnHoldBalance = await Transaction.sum('onHoldBalance', {
            where: {propertyId: propertyIds}
        });


// Total On Hold Balance:
        const totalPaidBalance = await Transaction.sum('onHoldBalance', {
            where: {propertyId: propertyIds, status: "PAID"}
        });

// Number of Properties Sold:
        const propertiesSold = await Transaction.count({
            where: {propertyId: propertyIds},
            distinct: true,
            col: 'propertyId'
        });

// Number of Invoices:
        const totalInvoices = await Transaction.count({
            where: {propertyId: propertyIds},
            distinct: true,
            col: 'invoiceId'
        });

// Average Number of Documents per Transaction:
//         const totalDocuments = await Document.count({
//             include: [{
//                 model: Transaction,
//                 where: {sellerId: req.params.id}
//             }]
//         });
//         const avgDocumentsPerTransaction = totalDocuments / totalTransactions;


        // Need to bring it out as a string.
        const htmlContent = `
        <html>
            <head>
                <title>Partner Report</title>
                <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
                <style>
                    /* You can add styles here */
                    body {
                        font-family: 'Arial', sans-serif;
                        margin: 40px;
                        color: #333;
                    }

                    h1 {
                        text-align: center;
                        color: #444;
                        border-bottom: 1px solid #ddd;
                        padding-bottom: 20px;
                    }

                    table {
                        width: 100%;
                        margin-top: 20px;
                        border-collapse: collapse;
                    }

                    table, th, td {
                        border: 1px solid #ddd;
                    }

                    th, td {
                        padding: 10px 15px;
                        text-align: left;
                    }

                    th {
                        background-color: #f2f2f2;
                        color: #555;
                    }

                    tr:nth-child(even) {
                        background-color: #f5f5f5;
                    }
                    
                    h2 {
                        border-bottom: 1px solid #ddd;
                    }
                    
                    #pieChart {
                        width: 300px;
                        height: 300px;
                    }
                </style>
            </head>
            <body>
                <h1>Partner Report</h1>
                <table>
                    <tr>
                        <th>Statistic</th>
                        <th>Value</th>
                    </tr>
                    <tr>
                        <td>Total Transactions</td>
                        <td>${totalTransactions}</td>
                    </tr>
                    <tr>
                        <td>Total Property Sold</td>
                        <td>${propertiesSold}</td>
                    </tr>
                    <tr>
                        <td>Total Invoices</td>
                        <td>${totalInvoices}</td>
                    </tr>
                    <tr>
                        <td>Current Total Balance</td>
                        <td>${totalOnHoldBalance}</td>
                    </tr>
                    <tr>
                        <td>Current Paid Balance</td>
                        <td>${totalPaidBalance}</td>
                    </tr>
                    <!-- You can add more rows for other stats -->
                </table>

                <!-- Placeholder for a pie chart or bar graph. You can embed images or SVGs here. -->
                <h2> Total Profit Breakdown </h2>
                <canvas id="pieChart"></canvas>
                <script>
                    const ctx = document.getElementById('pieChart').getContext('2d');
                    const myPieChart = new Chart(ctx, {
                        type: 'pie',
                        data: {
                            labels: ['Total Paid', 'Total Pending'],
                            datasets: [{
                                data: [${totalPaidBalance}, ${totalOnHoldBalance - totalPaidBalance}],
                                backgroundColor: ['#FF9999', '#66B2FF'],
                            }]
                        },
                        options: {
                            responsive: false,
                            maintainAspectRatio: true,
                        }
                    });
                </script>

            </body>
        </html>
    `;

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(htmlContent, {waitUntil: 'networkidle0'});  // Ensure scripts are executed
        const pdfBuffer = await page.pdf({format: 'A4'});

        await browser.close();

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': pdfBuffer.length,
        });
        res.status(200).send(pdfBuffer);
    } catch (error) {
        res.status(500).json({message: "Error fetching top ten transactions: ", error: error.message});
    }
}

exports.createTransaction = async(req, res) => {
    const transactionData = req.body;
    try {
        const createdTransaction = await Transaction.create(transactionData);
        res.json(createdTransaction);
    } catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).json({ error: "Error creating transaction" });
    }
}

exports.getUserTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            where: { buyerId: req.params.id },
            order: [['createdAt', 'DESC']], // Sort by createdAt in descending order
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching transaction: ", error: error.message });
    }
}



