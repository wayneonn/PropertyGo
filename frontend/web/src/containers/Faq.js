import { React, useState, useEffect } from "react";
import { Button, Card, Table } from "react-bootstrap";
import "./Faq.css";
import BreadCrumb from "../components/Common/BreadCrumb.js";
import { MdPageview, MdDelete } from "react-icons/md";

import API from "../services/API";

import Pagination from "react-bootstrap/Pagination";

let active = 1;
let items = [];
for (let number = 1; number <= 5; number++) {
  items.push(
    <Pagination.Item key={number} active={number === active}>
      {number}
    </Pagination.Item>
  );
}

const Faq = () => {
  const [faqs, setFaqs] = useState([]);
  const [buyerfaqs, setBuyerfaqs] = useState([]);
  const [sellerfaqs, setSellerfaqs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get(`http://localhost:3000/admin/faqs`);
        const faqs = response.data.faqs;
        setFaqs(faqs);
        const buyerFaqs = faqs.filter((faq) => faq.faqType === "BUYER");
        setBuyerfaqs(buyerFaqs);
        const sellerFaqs = faqs.filter((faq) => faq.faqType === "SELLER");
        setSellerfaqs(sellerFaqs);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="faq">
      <div style={{ marginTop: "40px", marginLeft: "60px" }}>
        <BreadCrumb name="FAQ"></BreadCrumb>
      </div>
      <div style={{ display: "flex", marginTop: "10px" }}>
        <div className="displayfaq">
          <div className="sellerfaq">
            <h3
              style={{
                color: "black",
                font: "Montserrat",
                fontWeight: "700",
                fontSize: "16px",
                padding: "10px 15px 10px 15px",
              }}
            >
              SELLER FAQ
            </h3>
            <Table hover responsive size="sm">
              <thead
                style={{
                  textAlign: "center",
                  fontFamily: "Gill Sans",
                }}
              >
                <tr>
                  <th>QUESTION</th>
                  <th>ANSWER</th>
                  <th>DATE CREATED</th>
                  <th>UPDATED AT</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              {Array.isArray(sellerfaqs) && sellerfaqs.length > 0 ? (
                <tbody>
                  {sellerfaqs.map((faq) => (
                    <tr
                      key={faq.faqId}
                      style={{
                        textAlign: "center",
                        fontFamily: "Gill Sans",
                      }}
                    >
                      <td>{faq.question}</td>
                      <td>{faq.answer}</td>
                      <td>{faq.createdAt}</td>
                      <td>{faq.updatedAt}</td>
                      <td>
                        <Button
                          size="sm"
                          title="Edit"
                          style={{
                            backgroundColor: "#FFD700",
                            border: "0",
                            marginRight: "10px",
                          }}
                        >
                          <MdPageview
                            style={{
                              width: "20px",
                              height: "20px",
                              color: "black",
                            }}
                          ></MdPageview>
                        </Button>
                        <Button
                          size="sm"
                          title="Delete"
                          style={{ backgroundColor: "#FFD700", border: "0" }}
                        >
                          <MdDelete
                            style={{
                              width: "20px",
                              height: "20px",
                              color: "black",
                            }}
                          ></MdDelete>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No FAQs available
                    </td>
                  </tr>
                </tbody>
              )}
            </Table>
          </div>
          <div className="buyerfaq">
            <h3
              style={{
                color: "black",
                font: "Montserrat",
                fontWeight: "700",
                fontSize: "16px",
                padding: "10px 15px 10px 15px",
              }}
            >
              BUYER FAQ
            </h3>
            <Table hover responsive size="sm">
              <thead style={{ textAlign: "center", fontFamily: "Gill Sans" }}>
                <tr>
                  <th>QUESTION</th>
                  <th>ANSWER</th>
                  <th>DATE CREATED</th>
                  <th>UPDATED AT</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              {Array.isArray(buyerfaqs) && buyerfaqs.length > 0 ? (
                <tbody>
                  {buyerfaqs.map((faq) => (
                    <tr
                      key={faq.faqId}
                      style={{
                        textAlign: "center",
                        fontFamily: "Gill Sans",
                      }}
                    >
                      <td>{faq.question}</td>
                      <td>{faq.answer}</td>
                      <td>{faq.createdAt}</td>
                      <td>{faq.updatedAt}</td>
                      <td>
                        <Button
                          size="sm"
                          title="Edit"
                          style={{
                            backgroundColor: "#FFD700",
                            border: "0",
                            marginRight: "10px",
                          }}
                        >
                          <MdPageview
                            style={{
                              width: "20px",
                              height: "20px",
                              color: "black",
                            }}
                          ></MdPageview>
                        </Button>
                        <Button
                          size="sm"
                          title="Delete"
                          style={{ backgroundColor: "#FFD700", border: "0" }}
                        >
                          <MdDelete
                            style={{
                              width: "20px",
                              height: "20px",
                              color: "black",
                            }}
                          ></MdDelete>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No FAQs available
                    </td>
                  </tr>
                </tbody>
              )}
            </Table>
          </div>
        </div>
        {/* <div className="answerfaq"></div> */}
      </div>
    </div>
  );
};

export default Faq;
