import React, { useState, useEffect } from "react";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";

import { Line } from 'react-chartjs-2';
import API from "../services/API";

const LineGraphCommissionFeeBreakdown = () => {
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

    const filterDataForCurrentMonth = (tokenData) => {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();

        // Create a date representing the start of the current month
        const startDate = new Date(currentYear, currentMonth, 1);

        console.log("start date " + startDate);

        // Create a date representing the start of the next month
        const nextMonth = currentMonth + 1;
        const endDate = new Date(currentYear, nextMonth, 1);

        const filteredTokenData = tokenData.filter((item) => {
            const itemDate = new Date(item.createdAt);
            console.log(itemDate);
            return itemDate >= startDate && itemDate < endDate;
        });

        return filteredTokenData;
    };


    const groupUsersByCreatedAtMonth = (users) => {
        const groupedUsers = {};
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();

        for (const user of users) {
            const userCreatedAt = new Date(user.createdAt);

            // Check if the user's createdAt date is in the current month and year
            if (
                userCreatedAt.getFullYear() === currentYear &&
                userCreatedAt.getMonth() === currentMonth
            ) {
                // Get the day of the month (e.g., 1 for the 1st day of the month)
                const dayOfMonth = userCreatedAt.getDate();

                // Initialize the day as a key in the groupedUsers object
                if (!groupedUsers[dayOfMonth]) {
                    groupedUsers[dayOfMonth] = 0;
                }

                // Update the value for the day with the desired user data (e.g., user.onHoldBalance or user.paymentAmount)
                groupedUsers[dayOfMonth] += user.onHoldBalance === 0 ? user.paymentAmount : user.onHoldBalance;
            }
        }

        return groupedUsers;
    };

    useEffect(() => {

        const fetchData = async () => {
            const response = await API.get('http://localhost:3000/user/transactions/getTransactions/admin');
            const tokens = response.data.filter((item) => item.transactionType == "COMMISSION_FEE").filter((item) => item.quantity == 10 || item.quantity == 20 || item.quantity == 50);

            let filteredData = "";

            filteredData = filterDataForCurrentMonth(tokens);

            const groupedUsers = groupUsersByCreatedAtMonth(filteredData);
            
            const jsonArray = Object.entries(groupedUsers).map(([key, value]) => {
                return { name: key, count: value };
            });

            const dataSortedByMonth = jsonArray.sort((a, b) => monthOrder[a.name] - monthOrder[b.name]);

            const difference = dataSortedByMonth[dataSortedByMonth.length - 1].count - dataSortedByMonth[0].count;
            const overall = Math.round(difference / dataSortedByMonth[0].count * 100) / 100;

            setOverall(overall);

            const data = {
                labels: dataSortedByMonth.map((data) => data.name),
                datasets: [
                    {
                        data: dataSortedByMonth.map((data) => data.count),
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
                            Commission Fee as of {new Date().toDateString()}
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
                    {/* <section className="col-lg-4 connectedSortable">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title" style={{ textAlign: "center" }}>
                            Current Month Gain/Loss
                        </h3>
                    </div>
                    <div className="card-body">
                        <p style={{ fontSize: "24px", fontWeight: "bold" }}>
                            {currentMonthTotal !== null ? `$${currentMonthTotal.toFixed(2)}` : "N/A"}
                        </p>
                    </div>
                </div>
            </section> */}
                </div>
            </section>
        </div>
    );
};

export default LineGraphCommissionFeeBreakdown;