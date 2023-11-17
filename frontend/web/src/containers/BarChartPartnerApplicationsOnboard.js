import React, { useEffect, useState } from "react";

import { Bar } from 'react-chartjs-2';
import API from "../services/API";

const BarChartPartnerApplicationsOnboard = () => {
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

  const filterDataForLastXMonths = (month, userData) => {
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

    const fetchData = async () => {
      try {
        const response = await API.get('http://localhost:3000/user/partner/list');
        const users = response.data;

        let filteredData = "";

        if (selectedTimePeriod == 3) {
          filteredData = filterDataForLastXMonths(3, users);
        } else if (selectedTimePeriod == 6) {
          filteredData = filterDataForLastXMonths(6, users);
        } else {
          filteredData = filterDataForLastXMonths(12, users);
        }

        console.log(filteredData);

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
              backgroundColor: createBackgroundColor(dataSortedByMonth.length),
            },
          ],
        };

        setChartData(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, [selectedTimePeriod]);

  return (
    <div style={{ width: "50%" }}>
      <section className="col-lg-14 connectedSortable">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ textAlign: "center" }}>
              <i className="fas fa-bar-chart mr-1" />
              Onboarding of Partner Applications
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
                <div style={{ width: "100%", height: "100%" }}>
                  <Bar
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
                          beginAtZero: true
                        },
                      },
                    }}
                  />
                </div>
              ) : (
                <p style={{textAlign: "center", marginTop: "3em"}}>No data to show...</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BarChartPartnerApplicationsOnboard;