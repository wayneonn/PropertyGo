import React, { useState, useEffect } from "react";

import { Line } from 'react-chartjs-2';

const LineGraphCumulativeCommissionFee = () => {
    const tokenData = [
        {
            transactionId: 1,
            onHoldBalance: 0,
            buyerId: 1, // buyer
            propertyId: 3,
            transactionItem: "Commission Fee",
            quantity: 10,
            gst: true,
            // sellerId: 2,
            // invoiceId: 1,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 10,
            createdAt: "2023-11-10 14:01:38"
        },
        {
            transactionId: 2,
            onHoldBalance: 0,
            buyerId: 1, // buyer
            propertyId: 2,
            transactionItem: "Token Purchase",
            quantity: 20,
            gst: true,
            // sellerId: 2,
            // invoiceId: 2,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 20,
            createdAt: "2023-10-10 14:01:38"
        },
        {
            transactionId: 3,
            onHoldBalance: 0,
            buyerId: 1, // buyer
            propertyId: 1,
            transactionItem: "Token Purchase",
            quantity: 20,
            gst: true,
            // sellerId: 2,
            // invoiceId: 3,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 20,
            createdAt: "2023-09-10 14:01:38"
        },
        {
            transactionId: 4,
            onHoldBalance: 0,
            buyerId: 1, // buyer
            propertyId: 4,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: true,
            // sellerId: 2,
            // invoiceId: 4,
            status: "PENDING",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 50,
            createdAt: "2023-08-10 14:01:38"
        },
        {
            transactionId: 5,
            onHoldBalance: 0,
            buyerId: 1, // buyer
            propertyId: 5,
            transactionItem: "Token Purchase",
            quantity: 10,
            gst: true,
            // sellerId: 2,
            // invoiceId: 5,
            status: "PAID",
            transactionType: "TOKEN_PURCHASE",
            paymentAmount: 10,
        },
        {
            transactionId: 6,
            onHoldBalance: 0,
            buyerId: 1, // buyer
            propertyId: 6,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: true,
            // sellerId: 2,
            // invoiceId: 6,
            status: "PAID",
            transactionType: "TOKEN_PURCHASE",
            paymentAmount: 50,
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 10,
            transactionItem: "Option Fee",
            quantity: 1,
            gst: false,
            // sellerId: 2,
            // invoiceId: 2,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 1000,
            createdAt: "2023-07-10 14:01:38"
        },
        {
            onHoldBalance: 1000,
            buyerId: 1,
            propertyId: 11,
            transactionItem: "Option Fee",
            quantity: 1,
            gst: false,
            // sellerId: 2,
            // invoiceId: 2,
            status: "PENDING",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 0,
            createdAt: "2023-06-10 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 1,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: true,
            // sellerId: 2,
            // invoiceId: 1,
            status: "PAID",
            transactionType: "TOKEN_PURCHASE",
            paymentAmount: 50,
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 2,
            transactionItem: "Token Purchase",
            quantity: 10,
            gst: false,
            // sellerId: 2,
            // invoiceId: 2,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 10,
            createdAt: "2023-05-10 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 3,
            transactionItem: "Option Fee",
            quantity: 1,
            gst: false,
            // sellerId: 2,
            // invoiceId: 3,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 1000,
            createdAt: "2023-04-10 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 4,
            // sellerId: 2,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: false,
            // invoiceId: 4,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 50,
            createdAt: "2023-03-10 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 5,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: true,
            // sellerId: 2,
            // invoiceId: 5,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 50,
            createdAt: "2023-02-10 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 6,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: true,
            // sellerId: 2,
            // invoiceId: 6,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 50,
            createdAt: "2023-01-10 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 7,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: true,
            // sellerId: 2,
            // invoiceId: 6,
            status: "PAID",
            transactionType: "TOKEN_PURCHASE",
            paymentAmount: 50,
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 8,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: true,
            // sellerId: 2,
            // invoiceId: 6,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 50,
            createdAt: "2023-02-10 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 9,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: true,
            // sellerId: 2,
            invoiceId: 3,
            status: "PAID",
            transactionType: "TOKEN_PURCHASE",
            paymentAmount: 50,
        },
        {
            onHoldBalance: 100,
            buyerId: 1,
            propertyId: 10,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: false,
            // sellerId: 2,
            // invoiceId: 2,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 0,
            createdAt: "2023-03-10 14:01:38"
        },
        {
            onHoldBalance: 1000,
            buyerId: 3,
            propertyId: 10,
            transactionItem: "Option Fee",
            quantity: 1,
            gst: false,
            // sellerId: 2,
            // invoiceId: 2,
            status: "PENDING",
            transactionType: "OPTION_FEE",
            paymentAmount: 0,
        },
        {
            transactionId: 1,
            onHoldBalance: 0,
            buyerId: 1, // buyer
            propertyId: 3,
            transactionItem: "Token Purchase",
            quantity: 10,
            gst: true,
            // sellerId: 2,
            // invoiceId: 1,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 10,
            createdAt: "2023-04-10 14:01:38"
        },
        {
            transactionId: 2,
            onHoldBalance: 0,
            buyerId: 1, // buyer
            propertyId: 2,
            transactionItem: "Token Purchase",
            quantity: 20,
            gst: true,
            // sellerId: 2,
            // invoiceId: 2,
            status: "PAID",
            transactionType: "TOKEN_PURCHASE",
            paymentAmount: 20,
        },
        {
            transactionId: 3,
            onHoldBalance: 0,
            buyerId: 1, // buyer
            propertyId: 1,
            transactionItem: "Token Purchase",
            quantity: 20,
            gst: true,
            // sellerId: 2,
            // invoiceId: 3,
            status: "PAID",
            transactionType: "TOKEN_PURCHASE",
            paymentAmount: 20,
        },
        {
            transactionId: 4,
            onHoldBalance: 0,
            buyerId: 1, // buyer
            propertyId: 4,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: true,
            // sellerId: 2,
            // invoiceId: 4,
            status: "PENDING",
            transactionType: "TOKEN_PURCHASE",
            paymentAmount: 50,
        },
        {
            transactionId: 5,
            onHoldBalance: 0,
            buyerId: 1, // buyer
            propertyId: 5,
            transactionItem: "Token Purchase",
            quantity: 10,
            gst: true,
            // sellerId: 2,
            // invoiceId: 5,
            status: "PAID",
            transactionType: "TOKEN_PURCHASE",
            paymentAmount: 10,
        },
        {
            transactionId: 6,
            onHoldBalance: 0,
            buyerId: 1, // buyer
            propertyId: 6,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: true,
            // sellerId: 2,
            // invoiceId: 6,
            status: "PAID",
            transactionType: "TOKEN_PURCHASE",
            paymentAmount: 50,
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 10,
            transactionItem: "Option Fee",
            quantity: 1,
            gst: false,
            // sellerId: 2,
            // invoiceId: 2,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 1000,
            createdAt: "2023-05-10 14:01:38"
        },
        {
            onHoldBalance: 1000,
            buyerId: 1,
            propertyId: 11,
            transactionItem: "Option Fee",
            quantity: 1,
            gst: false,
            // sellerId: 2,
            // invoiceId: 2,
            status: "PENDING",
            transactionType: "OPTION_FEE",
            paymentAmount: 0,
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 1,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: true,
            // sellerId: 2,
            // invoiceId: 1,
            status: "PAID",
            transactionType: "TOKEN_PURCHASE",
            paymentAmount: 50,
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 2,
            transactionItem: "Token Purchase",
            quantity: 10,
            gst: false,
            // sellerId: 2,
            // invoiceId: 2,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 10,
            createdAt: "2023-06-10 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 3,
            transactionItem: "Option Fee",
            quantity: 1,
            gst: false,
            // sellerId: 2,
            // invoiceId: 3,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 1000,
            createdAt: "2023-07-10 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 4,
            // sellerId: 2,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: false,
            // invoiceId: 4,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 50,
            createdAt: "2023-08-10 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 5,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: true,
            // sellerId: 2,
            // invoiceId: 5,
            status: "PAID",
            transactionType: "TOKEN_PURCHASE",
            paymentAmount: 50,
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 6,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: true,
            // sellerId: 2,
            // invoiceId: 6,
            status: "PAID",
            transactionType: "TOKEN_PURCHASE",
            paymentAmount: 50,
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 7,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: true,
            // sellerId: 2,
            // invoiceId: 6,
            status: "PAID",
            transactionType: "TOKEN_PURCHASE",
            paymentAmount: 50,
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 8,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: true,
            // sellerId: 2,
            // invoiceId: 6,
            status: "PAID",
            transactionType: "TOKEN_PURCHASE",
            paymentAmount: 50,
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 9,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: true,
            // sellerId: 2,
            invoiceId: 3,
            status: "PAID",
            transactionType: "TOKEN_PURCHASE",
            paymentAmount: 50,
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 10,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: false,
            // sellerId: 2,
            // invoiceId: 2,
            status: "PAID",
            transactionType: "TOKEN_PURCHASE",
            paymentAmount: 50,
        },
        {
            onHoldBalance: 1000,
            buyerId: 3,
            propertyId: 10,
            transactionItem: "Option Fee",
            quantity: 1,
            gst: false,
            // sellerId: 2,
            // invoiceId: 2,
            status: "PENDING",
            transactionType: "OPTION_FEE",
            paymentAmount: 0,
        },
    ];

    const [chartData, setChartData] = useState({});

    const monthOrder = {
        January: 0,
        February: 1,
        March: 2,
        April: 3,
        May: 4,
        June: 5,
        July: 6,
        August: 7,
        September: 8,
        October: 9,
        November: 10,
        December: 11
    };

    const filterDataForLastXMonths = (month) => {
        const today = new Date();

        const lastXMonths = new Date(today);
        lastXMonths.setMonth(today.getMonth());

        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(today.getMonth() - month);

        const filteredTokenData = tokenData.filter((item) => item.transactionType === "COMMISSION_FEE").filter((item) => {
            return new Date(item.createdAt) >= threeMonthsAgo && new Date(item.createdAt) <= lastXMonths;
        });

        return filteredTokenData;
    };

    const groupUsersByCreatedAtMonth = (users) => {
        const groupedUsers = {};
        const monthNames = {
            0: 'January',
            1: 'February',
            2: 'March',
            3: 'April',
            4: 'May',
            5: 'June',
            6: 'July',
            7: 'August',
            8: 'September',
            9: 'October',
            10: 'November',
            11: 'December',
        };

        for (const user of users) {
            const createdAtMonth = new Date(user.createdAt).getMonth();
            const monthName = monthNames[createdAtMonth];

            if (!groupedUsers[monthName]) {
                groupedUsers[monthName] = 0;
            }

            groupedUsers[monthName] += user.onHoldBalance == 0 ? user.paymentAmount : user.onHoldBalance;
        }

        return groupedUsers;
    };

    useEffect(() => {

        let filteredData = "";

        filteredData = filterDataForLastXMonths(12);

        const groupedUsers = groupUsersByCreatedAtMonth(filteredData);

        const jsonArray = Object.entries(groupedUsers).map(([key, value]) => {
            return { name: key, count: value };
        });

        const dataSortedByMonth = jsonArray.sort((a, b) => monthOrder[a.name] - monthOrder[b.name]);

        let prefixSum = 0;
        const dataSortedByMonthWithCumulativeSum = dataSortedByMonth.map((data) => {
            prefixSum += data.count;
            return { name: data.name, count: prefixSum };
        });

        const data = {
            labels: dataSortedByMonthWithCumulativeSum.map((data) => data.name),
            datasets: [
                {
                    data: dataSortedByMonthWithCumulativeSum.map((data) => data.count),
                    borderColor: 'rgb(244, 194, 194)',
                    backgroundColor: 'rgba(244, 194, 194)',
                },
            ],
        };

        // Render the chart
        setChartData(data);

    }, []);

    return (
        <div style={{ width: "96%", marginLeft: "1.5em" }}>
            <section className="col-lg-14 connectedSortable">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title" style={{ textAlign: "center" }}>
                            <i className="fas fa-bar-chart mr-1" />
                            Total Commission Fee
                        </h3>
                    </div>
                    <div className="card-body">
                        <div className="tab-content p-0">
                            {chartData.labels && chartData.labels.length > 0 ? (
                                <div>
                                    <Line
                                        data={chartData}
                                        options={{
                                            plugins: {
                                                legend: {
                                                    display: false
                                                }
                                            },
                                            scales: {
                                                y: {
                                                    ticks: {
                                                        precision: 0
                                                    },
                                                    beginAtZero: true,
                                                    stepSize: 1,
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            ) : (
                                <p>No data to show...</p>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LineGraphCumulativeCommissionFee;