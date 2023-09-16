import { React, useState, useEffect } from "react";
import axios from "axios";
import { Button, Card, Table } from "react-bootstrap";
import "./Faq.css";
import BreadCrumb from "../components/Common/BreadCrumb.js";
import { MdPageview, MdDelete } from "react-icons/md";

const Faq = () => {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await axios.get(`http://localhost:3000/admin/faqs`);
        // setFaqs(response.data);
        // console.log(response.data.size);
        // const test = await API.get(`/admins/faqs`);
        // const { faqs } = test.data;
        // setFaqs(faqs);
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
              {/* <tbody>
                {faqs.map((faq) => (
                  <tr>
                    <td>{faq.question}</td>
                    <td>{faq.answer}</td>
                    <td>{faq.createdAt}</td>
                    <td>
                      <Button size="sm" color="#FFD700" title="Edit">
                        <MdPageview></MdPageview>
                      </Button>
                      <Button size="sm" color="#FFD700" title="Delete">
                        <MdDelete></MdDelete>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody> */}
              {Array.isArray(faqs) && faqs.length > 0 ? (
                <tbody>
                  {faqs.map((faq) => (
                    <tr key={faq.id}>
                      <td>{faq.question}</td>
                      <td>{faq.answer}</td>
                      <td>{faq.createdAt}</td>
                      <td>{faq.updatedAt}</td>
                      <td>
                        <Button size="sm" color="#FFD700" title="Edit">
                          <MdPageview></MdPageview>
                        </Button>
                        <Button size="sm" color="#FFD700" title="Delete">
                          <MdDelete></MdDelete>
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
              {/* <tbody>
              </tbody> */}
            </Table>
          </div>
        </div>
        {/* <div className="answerfaq"></div> */}
      </div>
    </div>
  );
};

export default Faq;
