import React from "react";

import "./styles/Dashboard.css";
import BreadCrumb from "../components/Common/BreadCrumb.js";
import BarChart from "./BarChart";

import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

import API from "../services/API";

const Dashboard = () => {

    Chart.register(CategoryScale);

    return (
        <div className="dashboard">
            <div
                style={{
                    marginTop: "10px",
                    marginLeft: "30px",
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <BreadCrumb names={["Home"]} links={["/"]}></BreadCrumb>
            </div>
            <div style={{ display: "flex", marginTop: "10px", marginLeft: "1.5em" }}>
                <BarChart/>
            </div>
        </div>
    )
};

export default Dashboard;