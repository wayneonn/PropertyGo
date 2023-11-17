import React from "react";

import "./styles/Dashboard.css";
import BreadCrumb from "../components/Common/BreadCrumb.js";
import BarChartUsersOnboard from "./BarChartUsersOnboard";
import BarChartPartnerApplicationsOnboard from "./BarChartPartnerApplicationsOnboard";
import PieChartToken from "./PieChartToken";

import Chart from "chart.js/auto";
import { CategoryScale, ArcElement, Tooltip, Legend } from "chart.js";

import LineGraphCommissionFee from "./LineGraphCommissionFee";
import LineGraphCumulativeCommissionFee from "./LineGraphCumulativeCommissionFee";
import LineGraphCommissionFeeBreakdown from "./LineGraphCommissionFeeBreakdown";

const Dashboard = () => {

    Chart.register(CategoryScale, ArcElement, Tooltip, Legend);

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
            <div style={{ display: "flex", marginTop: "10px", width: "95%" }}>
                <div style={{ marginLeft: "1.5em" }} />
                <BarChartUsersOnboard />
                <div style={{ marginLeft: "1.5em" }} />
                <BarChartPartnerApplicationsOnboard />
            </div>
            <br />
            <PieChartToken />
            <br />
            <div style={{ display: "flex", marginTop: "10px", width: "98%" }}>
                <LineGraphCommissionFee />
                <LineGraphCumulativeCommissionFee />
            </div>
            <div style={{ display: "flex", marginTop: "10px", width: "98%" }}>
                <LineGraphCommissionFeeBreakdown />
            </div>
            <br/>
        </div>
    )
};

export default Dashboard;