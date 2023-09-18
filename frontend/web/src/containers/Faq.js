import { React, useState, useEffect } from "react";
import { Button, Table, Modal, Form, Toast, Row, Col } from "react-bootstrap";
import "./styles/Faq.css";
import BreadCrumb from "../components/Common/BreadCrumb.js";
import { MdEditSquare, MdDelete } from "react-icons/md";
import FaqCreate from "./FaqCreate.js";

import API from "../services/API";

import Pagination from "react-bootstrap/Pagination";

const Faq = () => {
  const [faqs, setFaqs] = useState([]);
  const [buyerfaqs, setBuyerfaqs] = useState([]);
  const [sellerfaqs, setSellerfaqs] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [faqId, setFaqId] = useState(0);
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [faqType, setFaqType] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteFaqId, setDeleteFaqId] = useState(0);

  const itemsPerPage = 4;

  const [currentPageSeller, setCurrentPageSeller] = useState(1);
  const [totalPageSeller, setTotalPageSeller] = useState(0);

  const indexOfLastItemSeller = currentPageSeller * itemsPerPage;
  const indexOfFirstItemSeller = indexOfLastItemSeller - itemsPerPage;

  const [currentPageBuyer, setCurrentPageBuyer] = useState(1);
  const [totalPageBuyer, setTotalPageBuyer] = useState(0);

  const indexOfLastItemBuyer = currentPageBuyer * itemsPerPage;
  const indexOfFirstItemBuyer = indexOfLastItemBuyer - itemsPerPage;

  // toast message
  const [show, setShow] = useState(false);
  const [toastAction, setToastAction] = useState("");

  const handlePageChangeSeller = (pageNumber) => {
    setCurrentPageSeller(pageNumber);
  };

  const handlePageChangeBuyer = (pageNumber) => {
    setCurrentPageBuyer(pageNumber);
  };

  const toggleEditModal = (faqId, faqQuestion, faqAnswer, faqType) => {
    setShowEditModal(!showEditModal);
    setFaqId(faqId);
    setFaqQuestion(faqQuestion);
    setFaqAnswer(faqAnswer);
    setFaqType(faqType);
  };

  const toggleDeleteModal = (faqId) => {
    setShowDeleteModal(!showDeleteModal);
    setDeleteFaqId(faqId);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleClose = () => {
    setShowEditModal(false);
  };

  const handleEdit = () => {
    //edit faq in database
  };

  const handleDelete = () => {
    //delete faq from database. Use the value of the useState deleteFaqId for the faqId
  };

  const showToast = (action) => {
    setToastAction(action);
    setShow(true);
  };

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
        setTotalPageSeller(Math.ceil(sellerFaqs.length / itemsPerPage));
        setTotalPageBuyer(Math.ceil(buyerFaqs.length / itemsPerPage));
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [faqs]);

  return (
    <div className="faq">
      <div
        style={{
          marginTop: "20px",
          marginLeft: "30px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <BreadCrumb name="FAQ"></BreadCrumb>
      </div>
      <div style={{ position: "fixed", top: "5%", left: "50%" }}>
        <Row>
          <Col xs={6}>
            <Toast
              bg="warning"
              onClose={() => setShow(false)}
              show={show}
              delay={4000}
              autohide
            >
              <Toast.Header>
                <strong className="me-auto">Successful</strong>
              </Toast.Header>
              <Toast.Body>{`You have ${toastAction} the FAQ successfully!`}</Toast.Body>
            </Toast>
          </Col>
        </Row>
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
                padding: "5px 10px 5px 10px",
              }}
            >
              SELLER FAQ
            </h3>
            <div>
              <Table hover responsive size="sm">
                <thead
                  style={{
                    textAlign: "center",
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
                    {sellerfaqs
                      .slice(indexOfFirstItemSeller, indexOfLastItemSeller)
                      .map((faq) => (
                        <tr
                          key={faq.faqId}
                          style={{
                            textAlign: "center",
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
                              onClick={() =>
                                toggleEditModal(
                                  faq.faqId,
                                  faq.question,
                                  faq.answer,
                                  faq.faqType
                                )
                              }
                            >
                              <MdEditSquare
                                style={{
                                  width: "18px",
                                  height: "18px",
                                  color: "black",
                                }}
                              ></MdEditSquare>
                            </Button>
                            <Button
                              size="sm"
                              title="Delete"
                              style={{
                                backgroundColor: "#FFD700",
                                border: "0",
                              }}
                              onClick={() => toggleDeleteModal(faq.faqId)}
                            >
                              <MdDelete
                                style={{
                                  width: "18px",
                                  height: "18px",
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
            <div>
              <Pagination className="faq-paginate">
                {Array.from({ length: totalPageSeller }).map((_, index) => (
                  <Pagination.Item
                    key={index}
                    active={index + 1 === currentPageSeller}
                    onClick={() => handlePageChangeSeller(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </div>
          </div>
          <div className="buyerfaq">
            <h3
              style={{
                color: "black",
                font: "Montserrat",
                fontWeight: "700",
                fontSize: "16px",
                padding: "5px 10px 5px 10px",
              }}
            >
              BUYER FAQ
            </h3>
            <div>
              <Table hover responsive size="sm">
                <thead style={{ textAlign: "center" }}>
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
                    {buyerfaqs
                      .slice(indexOfFirstItemBuyer, indexOfLastItemBuyer)
                      .map((faq) => (
                        <tr
                          key={faq.faqId}
                          style={{
                            textAlign: "center",
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
                              onClick={() =>
                                toggleEditModal(
                                  faq.faqId,
                                  faq.question,
                                  faq.answer,
                                  faq.faqType
                                )
                              }
                            >
                              <MdEditSquare
                                style={{
                                  width: "18px",
                                  height: "18px",
                                  color: "black",
                                }}
                              ></MdEditSquare>
                            </Button>
                            <Button
                              size="sm"
                              title="Delete"
                              style={{
                                backgroundColor: "#FFD700",
                                border: "0",
                              }}
                              onClick={() => toggleDeleteModal(faq.faqId)}
                            >
                              <MdDelete
                                style={{
                                  width: "18px",
                                  height: "18px",
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
            <div>
              <Pagination className="faq-paginate">
                {Array.from({ length: totalPageBuyer }).map((_, index) => (
                  <Pagination.Item
                    key={index}
                    active={index + 1 === currentPageBuyer}
                    onClick={() => handlePageChangeBuyer(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </div>
          </div>
        </div>
        <FaqCreate showToast={showToast}></FaqCreate>
        <Modal
          show={showEditModal}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit FAQ</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={{ marginBottom: "10px" }}>
              <Form.Label
                style={{
                  color: "black",
                  font: "Public Sans",
                  fontWeight: "700",
                  fontSize: "15px",
                }}
              >
                FAQ Type
              </Form.Label>
              <Form.Select
                aria-label="Default select example"
                onChange={(e) => setFaqType(e.target.value)}
                value={faqType}
              >
                <option value="SELLER">SELLER</option>
                <option value="BUYER">BUYER</option>
              </Form.Select>
            </div>
            <Form.Label
              style={{
                color: "black",
                font: "Public Sans",
                fontWeight: "700",
                fontSize: "15px",
              }}
            >
              Question
            </Form.Label>
            <Form.Control
              as="textarea"
              id="question"
              rows={6}
              value={faqQuestion}
              onChange={(e) => setFaqQuestion(e.target.value)}
            />
            <Form.Label
              style={{
                color: "black",
                font: "Public Sans",
                fontWeight: "700",
                fontSize: "15px",
              }}
            >
              Answer
            </Form.Label>
            <Form.Control
              as="textarea"
              id="answer"
              rows={6}
              value={faqAnswer}
              onChange={(e) => setFaqAnswer(e.target.value)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              style={{
                backgroundColor: "#F5F6F7",
                border: "0",
                width: "92px",
                height: "40px",
                borderRadius: "160px",
                color: "black",
                font: "Public Sans",
                fontWeight: "600",
                fontSize: "14px",
              }}
              onClick={handleClose}
            >
              Close
            </Button>
            <Button
              style={{
                backgroundColor: "#FFD700",
                border: "0",
                width: "92px",
                height: "40px",
                borderRadius: "160px",
                color: "black",
                font: "Public Sans",
                fontWeight: "600",
                fontSize: "14px",
              }}
              onClick={() => handleEdit()}
            >
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={showDeleteModal}
          onHide={handleCloseDeleteModal}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Delete FAQ</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this FAQ?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              style={{
                backgroundColor: "#F5F6F7",
                border: "0",
                width: "92px",
                height: "40px",
                borderRadius: "160px",
                color: "black",
                font: "Public Sans",
                fontWeight: "600",
                fontSize: "14px",
              }}
              onClick={handleCloseDeleteModal}
            >
              No
            </Button>
            <Button
              style={{
                backgroundColor: "#FFD700",
                border: "0",
                width: "92px",
                height: "40px",
                borderRadius: "160px",
                color: "black",
                font: "Public Sans",
                fontWeight: "600",
                fontSize: "14px",
              }}
              onClick={() => handleDelete()}
            >
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Faq;
