import { React, useState } from "react";
import { Button, Card, Table } from "react-bootstrap";
import "./Faq.css";
import BreadCrumb from "../components/Common/BreadCrumb.js";

const Faq = () => {
  return (
    <div className="faq">
      <div style={{ marginTop: "40px", marginLeft: "60px" }}>
        <BreadCrumb name="FAQ"></BreadCrumb>
      </div>
      <div style={{ display: "flex", marginTop: "20px" }}>
        <div className="displayfaq">
          <div className="sellerfaq">
            <h3
              style={{
                color: "black",
                font: "Montserrat",
                fontWeight: "500",
                fontSize: "16px",
                padding: "10px 15px 10px 15px",
              }}
            >
              SELLER FAQ
            </h3>
            <Table hover size="sm">
              <thead
                style={{
                  textAlign: "center",
                  fontFamily: "Arial",
                }}
              >
                <tr>
                  <th>QUESTION</th>
                  <th>ANSWER</th>
                  <th>DATE CREATED</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {/* <tr>
                  <td>1</td>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Jacob</td>
                  <td>Thornton</td>
                  <td>@fat</td>
                </tr> */}
              </tbody>
            </Table>
          </div>
          <div className="buyerfaq">
            <h3
              style={{
                color: "black",
                font: "Montserrat",
                fontWeight: "500",
                fontSize: "16px",
                padding: "10px 15px 10px 15px",
              }}
            >
              BUYER FAQ
            </h3>
            <Table hover size="sm">
              <thead style={{ textAlign: "center" }}>
                <tr>
                  <th>QUESTION</th>
                  <th>ANSWER</th>
                  <th>DATE CREATED</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {/* <tr>
                  <td>1</td>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Jacob</td>
                  <td>Thornton</td>
                  <td>@fat</td>
                </tr> */}
              </tbody>
            </Table>
          </div>
        </div>
        {/* <div className="answerfaq"></div> */}
      </div>
    </div>
  );
};

export default Faq;
