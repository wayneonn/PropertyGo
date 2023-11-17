import React, { useEffect, useRef, useState } from "react";

import { Line, Pie, getElementAtEvent, getElementsAtEvent } from 'react-chartjs-2';
import API from "../services/API";

const PieChartToken = () => {
    const map = { 0: 10, 1: 20, 2: 50 };
    const tokenMain = { "10": 0, "20": 1, "50": 2 };

    const pieChartRef = useRef();
    const [pieChartData, setPieChartData] = useState({});
    const [selectedTimePeriod, setSelectedTimePeriod] = useState(3);
    const [lineChartData, setLineChartData] = useState({});
    const [selectedTokenNumber, setSelectedTokenNumber] = useState(10);
    const backgroundColor = [
        `rgba(255, 99, 132, ${selectedTokenNumber == 10 ? 1.0 : 0.2})`,
        `rgba(54, 162, 235, ${selectedTokenNumber == 20 ? 1.0 : 0.2})`,
        `rgba(255, 206, 86, ${selectedTokenNumber == 50 ? 1.0 : 0.2})`,
    ];
    const borderColor = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
    ];

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

    const getChartData = (tokenData) => {
        const data = { "10": 0, "20": 0, "50": 0 };

        for (let i = 0; i < tokenData.length; i++) {
            data[tokenData[i].quantity]++;
        }

        return data;
    };

    const filterDataForLastXMonths = (month, tokenNumber, tokenData) => {
        const today = new Date();

        const lastXMonths = new Date(today);
        lastXMonths.setMonth(today.getMonth());

        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(today.getMonth() - month);

        const filteredTokenData = tokenData.filter((item) => item.status === "PAID").filter((item) => {
            return new Date(item.createdAt) >= threeMonthsAgo && new Date(item.createdAt) <= lastXMonths;
        }).filter((item) => item.quantity == tokenNumber);;

        console.log("filtered token data " + filteredTokenData.length);

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

    const printElementAtEvent = (element) => {
        if (!element.length) return;

        const { datasetIndex, index } = element[0];

        console.log(map[index]);

        setSelectedTokenNumber(map[index]);
    };

    const printElementsAtEvent = (elements) => {
        if (!elements.length) return;

      };

    const onClick = (event) => {
        const { current: chart } = pieChartRef;

        if (!chart) {
            return;
        }

        printElementAtEvent(getElementAtEvent(chart, event));
        printElementsAtEvent(getElementsAtEvent(chart, event));
    };

    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await API.get('http://localhost:3000/user/transactions/getTransactions/admin');
                const tokens = response.data.filter((item) => item.transactionType == "TOKEN_PURCHASE").filter((item) => item.quantity == 10 || item.quantity == 20 || item.quantity == 50);
                
                const pieChartData = getChartData(tokens);

                console.log(pieChartData);

                const values = Object.values(pieChartData);
        
                const pieData = {
                    labels: ['10', '20', '50'],
                    datasets: [
                        {
                            label: '# of token quantity purchased',
                            data: values,
                            backgroundColor: backgroundColor,
                            borderColor: borderColor,
                            borderWidth: 1,
                        },
                    ],
                };
        
                setPieChartData(pieData);
        
                let filteredData = "";
        
                filteredData = filterDataForLastXMonths(selectedTimePeriod, selectedTokenNumber, tokens);
        
                const groupedUsers = groupUsersByCreatedAtMonth(filteredData);
        
                const jsonArray = Object.entries(groupedUsers).map(([key, value]) => {
                    return { name: key, count: value };
                });
        
                const dataSortedByMonth = jsonArray.sort((a, b) => monthOrder[a.name] - monthOrder[b.name]);
        
                const data = {
                    labels: dataSortedByMonth.map((data) => data.name),
                    datasets: [
                        {
                            data: dataSortedByMonth.map((data) => data.count), 
                            borderColor: borderColor[tokenMain[selectedTokenNumber]],
                            backgroundColor: backgroundColor[tokenMain[selectedTokenNumber]],
                        },
                    ],
                };
        
                setLineChartData(data);
            } catch (error) {  
                console.error(error);
            }
        };

        fetchData();

    }, [selectedTimePeriod, selectedTokenNumber]);

    return (
        <div>
            <div style={{ display: "flex", flexDirection: "row", marginLeft: "1.5em" }}>
                <div>
                    <section className="col-lg-14 connectedSortable">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title" style={{ textAlign: "center" }}>
                                    <i className="fas fa-bar-chart mr-1" />
                                    Number of Token Quantity Purchased 
                                </h3>
                            </div>
                            <div className="card-body">
                                <div className="tab-content p-0">
                                    {pieChartData.labels && pieChartData.labels.length > 0 ? (
                                        <div style={{ width: "100%", height: "100%" }}>
                                            <Pie ref={pieChartRef} data={pieChartData} onClick={onClick} />
                                        </div>
                                    ) : (
                                        <p>No data to show...</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <div style={{ width: "75%", marginLeft: "1.5em", marginRight: "1.5em" }}>
                    <section className="col-lg-14 connectedSortable">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title" style={{ textAlign: "center" }}>
                                    <i className="fas fa-bar-chart mr-1" />
                                    Frequency of {selectedTokenNumber} Tokens Sold per Month
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
                                    {lineChartData.labels && lineChartData.labels.length > 0 ? (
                                        <div>
                                            <Line
                                                data={lineChartData}
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
            </div>
        </div>
    );
};

export default PieChartToken;