const { Transaction, User, Property, Request, Notification } = require("../../models")
const { loggedInUsers } = require('../../shared');
const { Op, Sequelize } = require('sequelize');
const puppeteer = require('puppeteer');
const path = require('path');
// const imagePath = path.join(__dirname, '../../assets/PropertyGo-HighRes-Logo.png');

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
            where: { userId: req.params.id }, attributes: ['requestId']
        })

        // Extract propertyId values from the properties objects
        const propertyIds = properties.map(property => property.propertyListingId);
        const requestIds = request.map(request => request.requestId)

        const transactions = await Transaction.findAll({
            where: { propertyId: propertyIds },
        });
        res.json({ transactions });

    } catch (error) {
        res
            .status(500)
            .json({ message: "Error fetching transaction: ", error: error.message });
    }
}


exports.getTransactionByTransactionId = async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            where: { transactionId: req.params.id },
        });
        res.json({ transactions });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Error fetching transaction: ", error: error.message });
    }
}

exports.getTransactionByRequestId = async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            where: { requestId: req.params.id },
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
        res.status(200).json({ transactions: transactions });
    } catch (error) {
        res.status(500).json({ message: "Error fetching top ten transactions: ", error: error.message });
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
        res.status(200).json({ transactions: transactionData });
    } catch (error) {
        res.status(500).json({ message: "Error fetching six monthly transaction value: ", error: error.message });
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
        res.status(200).json({ transactions: transactionData });
    } catch (error) {
        res.status(500).json({ message: "Error fetching monthly transaction value by ID: ", error: error.message });
    }
}

exports.getTopTenTransactionsWithUsers = async (req, res) => {
    try {

        // Nah, all this doesn't make sense now again.
        // Cause we now added back buyerId and userId.

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

        res.status(200).json({ mergedData: mergedData });
    } catch (error) {
        res.status(500).json({ message: "Error fetching top ten transactions: ", error: error.message });
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

        res.status(200).json({ mergedData: mergedData });
    } catch (error) {
        res.status(500).json({ message: "Error fetching top ten transactions: ", error: error.message });
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

        res.status(200).json({ mergedData: mergedData });
    } catch (error) {
        res.status(500).json({ message: "Error fetching top ten transactions: ", error: error.message });
    }
}

exports.getUserCountsByCountry = async (req, res) => {
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



        res.status(200).json({ buyer: buyerCounts });
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

        const imagePath = 'https://i.ibb.co/XxHFhhX/Property-Go-High-Res-Logo.png';

        // Total Number of Transactions by Seller:
        const totalTransactions = await Transaction.count({
            where: { propertyId: propertyIds }
        });

        // Transaction Status Breakdown:
        //         const statusBreakdown = await Transaction.findAndCountAll({
        //             where: {sellerId: req.params.id},
        //             group: ['status'],
        //         });

        // Total On Hold Balance:
        const totalOnHoldBalance = await Transaction.sum('onHoldBalance', {
            where: { propertyId: propertyIds }
        });


        // Total On Hold Balance:
        const totalPaidBalance = await Transaction.sum('onHoldBalance', {
            where: { propertyId: propertyIds, status: "PAID" }
        });

        // Number of Properties Sold:
        const propertiesSold = await Transaction.count({
            where: { propertyId: propertyIds },
            distinct: true,
            col: 'propertyId'
        });

        // Number of Invoices:
        const totalInvoices = await Transaction.count({
            where: { propertyId: propertyIds },
            distinct: true,

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

                    .company-logo img {
                        max-height: 100px; /* Set maximum height for the logo image */
                        max-width: 100px; /* Set maximum width for the logo image */
                    }
                </style>
            </head>
            <body>
            <div class="company-logo">
                    <img src="${imagePath}" alt="Company Logo">
                </div>

                
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

        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });  // Ensure scripts are executed
        const pdfBuffer = await page.pdf({ format: 'A4' });

        await browser.close();

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': pdfBuffer.length,
        });
        res.status(200).send(pdfBuffer);
    } catch (error) {
        res.status(500).json({ message: "Error fetching top ten transactions: ", error: error.message });
    }
}

exports.createTransaction = async (req, res) => {
    const transactionData = req.body;
    try {
        const createdTransaction = await Transaction.create(transactionData);
        res.json(createdTransaction);
    } catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).json({ error: "Error creating transaction" });
    }
}

exports.createOptionFeeTransaction = async (req, res) => {
    const transactionData = req.body;
    try {
        const createdTransaction = await Transaction.create(transactionData);

        const property = await Property.findByPk(createdTransaction.propertyId);
        // const propertyUser = await property.getUser();

        const seller = await User.findByPk(property.sellerId);
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        const buyer = await User.findByPk(createdTransaction.buyerId);
        if (!buyer) {
            return res.status(404).json({ message: 'Buyer not found' });
        }

        const content = `${buyer.userName.charAt(0).toUpperCase() + buyer.userName.slice(1)} has made a request for the OTP Document on your property ${property.title}. Please upload the Option to Purchase (OTP) to proceed with the transaction.`;

        const notificationBody = {
            "isRecent": true,
            "isPending": false,
            "isCompleted": false,
            "hasRead": false,
            "userNotificationId": createdTransaction.buyerId,
            "userId" : seller.userId,
            "content" : content,
            "transactionId" : createdTransaction.transactionId,
        };

        await Notification.create(notificationBody);

        // const transactionUser = await transaction.getSeller();

        if (seller && loggedInUsers.has(seller.userId)){
            // console.log("propertyUser :", propertyUser)
            req.io.emit("userNotification", {"pushToken": seller.pushToken, "title": property.title, "body": content});
            console.log("Emitted userNewForumCommentNotification");
        }

        res.json(createdTransaction);
    } catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).json({ error: "Error creating transaction" });
    }
}

exports.sellerUploadedOTP = async (req, res) => {
    const transactionData = req.body;
    const { transactionId } = req.params; // Assuming you pass transactionId as a parameter
    try {
        const transaction = await Transaction.findByPk(transactionId);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Update the transaction with optionFeeStatusEnum "SELLER_UPLOADED"
        transaction.optionFeeStatusEnum = "SELLER_UPLOADED";
        transaction.optionToPurchaseDocumentId = transactionData.optionToPurchaseDocumentId;
        await transaction.save();

        const property = await Property.findByPk(transaction.propertyId);
        const seller = await User.findByPk(property.sellerId);
        const buyer = await User.findByPk(transaction.buyerId);
        const buyerId = buyer.userId;
        const sellerId = seller.userId;

        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        if (!buyer) {
            return res.status(404).json({ message: 'Buyer not found' });
        }

        const content = `${seller.userName.charAt(0).toUpperCase() + seller.userName.slice(1)} has uploaded the OTP Document for the property ${property.title}. Please upload the Option to Purchase (OTP) to complete the transaction.`;

        const notificationBody = {
            "isRecent": true,
            "isPending": false,
            "isCompleted": false,
            "hasRead": false,
            "userNotificationId": sellerId,
            "userId" : buyerId,
            "content" : content,
            "transactionId" : transaction.transactionId,
        };

        await Notification.create(notificationBody);

        if (buyer && loggedInUsers.has(buyer.userId)){
            req.io.emit("userNotification", {"pushToken": buyer.pushToken, "title": property.title, "body": content});
            console.log("Emitted sellerUploadedOTP Notification");
        }

        res.json(transaction);
    } catch (error) {
        console.error("Error updating transaction:", error);
        res.status(500).json({ error: "Error updating transaction" });
    }
}

exports.sellerCancelledOTP = async (req, res) => {
    const transactionData = req.body;
    const { transactionId } = req.params; // Assuming you pass transactionId as a parameter
    try {
        const transaction = await Transaction.findByPk(transactionId);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Update the transaction with optionFeeStatusEnum "SELLER_UPLOADED"
        transaction.optionFeeStatusEnum = "SELLER_CANCELLED";
        transaction.optionToPurchaseDocumentId = transactionData.optionToPurchaseDocumentId;
        await transaction.save();

        const property = await Property.findByPk(transaction.propertyId);
        const seller = await User.findByPk(property.sellerId);
        const buyer = await User.findByPk(transaction.buyerId);
        const buyerId = buyer.userId;
        const sellerId = seller.userId;

        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        if (!buyer) {
            return res.status(404).json({ message: 'Buyer not found' });
        }

        const content = `${seller.userName.charAt(0).toUpperCase() + seller.userName.slice(1)} has decided to not proceed with the OTP Transaction for the property ${property.title}.`;

        const notificationBody = {
            "isRecent": true,
            "isPending": false,
            "isCompleted": false,
            "hasRead": false,
            "userNotificationId": sellerId,
            "userId" : buyerId,
            "content" : content,
            "transactionId" : transaction.transactionId,
        };

        await Notification.create(notificationBody);

        if (buyer && loggedInUsers.has(buyer.userId)){
            req.io.emit("userNotification", {"pushToken": buyer.pushToken, "title": property.title, "body": content});
            console.log("Emitted sellerCancelledOTP Notification");
        }

        res.json(transaction);
    } catch (error) {
        console.error("Error updating transaction:", error);
        res.status(500).json({ error: "Error updating transaction" });
    }
}

exports.buyerUploadedOTP = async (req, res) => {
    const transactionData = req.body;
    const { transactionId } = req.params; // Assuming you pass transactionId as a parameter
    try {
        const transaction = await Transaction.findByPk(transactionId);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Update the transaction with optionFeeStatusEnum "SELLER_UPLOADED"
        transaction.optionFeeStatusEnum = "BUYER_UPLOADED";
        transaction.optionToPurchaseDocumentId = transactionData.optionToPurchaseDocumentId;
        await transaction.save();

        const property = await Property.findByPk(transaction.propertyId);
        const seller = await User.findByPk(property.sellerId);
        const buyer = await User.findByPk(transaction.buyerId);
        const buyerId = buyer.userId;
        const sellerId = seller.userId;

        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        if (!buyer) {
            return res.status(404).json({ message: 'Buyer not found' });
        }

        const content = `${buyer.userName.charAt(0).toUpperCase() + buyer.userName.slice(1)} has uploaded the OTP Document for the property ${property.title} and has payment for the Option Fee. Please await admin to sign the OTP to complete the transaction.`;

        const notificationBody = {
            "isRecent": true,
            "isPending": false,
            "isCompleted": false,
            "hasRead": false,
            "userNotificationId": buyerId,
            "userId" : sellerId,
            "content" : content,
            "transactionId" : transaction.transactionId,
        };

        await Notification.create(notificationBody);

        if (seller && loggedInUsers.has(seller.userId)){
            req.io.emit("userNotification", {"pushToken": seller.pushToken, "title": property.title, "body": content});
            console.log("Emitted buyerUploadedOTP Notification");
        }

        res.json(transaction);
    } catch (error) {
        console.error("Error updating transaction:", error);
        res.status(500).json({ error: "Error updating transaction" });
    }
}

exports.buyerRequestReupload = async (req, res) => {
    const transactionData = req.body;
    const { transactionId } = req.params; // Assuming you pass transactionId as a parameter
    try {
        const transaction = await Transaction.findByPk(transactionId);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Update the transaction with optionFeeStatusEnum "SELLER_UPLOADED"
        transaction.optionFeeStatusEnum = "BUYER_REQUEST_REUPLOAD";
        transaction.optionToPurchaseDocumentId = transactionData.optionToPurchaseDocumentId;
        await transaction.save();

        const property = await Property.findByPk(transaction.propertyId);
        const seller = await User.findByPk(property.sellerId);
        const buyer = await User.findByPk(transaction.buyerId);
        const buyerId = buyer.userId;
        const sellerId = seller.userId;

        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        if (!buyer) {
            return res.status(404).json({ message: 'Buyer not found' });
        }

        const content = `${buyer.userName.charAt(0).toUpperCase() + buyer.userName.slice(1)} has requested for you to reupload the OTP Document for the property ${property.title}. Please upload the OTP to proceed with the transaction.`;

        const notificationBody = {
            "isRecent": true,
            "isPending": false,
            "isCompleted": false,
            "hasRead": false,
            "userNotificationId": buyerId,
            "userId" : sellerId,
            "content" : content,
            "transactionId" : transaction.transactionId,
        };

        await Notification.create(notificationBody);

        if (seller && loggedInUsers.has(seller.userId)){
            req.io.emit("userNotification", {"pushToken": seller.pushToken, "title": property.title, "body": content});
            console.log("Emitted sellerUploadedOTP Notification");
        }

        res.json(transaction);
    } catch (error) {
        console.error("Error updating transaction:", error);
        res.status(500).json({ error: "Error updating transaction" });
    }
}

exports.buyerCancelOTP = async (req, res) => {
    const transactionData = req.body;
    const { transactionId } = req.params; // Assuming you pass transactionId as a parameter
    try {
        const transaction = await Transaction.findByPk(transactionId);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Update the transaction with optionFeeStatusEnum "SELLER_UPLOADED"
        transaction.optionFeeStatusEnum = "BUYER_CANCELLED";
        transaction.optionToPurchaseDocumentId = transactionData.optionToPurchaseDocumentId;
        await transaction.save();

        const property = await Property.findByPk(transaction.propertyId);
        const seller = await User.findByPk(property.sellerId);
        const buyer = await User.findByPk(transaction.buyerId);
        const buyerId = buyer.userId;
        const sellerId = seller.userId;

        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        if (!buyer) {
            return res.status(404).json({ message: 'Buyer not found' });
        }

        const content = `${buyer.userName.charAt(0).toUpperCase() + buyer.userName.slice(1)} has cancelled the request for the OTP Document for the property ${property.title}.`;

        const notificationBody = {
            "isRecent": true,
            "isPending": false,
            "isCompleted": false,
            "hasRead": false,
            "userNotificationId": buyerId,
            "userId" : sellerId,
            "content" : content,
            "transactionId" : transaction.transactionId,
        };

        await Notification.create(notificationBody);

        if (seller && loggedInUsers.has(seller.userId)){
            req.io.emit("userNotification", {"pushToken": seller.pushToken, "title": property.title, "body": content});
            console.log("Emitted sellerUploadedOTP Notification");
        }

        res.json(transaction);
    } catch (error) {
        console.error("Error updating transaction:", error);
        res.status(500).json({ error: "Error updating transaction" });
    }
}

exports.buyerPaidOptionExerciseFee = async (req, res) => {
    const transactionData = req.body;
    const { transactionId } = req.params; // Assuming you pass transactionId as a parameter
    try {
        const transaction = await Transaction.findByPk(transactionId);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Update the transaction with optionFeeStatusEnum "SELLER_UPLOADED"
        transaction.optionFeeStatusEnum = "PAID_OPTION_EXERCISE_FEE";
        transaction.optionToPurchaseDocumentId = transactionData.optionToPurchaseDocumentId;
        await transaction.save();

        const property = await Property.findByPk(transaction.propertyId);
        const seller = await User.findByPk(property.sellerId);
        const buyer = await User.findByPk(transaction.buyerId);
        const buyerId = buyer.userId;
        const sellerId = seller.userId;

        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        if (!buyer) {
            return res.status(404).json({ message: 'Buyer not found' });
        }

        const content = `${buyer.userName.charAt(0).toUpperCase() + buyer.userName.slice(1)} has paid the Option Exercise Fee for the property ${property.title}. Please Procceed to pay the Commission Fee to support our platform!`;

        const notificationBody = {
            "isRecent": true,
            "isPending": false,
            "isCompleted": false,
            "hasRead": false,
            "userNotificationId": buyerId,
            "userId" : sellerId,
            "content" : content,
            "transactionId" : transaction.transactionId,
        };

        await Notification.create(notificationBody);

        if (seller && loggedInUsers.has(seller.userId)){
            req.io.emit("userNotification", {"pushToken": seller.pushToken, "title": property.title, "body": content});
            console.log("Emitted buyerPaidOptionExerciseFee Notification");
        }

        res.json(transaction);
    } catch (error) {
        console.error("Error updating transaction:", error);
        res.status(500).json({ error: "Error updating transaction" });
    }
}

exports.getUserTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            where: { 
                [Op.or]: [
                    { userId: req.params.id },
                    { buyerId: req.params.id }
                ]
            },
            order: [['createdAt', 'DESC']], // Sort by createdAt in descending order
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching transaction: ", error: error.message });
    }
}

exports.getTransactionInvoicePdf = async (req, res) => {
    try {
        const transactionId = req.params.id;
        const transaction = await Transaction.findByPk(transactionId);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        const user = await User.findByPk(transaction.buyerId);

        const invoiceNumber = transaction.transactionId;
        const invoiceDate = transaction.createdAt;
        const gst = transaction.gst; // Boolean, to charge 8% GST
        const itemDescription = transaction.transactionItem;
        const quantity = transaction.quantity;
        const subtotal = transaction.paymentAmount;
        const onHoldBalance = transaction.onHoldBalance;
        const total = subtotal + (gst ? subtotal * 0.08 : 0);
        const status = transaction.status; // PENDING, PAID
        const name = user.name;
        const email = user.email;
        const imagePath = 'https://i.ibb.co/XxHFhhX/Property-Go-High-Res-Logo.png';
        console.log("imagePath: ", imagePath);

        const htmlContent = `
        <html>
        <head>
            <title>Invoice</title>
            <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                background-color: #fff;
            }
    
            .invoice-container {
                max-width: 100%;
                margin: 0 auto;
                padding: 20px;
                background-color: #fff;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                border-radius: 5px;
            }
    
            .invoice-header {
                text-align: center;
                margin-bottom: 20px;
                display: flex; /* Add flexbox container for company logo and title */
                justify-content: space-between; /* Align items at both ends */
                align-items: center; /* Vertically center items */
            }
    
            .invoice-header h1 {
                font-size: 24px;
                color: #333;
                margin: 0;
            }
    
            .company-name {
                font-weight: bold;
                font-size: 18px;
                color: #333;
                margin-bottom: 10px; /* Add spacing between company name and "Invoice" */
            }
    
            .company-logo img {
                max-height: 100px; /* Set maximum height for the logo image */
                max-width: 100px; /* Set maximum width for the logo image */
            }
    
            .invoice-details {
                margin-bottom: 20px;
            }
        
                .invoice-details p {
                    font-size: 14px;
                    color: #333; /* Set text color to black */
                    margin: 6px 0;
                }
        
                .invoice-items {
                    width: 100%;
                    border-collapse: collapse;
                }
        
                .invoice-items th,
                .invoice-items td {
                    border: 1px solid #ddd;
                    padding: 10px;
                    text-align: left;
                }
        
                .invoice-items th {
                    background-color: #f2f2f2;
                    color: #555;
                }
        
                .invoice-total {
                    text-align: right;
                    margin-top: 20px;
                }
        
                .invoice-total p {
                    font-size: 14px;
                    font-weight: bold; /* Make Subtotal, GST, and Total text bold */
                    color: #333; /* Set text color to black */
                    margin: 6px 0;
                }
        
                .footer {
                    text-align: center;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="invoice-container">
            <div class="invoice-header">
            <div class="company-logo">
                <img src="${imagePath}" alt="Company Logo">
            </div>
            <div>
                <h1>Invoice</h1>
                <div class="company-name">PropertyGo Pte. Ltd.</div>
            </div>
        </div>
                <div class="invoice-details">
                    <p>Invoice Number: ${invoiceNumber}</p>
                    <p>Invoice Date: ${new Date(invoiceDate).toLocaleString('en-SG', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}</p>
                    <p>Customer Name: ${name}</p>
                    <p>Customer Email: ${email}</p>
                </div>
                <table class="invoice-items">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${itemDescription}</td>
                            <td>${quantity}</td>
                            <td>$${subtotal.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="invoice-total">
                    <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
                    <p><strong>${gst ? 'GST (8%):' : 'GST (8%):'}</strong> $${(gst ? subtotal * 0.08 : 0).toFixed(2)}</p>
                    <p><strong>Total:</strong> $${total.toFixed(2)}</p>
                </div>
                <div class="footer">
                    <p>Thank you for your business!</p>
                </div>
            </div>
        </body>
        </html>
        `;

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        await page.setContent(htmlContent, { waitUntil: 'load' }); // Wait for load
        const pdfBuffer = await page.pdf({ format: 'A4' });

        await browser.close();

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': pdfBuffer.length,
        });
        res.status(200).send(pdfBuffer);
    } catch (error) {
        res.status(500).json({ message: "Error creating invoice: ", error: error.message });
    }
}

exports.updateTransaction = async (req, res) => {
    const transactionId = req.params.id;
    const updatedTransactionData = req.body;

    try {
        const transaction = await Transaction.findByPk(transactionId);

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        await transaction.update(updatedTransactionData);

        res.json(transaction);
    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).json({ error: 'Error updating transaction' });
    }
}


