import React, { useEffect, useRef, useState } from "react";

import { Bar } from 'react-chartjs-2';
import API from "../services/API";

const BarChart = () => {
  const userData = [
    {
      userId: 1,
      userName: "User1",
      userType: "BUYER_SELLER",
      createdAt: "2023-11-01T00:00:00.000Z",
    },
    {
      userId: 2,
      userName: "User2",
      userType: "BUYER_SELLER",
      createdAt: "2023-10-02T00:00:00.000Z",
    },
    {
      userId: 3,
      userName: "User3",
      userType: "BUYER_SELLER",
      createdAt: "2023-11-03T00:00:00.000Z",
    },
    {
      userId: 4,
      userName: "User4",
      userType: "BUYER_SELLER",
      createdAt: "2023-10-01T00:00:00.000Z",
    },
    {
      userId: 5,
      userName: "User5",
      userType: "BUYER_SELLER",
      createdAt: "2023-10-02T00:00:00.000Z",
    },
    {
      userId: 6,
      userName: "User6",
      userType: "BUYER_SELLER",
      createdAt: "2023-10-03T00:00:00.000Z",
    },
    {
      userId: 7,
      userName: "User7",
      userType: "BUYER_SELLER",
      createdAt: "2023-09-01T00:00:00.000Z",
    },
    {
      userId: 8,
      userName: "User8",
      userType: "BUYER_SELLER",
      createdAt: "2023-09-02T00:00:00.000Z",
    },
    {
      userId: 9,
      userName: "User9",
      userType: "BUYER_SELLER",
      createdAt: "2023-09-03T00:00:00.000Z",
    },
    {
      userId: 10,
      userName: "User9",
      userType: "BUYER_SELLER",
      createdAt: "2023-06-03T00:00:00.000Z",
    },
    {
      userId: 11,
      userName: "User9",
      userType: "BUYER_SELLER",
      createdAt: "2023-08-03T00:00:00.000Z",
    },
    {
      userId: 12,
      userName: "User9",
      userType: "BUYER_SELLER",
      createdAt: "2023-07-03T00:00:00.000Z",
    },
    {
      userId: 12,
      userName: "User9",
      userType: "BUYER_SELLER",
      createdAt: "2023-01-03T00:00:00.000Z",
    },
    {
      userId: 12,
      userName: "User9",
      userType: "BUYER_SELLER",
      createdAt: "2023-01-03T00:00:00.000Z",
    },
    {
      userId: 12,
      userName: "User9",
      userType: "BUYER_SELLER",
      createdAt: "2023-02-03T00:00:00.000Z",
    },
    {
      userId: 12,
      userName: "User9",
      userType: "BUYER_SELLER",
      createdAt: "2023-03-03T00:00:00.000Z",
    },
    {
      userId: 12,
      userName: "User9",
      userType: "BUYER_SELLER",
      createdAt: "2023-04-03T00:00:00.000Z",
    },
  ];
  const [selectedTimePeriod, setSelectedTimePeriod] = useState(3); 

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

  // Function to filter data for the last X months
  const filterDataForLastXMonths = (month) => {
    const today = new Date();
    const lastXMonths = new Date(today);
    lastXMonths.setMonth(today.getMonth() - month);
    return userData.filter((item) => new Date(item.createdAt) >= lastXMonths);
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


  const [chartData, setChartData] = useState({});

  const createBackgroundColor = (month) => {
    const rgb = new Set();

    for (let i = 0; i < month; i++) {

      const red = Math.random(0, 255) * 255;
      const blue = Math.random(0, 255) * 255;
      const green = Math.random(0, 255) * 255;

      const rgba = `rgba(${red}, ${blue}, ${green}, 0.6)`;

      rgb.add(rgba);
    }

    return Array.from(rgb);
  };

  useEffect(() => {

    let filteredData = "";

    if (selectedTimePeriod == 3) {
      filteredData = filterDataForLastXMonths(3);
    } else if (selectedTimePeriod == 6) {
      filteredData = filterDataForLastXMonths(6);
    } else {
      filteredData = filterDataForLastXMonths(12);
    }

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
          backgroundColor: createBackgroundColor(dataSortedByMonth.length),
        },
      ],
    };

    // Render the chart
    setChartData(data);

  }, [selectedTimePeriod]);

  return (
    <div style={{width: "50%"}}>
      <section className="col-lg-14 connectedSortable">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ textAlign: "center" }}>
              <i className="fas fa-bar-chart mr-1" />
              Onboarding of Users
            </h3>
          </div>
          <div className="card-body">
            <div className="tab-content p-0">
              <div style={{textAlign: "right", marginRight: "0"}}>
                <label htmlFor="timePeriodSelect" style={{marginRight: "1em"}}>Select Time Period:</label>
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
                <div style={{ width: "100%", height: "100%" }}>
                  <Bar
                    data={chartData}
                    options={{
                      plugins: {
                        legend: {
                          display: false
                        }
                      },
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          ticks: {
                            callback: function (value) {
                              return Math.round(value); // Display only whole numbers on the y-axis
                            },
                          },
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

export default BarChart;