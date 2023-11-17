import React, { useState, useEffect } from "react";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";

import { Line } from 'react-chartjs-2';
import API from "../services/API";

const LineGraphCumulativeCommissionFee = () => {
    const [chartData, setChartData] = useState({});
    const [overall, setOverall] = useState(null);

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

    const filterDataForLastXMonths = (month, tokenData) => {
        const today = new Date();

        const lastXMonths = new Date(today);
        lastXMonths.setMonth(today.getMonth());

        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(today.getMonth() - month);

        const filteredTokenData = tokenData.filter((item) => {
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

        const fetchData = async () => {

            const response = await API.get('http://localhost:3000/user/transactions/getTransactions/admin');
            const tokens = response.data.filter((item) => item.transactionType == "COMMISSION_FEE").filter((item) => item.quantity == 10 || item.quantity == 20 || item.quantity == 50);

            let filteredData = "";

            filteredData = filterDataForLastXMonths(12, tokens);

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

            const difference = dataSortedByMonthWithCumulativeSum[dataSortedByMonthWithCumulativeSum.length - 1].count - dataSortedByMonthWithCumulativeSum[0].count;
            const overall = Math.round(difference / dataSortedByMonthWithCumulativeSum[0].count * 100) / 100;

            setOverall(overall);

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
        };

        fetchData();

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
                            <div style={{ textAlign: "right", marginRight: "0" }}>
                                <h5 htmlFor="timePeriodSelect" style={{ marginRight: "1em", color: `${overall > 0 ? `green` : `red`}` }}>
                                    {chartData.length === 0 ? "" : (
                                        <span style={{ backgroundColor: "lightgray", padding: "0 5px" }}>
                                            Overall {overall > 0 ? <AiOutlineArrowUp /> : <AiOutlineArrowDown />}{Math.abs(overall)}%
                                        </span>
                                    )}
                                </h5>
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

export default LineGraphCumulativeCommissionFee;