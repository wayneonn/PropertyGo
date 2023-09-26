import { React, useState, useEffect } from "react";
import { Button, Table, Modal, Form, Row, Col, Toast } from "react-bootstrap";
import "./styles/Contactus.css";
import BreadCrumb from "../components/Common/BreadCrumb.js";
import { BsFillReplyFill } from "react-icons/bs";
import {
  MdEditSquare,
  MdPageview,
  MdCurtainsClosed,
  MdPreview,
} from "react-icons/md";

import API from "../services/API";

import Pagination from "react-bootstrap/Pagination";
import TextareaAutosize from "react-textarea-autosize";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import the styles
import { formats, modules } from "../components/Common/RichTextEditor";

const ContactUs = () => {
  const [contactus, setContactus] = useState([]);
  const [pendingContactus, setPendingContactus] = useState([]);
  const [repliedContactus, setRepliedContactus] = useState([]);
  const [closedContactus, setClosedContactus] = useState([]);
  const [showRespondModal, setShowRespondModal] = useState(false);
  const [showViewResponseModal, setShowViewResponseModal] = useState(false);
  const [respondId, setRespondId] = useState(0);
  const [respondTitle, setRespondTitle] = useState("");
  const [respondMessage, setRespondMessage] = useState("");
  const [respondReason, setRespondReason] = useState("");
  const [addedRespond, setAddedRespond] = useState("");
  const [userNames, setUserNames] = useState({});
  const [adminNames, setAdminNames] = useState({});
  const [viewResponseId, setViewResponseId] = useState(0);
  const [responses, setResponses] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editResponse, setEditResponse] = useState("");
  const [editResponseId, setEditResponseId] = useState(0);
  const [showResponsesModal, setShowResponsesModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewMessage, setPreviewMessage] = useState("");
  const [previewReason, setPreviewReason] = useState("");

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
    setRespondId(id); //id of the contact us that the admin is adding response to
    setShowRespondModal(!showRespondModal);
  };

  const toggleShowViewResponseModal = (id) => {
    setViewResponseId(id);
    getResponses(id);
    setShowViewResponseModal(!showViewResponseModal);
  };

  const toggleShowResponsesModal = (id) => {
    setViewResponseId(id);
    getResponses(id);
    setShowResponsesModal(!showResponsesModal);
  };

  const toggleShowEditModal = (response, id) => {
    setEditResponse(response);
    setEditResponseId(id);
    setShowEditModal(!showEditModal);
  };

  const toggleShowPreviewModal = (title, message, reason) => {
    setPreviewTitle(title);
    setPreviewMessage(message);
    setPreviewReason(reason);
    setShowPreviewModal(!showPreviewModal);
  };

  const handleClosePreview = () => {
    setShowPreviewModal(!showPreviewModal);
  };

  const handleCloseRespond = () => {
    setShowRespondModal(false);
    setAddedRespond("");
    setValidationMessages({});
  };

  const handleCloseViewRespond = () => {
    setShowViewResponseModal(false);
    setValidationMessages({});
  };

  const handleCloseResponses = () => {
    setShowResponsesModal(false);
    setValidationMessages({});
  };

  const handleCloseEditRespond = () => {
    setShowEditModal(false);
    setValidationMessages({});
  };

  const closeRespond = async (id) => {
    //change the status of this contact us to "CLOSED"
    const newMessage = {
      emptyResponse: false,
    };

    try {
      const response = await API.patch(`/admin/contactUs/${id}`);

      if (response.status === 200) {
        fetchData();
        setValidationMessages(newMessage);
        showToast("closed contact us");
      }
    } catch (error) {
      console.error("error");
    }
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

    const responseTrimmed = htmlToPlainText(editResponse).trim();

    if (responseTrimmed === "") {
      newMessage.emptyResponse = true;
      setValidationMessages(newMessage);
      return;
    }

    try {
      const response = await API.patch(
        `/admin/contactUs/${viewResponseId}/responses/${editResponseId}`,
        {
          message: responseTrimmed,
        }
      );

      if (response.status === 200) {
        // fetchData();
        getResponses(viewResponseId);
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

    const addedRespondTrimmed = htmlToPlainText(addedRespond).trim();

    if (addedRespondTrimmed === "") {
      newMessage.emptyResponse = true;
      setValidationMessages(newMessage);
      return;
    }

    try {
      const response = await API.post(
        `/admin/contactUs/${respondId}/responses`,
        {
          message: addedRespondTrimmed,
          adminId: localStorage.getItem("loggedInAdmin"),
          contactUsId: respondId,
        }
      );

      if (response.status === 201) {
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

  const handleAddRespond = async () => {
    const newMessage = {
      emptyResponse: false,
    };

    const addedRespondTrimmed = htmlToPlainText(addedRespond).trim();

    if (addedRespondTrimmed === "") {
      newMessage.emptyResponse = true;
      setValidationMessages(newMessage);
      return;
    }

    try {
      const response = await API.post(
        `/admin/contactUs/${viewResponseId}/responses`,
        {
          message: addedRespondTrimmed,
          adminId: localStorage.getItem("loggedInAdmin"),
          contactUsId: viewResponseId,
        }
      );

      if (response.status === 201) {
        getResponses(viewResponseId);
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

  const getAdminName = async (adminId) => {
    const response = await API.get(`/admins/${adminId}`);

    return response.data;
  };

  const getResponses = async (id) => {
    const response = await API.get(
      `http://localhost:3000/admin/contactUs/${id}/responses`
    );
    console.log(response.data);

    setResponses(
      response.data.responsesList.sort((a, b) => {
        const timestampA = new Date(a.createdAt).getTime();
        const timestampB = new Date(b.createdAt).getTime();
        return timestampA - timestampB;
      })
    );
  };

  function htmlToPlainText(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return doc.body.textContent || "";
  }

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

      const adminResponse = await API.get(`http://localhost:3000/admins`);
      const admins = adminResponse.data.admins;

      for (const admin of admins) {
        adminNames[admin.adminId] = admin.userName;
      }

      setAdminNames(adminNames);

      const pendingContactus = contactUs.filter(
        (contactus) => contactus.status === "PENDING"
      );

      pendingContactus.sort((a, b) => {
        const timestampA = new Date(a.updatedAt).getTime();
        const timestampB = new Date(b.updatedAt).getTime();
        return timestampB - timestampA;
      });

      setPendingContactus(pendingContactus);

      const repliedContactus = contactUs
        .filter((contactus) => contactus.status === "REPLIED")
        .filter(
          (contactus) =>
            contactus.adminId === parseInt(localStorage.getItem("loggedInAdmin")));
        
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
  }, [responses]);

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
          <div
            style={{ position: "fixed", top: "5%", left: "50%", zIndex: "1" }}
          >
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
                              title="View Responses"
                              style={{
                                backgroundColor: "#FFD700",
                                border: "0",
                                marginRight: "10px",
                              }}
                              onClick={() =>
                                toggleShowViewResponseModal(
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
                            <Button
                              size="sm"
                              title="Close Contact Us"
                              style={{
                                backgroundColor: "#FFD700",
                                border: "0",
                                marginRight: "10px",
                              }}
                              onClick={() =>
                                closeRespond(contactus.contactUsId)
                              }
                            >
                              <MdCurtainsClosed
                                style={{
                                  width: "18px",
                                  height: "18px",
                                  color: "black",
                                }}
                              ></MdCurtainsClosed>
                            </Button>
                            <Button
                              size="sm"
                              title="Preview"
                              style={{
                                backgroundColor: "#FFD700",
                                border: "0",
                                marginRight: "10px",
                              }}
                              onClick={() =>
                                toggleShowPreviewModal(
                                  contactus.title,
                                  contactus.message,
                                  contactus.reason
                                )
                              }
                            >
                              <MdPreview
                                style={{
                                  width: "18px",
                                  height: "18px",
                                  color: "black",
                                }}
                              ></MdPreview>
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
                              title="Preview"
                              style={{
                                backgroundColor: "#FFD700",
                                border: "0",
                                marginRight: "10px",
                              }}
                              onClick={() =>
                                toggleShowPreviewModal(
                                  contactus.title,
                                  contactus.message,
                                  contactus.reason
                                )
                              }
                            >
                              <MdPreview
                                style={{
                                  width: "18px",
                                  height: "18px",
                                  color: "black",
                                }}
                              ></MdPreview>
                            </Button>
                            <Button
                              size="sm"
                              title="View Responses"
                              style={{
                                backgroundColor: "#FFD700",
                                border: "0",
                                marginRight: "10px",
                              }}
                              onClick={() =>
                                toggleShowResponsesModal(contactus.contactUsId)
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
              as="textarea"
              rows={2}
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
            <Form.Group>
              <ReactQuill
                value={addedRespond}
                onChange={setAddedRespond}
                theme="snow"
                className={validationMessages.emptyResponse ? "is-invalid" : ""}
                style={{ width: "29em" }}
                modules={modules}
                formats={formats}
              />
              {validationMessages.emptyResponse && (
                <Form.Control.Feedback type="invalid">
                  Response is required.
                </Form.Control.Feedback>
              )}
            </Form.Group>
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
          show={showPreviewModal}
          onHide={handleClosePreview}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Preview</Modal.Title>
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
                value={previewReason}
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
              value={previewTitle}
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
              as="textarea"
              rows={2}
              name="message"
              value={previewMessage}
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
              onClick={handleClosePreview}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={showViewResponseModal}
          onHide={handleCloseViewRespond}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Responses</Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              maxHeight: "400px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {Array.isArray(responses) && responses.length > 0 ? (
              responses.map((response) => (
                <div style={{ marginBottom: "10px" }}>
                  {response.userId === null ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        float: "right",
                        maxWidth: "60%",
                      }}
                    >
                      <span className="muted-text">
                        {adminNames[response.adminId]}
                      </span>
                      <div className="adminResponse">
                        <TextareaAutosize
                          readOnly
                          style={{
                            borderRadius: "10px",
                            borderColor: "#F5F6F7",
                            backgroundColor: "#FFD88D",
                            resize: "none",
                            overflowY: "auto",
                            padding: "5px",
                          }}
                          value={response.message}
                        />
                        <Button
                          size="sm"
                          title="Edit Response"
                          style={{
                            backgroundColor: "#FFD700",
                            border: "0",
                            marginLeft: "1px",
                          }}
                          onClick={() =>
                            toggleShowEditModal(
                              response.message,
                              response.responseId
                            )
                          }
                        >
                          <MdEditSquare
                            style={{
                              width: "15px",
                              height: "15px",
                              color: "black",
                            }}
                          ></MdEditSquare>
                        </Button>
                      </div>
                      {new Date(response.updatedAt).getTime() !==
                        new Date(response.createdAt).getTime() && (
                        <span className="muted-text">
                          updated at: {response.updatedAt}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        float: "left",
                        maxWidth: "50%",
                      }}
                    >
                      <span className="muted-text">
                        {userNames[response.userId]}
                      </span>
                      <TextareaAutosize
                        readOnly
                        style={{
                          borderRadius: "10px",
                          border: "0",
                          backgroundColor: "#F5F6F7",
                          resize: "none",
                          overflowY: "auto",
                          padding: "5px",
                        }}
                        value={response.message}
                      />
                      {new Date(response.updatedAt).getTime() !==
                        new Date(response.createdAt).getTime() && (
                        <span className="muted-text">
                          updated at: {response.updatedAt}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div>
                <span>No Responses</span>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Form.Group>
              <ReactQuill
                value={addedRespond}
                onChange={setAddedRespond}
                theme="snow"
                className={validationMessages.emptyResponse ? "is-invalid" : ""}
                style={{ width: "29em" }}
                modules={modules}
                formats={formats}
              />
              {validationMessages.emptyResponse && (
                <Form.Control.Feedback type="invalid">
                  Response is required.
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Button
              style={{
                backgroundColor: "#FFD700",
                border: "0",
                width: "120px",
                height: "40px",
                borderRadius: "160px",
                color: "black",
                font: "Public Sans",
                fontWeight: "600",
                fontSize: "13px",
              }}
              onClick={() => handleAddRespond(viewResponseId)}
            >
              Add response
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={showResponsesModal}
          onHide={handleCloseResponses}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Responses</Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              maxHeight: "400px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {Array.isArray(responses) && responses.length > 0 ? (
              responses.map((response) => (
                <div style={{ marginBottom: "10px" }}>
                  {response.userId === null ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        float: "right",
                        maxWidth: "60%",
                      }}
                    >
                      <div className="adminResponse">
                        <TextareaAutosize
                          readOnly
                          style={{
                            borderRadius: "10px",
                            borderColor: "#F5F6F7",
                            backgroundColor: "#FFD88D",
                            // color: "white",
                            resize: "none",
                            overflowY: "auto",
                            padding: "5px",
                          }}
                          value={response.message}
                        />
                      </div>
                      {new Date(response.updatedAt).getTime() !==
                        new Date(response.createdAt).getTime() && (
                        <span className="muted-text">
                          updated at: {response.updatedAt}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        float: "left",
                        maxWidth: "50%",
                      }}
                    >
                      <TextareaAutosize
                        readOnly
                        style={{
                          borderRadius: "10px",
                          border: "0",
                          // color: "white",
                          backgroundColor: "#FFD88D",
                          resize: "none",
                          overflowY: "auto",
                          padding: "5px",
                        }}
                        value={response.message}
                      />
                      {new Date(response.updatedAt).getTime() !==
                        new Date(response.createdAt).getTime() && (
                        <span className="muted-text">
                          updated at: {response.updatedAt}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div>
                <span>No Responses</span>
              </div>
            )}
          </Modal.Body>
        </Modal>
        <Modal
          show={showEditModal}
          onHide={handleCloseEditRespond}
          backdrop="static"
          keyboard={false}
          centered
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
                Response
              </Form.Label>
              <Form.Group>
                <ReactQuill
                  value={editResponse}
                  onChange={setEditResponse}
                  theme="snow"
                  className={
                    validationMessages.emptyResponse ? "is-invalid" : ""
                  }
                  style={{ width: "29em" }}
                  modules={modules}
                  formats={formats}
                />
                {validationMessages.emptyResponse && (
                  <Form.Control.Feedback type="invalid">
                    Response is required.
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </div>
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
              onClick={handleCloseEditRespond}
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
      </div>
    </div>
  );
};

export default ContactUs;
