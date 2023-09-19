import { React, useState, useEffect } from "react";
import { Button, Table, Modal, Form, Row, Col, Toast } from "react-bootstrap";
import "./styles/Contactus.css";
import BreadCrumb from "../components/Common/BreadCrumb.js";
import { BsFillReplyFill } from "react-icons/bs";
import { MdEditSquare, MdPageview } from "react-icons/md";

import API from "../services/API";

import Pagination from "react-bootstrap/Pagination";

const ContactUs = () => {
  const [contactus, setContactus] = useState([]);
  const [pendingContactus, setPendingContactus] = useState([]);
  const [repliedContactus, setRepliedContactus] = useState([]);
  const [closedContactus, setClosedContactus] = useState([]);
  const [showRespondModal, setShowRespondModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState(0);
  const [respondId, setRespondId] = useState(0);
  const [editTitle, setEditTitle] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [editReason, setEditReason] = useState("");
  const [response, setResponse] = useState("");
  const [respondTitle, setRespondTitle] = useState("");
  const [respondMessage, setRespondMessage] = useState("");
  const [respondReason, setRespondReason] = useState("");
  const [addedRespond, setAddedRespond] = useState("");
  const [showClosed, setShowClosed] = useState(false);
  const [closedId, setClosedId] = useState(0);
  const [closedTitle, setClosedTitle] = useState("");
  const [closedMessage, setClosedMessage] = useState("");
  const [closedReason, setClosedReason] = useState("");
  const [closedResponse, setClosedResponse] = useState("");
  const [userNames, setUserNames] = useState({});

  const itemsPerPage = 4;

  const [currentPagePending, setCurrentPagePending] = useState(1);
  const [totalPagePending, setTotalPagePending] = useState(0);

  const indexOfLastItemPending = currentPagePending * itemsPerPage;
  const indexOfFirstItemPending = indexOfLastItemPending - itemsPerPage;

  const [currentPageReplied, setCurrentPageReplied] = useState(1);
  const [totalPageReplied, setTotalPageReplied] = useState(0);

  const indexOfLastItemReplied = currentPageReplied * itemsPerPage;
  const indexOfFirstItemReplied = indexOfLastItemReplied - itemsPerPage;

  const [currentPageClosed, setCurrentPageClosed] = useState(1);
  const [totalPageClosed, setTotalPageClosed] = useState(0);

  const indexOfLastItemClosed = currentPageClosed * itemsPerPage;
  const indexOfFirstItemClosed = indexOfLastItemClosed - itemsPerPage;

  const [validationMessages, setValidationMessages] = useState({
    emptyResponse: false,
  });

  // toast message
  const [show, setShow] = useState(false);
  const [toastAction, setToastAction] = useState("");

  const handlePageChangePending = (pageNumber) => {
    setCurrentPagePending(pageNumber);
  };

  const handlePageChangeReplied = (pageNumber) => {
    setCurrentPageReplied(pageNumber);
  };

  const handlePageChangeClosed = (pageNumber) => {
    setCurrentPageClosed(pageNumber);
  };

  const toggleShowRespondModal = (title, message, reason, id) => {
    setRespondTitle(title);
    setRespondMessage(message);
    setRespondReason(reason);
    setRespondId(id);
    setShowRespondModal(!showRespondModal);
  };

  const toggleShowEditModal = (title, message, reason, response, id) => {
    setEditTitle(title);
    setEditMessage(message);
    setEditReason(reason);
    setResponse(response);
    setEditId(id);
    setShowEditModal(!showEditModal);
  };

  const toggleShowClosedModal = (title, message, reason, response, id) => {
    setClosedTitle(title);
    setClosedMessage(message);
    setClosedReason(reason);
    setClosedResponse(response);
    setClosedId(id);
    setShowClosed(!showClosed);
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
  };

  const handleCloseClosed = () => {
    setShowClosed(false);
  };

  const handleCloseRespond = () => {
    setShowRespondModal(false);
    setAddedRespond("");
  };

  const showToast = (action) => {
    setToastAction(action);
    setShow(true);
  };

  const handleEdit = async () => {
    //edit contact us in backend, use the contactusid of the editId, response
    const newMessage = {
      emptyResponse: false,
    };

    const responseTrimmed = response.trim();

    if (responseTrimmed === "") {
      newMessage.emptyResponse = true;
      setValidationMessages(newMessage);
      return;
    }

    try {
      const response = await API.patch(`/admin/contactUs/${editId}`, {
        response: responseTrimmed,
      });

      if (response.status === 200) {
        fetchData();
        setValidationMessages(newMessage);
        setShowEditModal(false);
        showToast("updated");
      }
    } catch (error) {
      console.error("error");
    }
  };

  const handleRespond = async () => {
    //add contact us respond in the backend, use the contactusid of the respondId, addedResponse
    // setAddedRespond("");
    const newMessage = {
      emptyResponse: false,
    };

    const addedRespondTrimmed = addedRespond.trim();

    if (addedRespondTrimmed === "") {
      newMessage.emptyResponse = true;
      setValidationMessages(newMessage);
      return;
    }

    try {
      const response = await API.patch(`/admin/contactUs/${respondId}`, {
        response: addedRespondTrimmed,
      });

      if (response.status === 200) {
        fetchData();
        setValidationMessages(newMessage);
        setAddedRespond("");
        setShowRespondModal(false);
        showToast("responded");
      }
    } catch (error) {
      console.error("error");
    }
  };

  const getUserName = async (userId) => {
    const response = await API.get(
      `http://localhost:3000/admin/users/${userId}`
    );
    return response.data;
  };

  const fetchData = async () => {
    try {
      const response = await API.get(`http://localhost:3000/admin/contactUs`);
      const contactUs = response.data.contactUs;

      const userNamesData = {};
      for (const contact of contactUs) {
        if (!userNamesData[contact.userId]) {
          const userResponse = await getUserName(contact.userId);
          userNamesData[contact.userId] = userResponse;
        }
      }

      setUserNames(userNamesData);

      const pendingContactus = contactUs.filter(
        (contactus) => contactus.status === "PENDING"
      );
      pendingContactus.sort((a, b) => {
        const timestampA = new Date(a.updatedAt).getTime();
        const timestampB = new Date(b.updatedAt).getTime();
        return timestampB - timestampA;
      });
      setPendingContactus(pendingContactus);

      const repliedContactus = contactUs.filter(
        (contactus) => contactus.status === "REPLIED"
      );
      repliedContactus.sort((a, b) => {
        const timestampA = new Date(a.updatedAt).getTime();
        const timestampB = new Date(b.updatedAt).getTime();
        return timestampB - timestampA;
      });
      setRepliedContactus(repliedContactus);

      const closedContactus = contactUs.filter(
        (contactus) => contactus.status === "CLOSED"
      );
      closedContactus.sort((a, b) => {
        const timestampA = new Date(a.updatedAt).getTime();
        const timestampB = new Date(b.updatedAt).getTime();
        return timestampB - timestampA;
      });
      setClosedContactus(closedContactus);

      setTotalPagePending(Math.ceil(pendingContactus.length / itemsPerPage));
      setTotalPageReplied(Math.ceil(repliedContactus.length / itemsPerPage));
      setTotalPageClosed(Math.ceil(closedContactus.length / itemsPerPage));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="contactus">
      <div
        style={{
          marginTop: "20px",
          marginLeft: "30px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <BreadCrumb name="Contact Us"></BreadCrumb>
      </div>
      <div style={{ display: "flex", marginTop: "10px" }}>
        <div className="displayContactus">
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
                  <Toast.Body>{`You have ${toastAction} the enquiry successfully!`}</Toast.Body>
                </Toast>
              </Col>
            </Row>
          </div>
          <div className="pendingContactus">
            <h3
              style={{
                color: "black",
                font: "Montserrat",
                fontWeight: "700",
                fontSize: "16px",
                padding: "5px 10px 5px 10px",
              }}
            >
              Pending
            </h3>
            <div>
              <Table hover responsive="sm" size="md">
                <thead
                  style={{
                    textAlign: "center",
                  }}
                >
                  <tr>
                    <th>TITLE</th>
                    <th>MESSAGE</th>
                    <th>REASON</th>
                    <th>CREATED AT</th>
                    <th>CREATED BY</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                {Array.isArray(pendingContactus) &&
                pendingContactus.length > 0 ? (
                  <tbody>
                    {pendingContactus
                      .slice(indexOfFirstItemPending, indexOfLastItemPending)
                      .map((contactus) => (
                        <tr
                          key={contactus.contactUsId}
                          style={{
                            textAlign: "center",
                          }}
                        >
                          <td className="truncate-text">{contactus.title}</td>
                          <td className="truncate-text">{contactus.message}</td>
                          <td className="truncate-text">{contactus.reason}</td>
                          <td className="truncate-text">
                            {contactus.createdAt}
                          </td>
                          <td className="truncate-text">
                            {userNames[contactus.userId]}
                          </td>
                          <td>
                            <Button
                              size="sm"
                              title="Respond"
                              style={{
                                backgroundColor: "#FFD700",
                                border: "0",
                                marginRight: "10px",
                              }}
                              onClick={() =>
                                toggleShowRespondModal(
                                  contactus.title,
                                  contactus.message,
                                  contactus.reason,
                                  contactus.contactUsId
                                )
                              }
                            >
                              <BsFillReplyFill
                                style={{
                                  width: "18px",
                                  height: "18px",
                                  color: "black",
                                }}
                              ></BsFillReplyFill>
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                ) : (
                  <tbody>
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center" }}>
                        No contact us available
                      </td>
                    </tr>
                  </tbody>
                )}
              </Table>
            </div>
            <div>
              <Pagination className="contactus-paginate">
                {Array.from({ length: totalPagePending }).map((_, index) => (
                  <Pagination.Item
                    key={index}
                    active={index + 1 === currentPagePending}
                    onClick={() => handlePageChangePending(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </div>
          </div>
          <div className="repliedContactus">
            <h3
              style={{
                color: "black",
                font: "Montserrat",
                fontWeight: "700",
                fontSize: "16px",
                padding: "5px 10px 5px 10px",
              }}
            >
              Replied
            </h3>
            <div>
              <Table hover responsive="sm" size="md">
                <thead
                  style={{
                    textAlign: "center",
                  }}
                >
                  <tr>
                    <th>TITLE</th>
                    <th>MESSAGE</th>
                    <th>REASON</th>
                    <th>RESPONSE</th>
                    <th>CREATED AT</th>
                    <th>UPDATED AT</th>
                    <th>CREATED BY</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                {Array.isArray(repliedContactus) &&
                repliedContactus.length > 0 ? (
                  <tbody>
                    {repliedContactus
                      .slice(indexOfFirstItemReplied, indexOfLastItemReplied)
                      .map((contactus) => (
                        <tr
                          key={contactus.contactUsId}
                          style={{
                            textAlign: "center",
                          }}
                        >
                          <td className="truncate-text">{contactus.title}</td>
                          <td className="truncate-text">{contactus.message}</td>
                          <td className="truncate-text">{contactus.reason}</td>
                          <td className="truncate-text">
                            {contactus.response}
                          </td>
                          <td className="truncate-text">
                            {contactus.createdAt}
                          </td>
                          <td className="truncate-text">
                            {contactus.updatedAt}
                          </td>
                          <td className="truncate-text">
                            {userNames[contactus.userId]}
                          </td>
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
                                toggleShowEditModal(
                                  contactus.title,
                                  contactus.message,
                                  contactus.reason,
                                  contactus.response,
                                  contactus.contactUsId
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
                          </td>
                        </tr>
                      ))}
                  </tbody>
                ) : (
                  <tbody>
                    <tr>
                      <td colSpan="8" style={{ textAlign: "center" }}>
                        No contact us available
                      </td>
                    </tr>
                  </tbody>
                )}
              </Table>
            </div>
            <div>
              <Pagination className="contactus-paginate">
                {Array.from({ length: totalPageReplied }).map((_, index) => (
                  <Pagination.Item
                    key={index}
                    active={index + 1 === currentPageReplied}
                    onClick={() => handlePageChangeReplied(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </div>
          </div>
          <div className="closedContactus">
            <h3
              style={{
                color: "black",
                font: "Montserrat",
                fontWeight: "700",
                fontSize: "16px",
                padding: "5px 10px 5px 10px",
              }}
            >
              Closed
            </h3>
            <div>
              <Table hover responsive="sm" size="md">
                <thead
                  style={{
                    textAlign: "center",
                  }}
                >
                  <tr>
                    <th>TITLE</th>
                    <th>MESSAGE</th>
                    <th>REASON</th>
                    <th>RESPONSE</th>
                    <th>CREATED AT</th>
                    <th>UPDATED AT</th>
                    <th>CREATED BY</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                {Array.isArray(closedContactus) &&
                closedContactus.length > 0 ? (
                  <tbody>
                    {closedContactus
                      .slice(indexOfFirstItemClosed, indexOfLastItemClosed)
                      .map((contactus) => (
                        <tr
                          key={contactus.contactUsId}
                          style={{
                            textAlign: "center",
                          }}
                        >
                          <td className="truncate-text">{contactus.title}</td>
                          <td className="truncate-text">{contactus.message}</td>
                          <td className="truncate-text">{contactus.reason}</td>
                          <td className="truncate-text">
                            {contactus.response}
                          </td>
                          <td className="truncate-text">
                            {contactus.createdAt}
                          </td>
                          <td className="truncate-text">
                            {contactus.updatedAt}
                          </td>
                          <td className="truncate-text">
                            {userNames[contactus.userId]}
                          </td>
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
                                toggleShowClosedModal(
                                  contactus.title,
                                  contactus.message,
                                  contactus.reason,
                                  contactus.response,
                                  contactus.contactUsId
                                )
                              }
                            >
                              <MdPageview
                                style={{
                                  width: "18px",
                                  height: "18px",
                                  color: "black",
                                }}
                              ></MdPageview>
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                ) : (
                  <tbody>
                    <tr>
                      <td colSpan="8" style={{ textAlign: "center" }}>
                        No contact us available
                      </td>
                    </tr>
                  </tbody>
                )}
              </Table>
            </div>
            <div>
              <Pagination className="contactus-paginate">
                {Array.from({ length: totalPageClosed }).map((_, index) => (
                  <Pagination.Item
                    key={index}
                    active={index + 1 === currentPageClosed}
                    onClick={() => handlePageChangeClosed(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </div>
          </div>
        </div>
        <Modal
          show={showEditModal}
          onHide={handleCloseEdit}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Response</Modal.Title>
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
                Reason
              </Form.Label>
              <Form.Control
                type="text"
                name="reason"
                value={editReason}
                readOnly
              />
            </div>
            <Form.Label
              style={{
                color: "black",
                font: "Public Sans",
                fontWeight: "700",
                fontSize: "15px",
              }}
            >
              Title
            </Form.Label>
            <Form.Control type="text" name="title" value={editTitle} readOnly />
            <Form.Label
              style={{
                color: "black",
                font: "Public Sans",
                fontWeight: "700",
                fontSize: "15px",
              }}
            >
              Message
            </Form.Label>
            <Form.Control
              type="text"
              name="message"
              value={editMessage}
              readOnly
            />
            <Form.Label
              style={{
                color: "black",
                font: "Public Sans",
                fontWeight: "700",
                fontSize: "15px",
              }}
            >
              Response
            </Form.Label>
            <Form.Control
              as="textarea"
              id="response"
              name="message"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              isInvalid={validationMessages.emptyResponse}
            />
            {validationMessages.emptyResponse && (
              <Form.Control.Feedback type="invalid">
                Response is required.
              </Form.Control.Feedback>
            )}
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
              onClick={handleCloseEdit}
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
          show={showRespondModal}
          onHide={handleCloseRespond}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Respond</Modal.Title>
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
                Reason
              </Form.Label>
              <Form.Control
                type="text"
                name="reason"
                value={respondReason}
                readOnly
              />
            </div>
            <Form.Label
              style={{
                color: "black",
                font: "Public Sans",
                fontWeight: "700",
                fontSize: "15px",
              }}
            >
              Title
            </Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={respondTitle}
              readOnly
            />
            <Form.Label
              style={{
                color: "black",
                font: "Public Sans",
                fontWeight: "700",
                fontSize: "15px",
              }}
            >
              Message
            </Form.Label>
            <Form.Control
              type="text"
              name="message"
              value={respondMessage}
              readOnly
            />
            <Form.Label
              style={{
                color: "black",
                font: "Public Sans",
                fontWeight: "700",
                fontSize: "15px",
              }}
            >
              Response
            </Form.Label>
            <Form.Control
              as="textarea"
              id="response"
              name="message"
              value={addedRespond}
              onChange={(e) => setAddedRespond(e.target.value)}
              isInvalid={validationMessages.emptyResponse}
            />
            {validationMessages.emptyResponse && (
              <Form.Control.Feedback type="invalid">
                Response is required.
              </Form.Control.Feedback>
            )}
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
              onClick={handleCloseRespond}
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
              onClick={() => handleRespond()}
            >
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={showClosed}
          onHide={handleCloseClosed}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>View Contact Us</Modal.Title>
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
                Reason
              </Form.Label>
              <Form.Control
                type="text"
                name="reason"
                value={closedReason}
                readOnly
              />
            </div>
            <Form.Label
              style={{
                color: "black",
                font: "Public Sans",
                fontWeight: "700",
                fontSize: "15px",
              }}
            >
              Title
            </Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={closedTitle}
              readOnly
            />
            <Form.Label
              style={{
                color: "black",
                font: "Public Sans",
                fontWeight: "700",
                fontSize: "15px",
              }}
            >
              Message
            </Form.Label>
            <Form.Control
              type="text"
              name="message"
              value={closedMessage}
              readOnly
            />
            <Form.Label
              style={{
                color: "black",
                font: "Public Sans",
                fontWeight: "700",
                fontSize: "15px",
              }}
            >
              Response
            </Form.Label>
            <Form.Control
              as="textarea"
              id="response"
              name="message"
              value={closedResponse}
              readOnly
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
              onClick={handleCloseClosed}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default ContactUs;
