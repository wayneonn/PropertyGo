import React, { useState, useEffect } from "react";

import { Line } from 'react-chartjs-2';

const LineGraphToken = () => {
    const tokenData = [
        {
            transactionItem: "Token Purchase",
            paymentAmount: 10,
            createdAt: "2023-11-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 20,
            createdAt: "2023-10-28 07:10:45",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 50,
            createdAt: "2023-09-18 00:22:15",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 20,
            createdAt: "2023-08-18 00:22:15",
            status: "PENDING"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 10,
            createdAt: "2023-07-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 20,
            createdAt: "2023-06-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 50,
            createdAt: "2023-05-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 20,
            createdAt: "2023-04-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 10,
            createdAt: "2023-03-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 20,
            createdAt: "2023-02-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 50,
            createdAt: "2023-01-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 20,
            createdAt: "2023-02-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 10,
            createdAt: "2023-03-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 20,
            createdAt: "2023-04-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 50,
            createdAt: "2023-05-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 20,
            createdAt: "2023-06-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 10,
            createdAt: "2023-07-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 20,
            createdAt: "2023-08-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 50,
            createdAt: "2023-09-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 20,
            createdAt: "2023-10-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 10,
            createdAt: "2023-11-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 20,
            createdAt: "2023-10-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 50,
            createdAt: "2023-09-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 20,
            createdAt: "2023-08-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 10,
            createdAt: "2023-07-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 20,
            createdAt: "2023-06-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 50,
            createdAt: "2023-05-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 10,
            createdAt: "2023-11-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 10,
            createdAt: "2023-10-28 07:10:45",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 10,
            createdAt: "2023-09-18 00:22:15",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 10,
            createdAt: "2023-08-18 00:22:15",
            status: "PENDING"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 10,
            createdAt: "2023-07-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 10,
            createdAt: "2023-06-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 10,
            createdAt: "2023-05-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 10,
            createdAt: "2023-04-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 10,
            createdAt: "2023-03-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 10,
            createdAt: "2023-02-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 10,
            createdAt: "2023-01-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 10,
            createdAt: "2023-02-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 10,
            createdAt: "2023-03-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 10,
            createdAt: "2023-04-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 10,
            createdAt: "2023-05-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 10,
            createdAt: "2023-06-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 10,
            createdAt: "2023-07-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 10,
            createdAt: "2023-08-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 10,
            createdAt: "2023-09-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 10,
            createdAt: "2023-10-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 10,
            createdAt: "2023-11-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 10,
            createdAt: "2023-10-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 10,
            createdAt: "2023-09-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 10,
            createdAt: "2023-08-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 10,
            createdAt: "2023-07-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 10,
            createdAt: "2023-06-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 10,
            createdAt: "2023-05-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 20,
            createdAt: "2023-11-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 20,
            createdAt: "2023-10-28 07:10:45",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 20,
            createdAt: "2023-09-18 00:22:15",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 20,
            createdAt: "2023-08-18 00:22:15",
            status: "PENDING"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 20,
            createdAt: "2023-07-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 20,
            createdAt: "2023-06-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 20,
            createdAt: "2023-05-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 20,
            createdAt: "2023-04-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 20,
            createdAt: "2023-03-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 20,
            createdAt: "2023-02-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 20,
            createdAt: "2023-01-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 20,
            createdAt: "2023-02-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 20,
            createdAt: "2023-03-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 20,
            createdAt: "2023-04-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 20,
            createdAt: "2023-05-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 20,
            createdAt: "2023-06-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 20,
            createdAt: "2023-07-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 20,
            createdAt: "2023-08-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 20,
            createdAt: "2023-09-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 20,
            createdAt: "2023-10-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 20,
            createdAt: "2023-11-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 20,
            createdAt: "2023-10-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 20,
            createdAt: "2023-09-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 20,
            createdAt: "2023-08-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 20,
            createdAt: "2023-07-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 20,
            createdAt: "2023-06-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 20,
            createdAt: "2023-05-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 50,
            createdAt: "2023-11-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 50,
            createdAt: "2023-10-28 07:10:45",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 50,
            createdAt: "2023-09-18 00:22:15",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 50,
            createdAt: "2023-08-18 00:22:15",
            status: "PENDING"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 50,
            createdAt: "2023-07-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 50,
            createdAt: "2023-06-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 50,
            createdAt: "2023-05-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 50,
            createdAt: "2023-04-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 50,
            createdAt: "2023-03-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 50,
            createdAt: "2023-02-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 50,
            createdAt: "2023-01-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 50,
            createdAt: "2023-02-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 50,
            createdAt: "2023-03-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 50,
            createdAt: "2023-04-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 50,
            createdAt: "2023-05-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 50,
            createdAt: "2023-06-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 50,
            createdAt: "2023-07-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 50,
            createdAt: "2023-08-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 50,
            createdAt: "2023-09-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 50,
            createdAt: "2023-10-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 50,
            createdAt: "2023-11-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 50,
            createdAt: "2023-10-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 50,
            createdAt: "2023-09-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 50,
            createdAt: "2023-08-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 50,
            createdAt: "2023-07-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 50,
            createdAt: "2023-06-10 14:01:38",
            status: "PAID"
        },
        {
            transactionItem: "Token Purchase",
            paymentAmount: 50,
            createdAt: "2023-05-10 14:01:38",
            status: "PAID"
        },
    ];

    const [selectedTimePeriod, setSelectedTimePeriod] = useState(3);
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

    const handleSelectChange = (event) => {
        setSelectedTimePeriod(parseInt(event.target.value, 10));
    };

    const filterDataForLastXMonths = (month, tokenNumber) => {
        const today = new Date();

        const lastXMonths = new Date(today);
        lastXMonths.setMonth(today.getMonth());

        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(today.getMonth() - month);

        const filteredTokenData = tokenData.filter((item) => item.status === "PAID").filter((item) => {
            return new Date(item.createdAt) >= threeMonthsAgo && new Date(item.createdAt) <= lastXMonths;
        }).filter((item) => item.paymentAmount == tokenNumber);

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

            groupedUsers[monthName]++;
        }

        return groupedUsers;
    };

    useEffect(() => {

        let filteredData = "";


        filteredData = filterDataForLastXMonths(selectedTimePeriod, 20);

        const groupedUsers = groupUsersByCreatedAtMonth(filteredData);

        const jsonArray = Object.entries(groupedUsers).map(([key, value]) => {
            return { name: key, count: value };
        });

        const dataSortedByMonth = jsonArray.sort((a, b) => monthOrder[a.name] - monthOrder[b.name]);

        // Create the dataset for the chart
        const data = {
            labels: dataSortedByMonth.map((data) => data.name),
            datasets: [
                {
                    data: dataSortedByMonth.map((data) => data.count), // Number of users for the last 3 months
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },
            ],
        };

        // Render the chart
        setChartData(data);

    }, [selectedTimePeriod]);

    return (
        <div style={{ width: "66%", marginLeft: "1.5em" }}>
            <section className="col-lg-14 connectedSortable">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title" style={{ textAlign: "center" }}>
                            <i className="fas fa-bar-chart mr-1" />
                            Tokens
                        </h3>
                    </div>
                    <div className="card-body">
                        <div className="tab-content p-0">
                            <div style={{ textAlign: "right", marginRight: "0" }}>
                                <label htmlFor="timePeriodSelect" style={{ marginRight: "1em" }}>Select Time Period:</label>
                                <select
                                    id="timePeriodSelect"
                                    onChange={handleSelectChange}
                                    value={selectedTimePeriod}
                                >
                                    <option value={3}>Last 3 Months</option>
                                    <option value={6}>Last 6 Months</option>
                                    <option value={12}>All-year</option>
                                </select>
                            </div>
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

export default LineGraphToken;