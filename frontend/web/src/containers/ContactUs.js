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
  const [showCloseContactUsModal, setShowCloseContactUsModal] = useState(false);

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
  const [closeContactUsId, setCloseContactUsId] = useState(0);
  const [userId, setUserId] = useState(0);
  const [createdAt, setCreatedAt] = useState();
  const [updatedAt, setUpdatedAt] = useState();

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
    emptyEditResponse: false,
    emptyAddResponse: false,
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

  const toggleShowViewResponseModal = (
    id,
    message,
    userId,
    createdAt,
    updatedAt
  ) => {
    setViewResponseId(id);
    setRespondMessage(message);
    setUserId(userId);
    setCreatedAt(createdAt);
    setUpdatedAt(updatedAt);
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

  const toggleShowCloseContactUsModal = (id) => {
    setShowCloseContactUsModal(true);
    setCloseContactUsId(id);
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
    setAddedRespond("");
  };

  const handleCloseResponses = () => {
    setShowResponsesModal(false);
    setValidationMessages({});
  };

  const handleCloseEditRespond = () => {
    setShowEditModal(false);
    setValidationMessages({});
  };

  const handleCloseContactUsModal = () => {
    setShowCloseContactUsModal(false);
  };

  const closeRespond = async () => {
    //change the status of this contact us to "CLOSED"
    try {
      const response = await API.patch(`/admin/contactUs/${closeContactUsId}`);

      if (response.status === 200) {
        setShowCloseContactUsModal(false);
        fetchData();
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
      emptyEditResponse: false,
      emptyAddResponse: false,
    };

    const responseTrimmed = editResponse.trim();

    if (responseTrimmed === "") {
      newMessage.emptyEditResponse = true;
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

    const addedRespondTrimmed = addedRespond.trim();

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
      emptyAddResponse: false,
      emptyEditResponse: false,
    };

    const addedRespondTrimmed = addedRespond.trim();

    if (addedRespondTrimmed === "") {
      newMessage.emptyAddResponse = true;
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
            contactus.adminId ===
            parseInt(localStorage.getItem("loggedInAdmin"))
        );

      repliedContactus.sort((a, b) => {
        const timestampA = new Date(a.updatedAt).getTime();
        const timestampB = new Date(b.updatedAt).getTime();
        return timestampB - timestampA;
      });

      setRepliedContactus(repliedContactus);

      const closedContactus = contactUs
        .filter((contactus) => contactus.status === "CLOSED")
        .filter(
          (contactus) =>
            contactus.adminId ===
            parseInt(localStorage.getItem("loggedInAdmin"))
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

  const sanitizeEditResponse = (content) => {
    const sanitizedContent = content
      .replace(/<u>\s<\/u>/g, " ")
      .replace(/<b>\s<\/b>/g, " ")
      .replace(/<i>\s<\/i>/g, " ");

    setEditResponse(sanitizedContent);
  };

  const sanitizeAddedResponse = (content) => {
    const sanitizedContent = content
      .replace(/<u>\s<\/u>/g, " ")
      .replace(/<b>\s<\/b>/g, " ")
      .replace(/<i>\s<\/i>/g, " ");

    setAddedRespond(sanitizedContent);
  };

  return (
    <div className="contactus">
      <div
        style={{
          marginTop: "10px",
          marginLeft: "30px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <BreadCrumb
          names={["Home"]}
          lastname="Contact us"
          links={["/"]}
        ></BreadCrumb>
      </div>
      <div style={{ display: "flex", marginTop: "10px" }}>
        <div className="displayContactus">
          <div
            style={{
              position: "absolute",
              top: "1%",
              left: "40%",
              zIndex: "1",
            }}
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
                          <td className="truncate-text-cs">
                            {contactus.title}
                          </td>
                          <td className="truncate-text-cs">
                            {contactus.message}
                          </td>
                          <td className="truncate-text-cs">
                            {contactus.reason}
                          </td>
                          <td>{contactus.createdAt}</td>
                          <td>{userNames[contactus.userId]}</td>
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
                          <td className="truncate-text-cs">
                            {contactus.title}
                          </td>
                          <td className="truncate-text-cs">
                            {contactus.message}
                          </td>
                          <td className="truncate-text-cs">
                            {contactus.reason}
                          </td>
                          <td>{contactus.createdAt}</td>
                          <td>{contactus.updatedAt}</td>
                          <td>{userNames[contactus.userId]}</td>
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
                                  contactus.contactUsId,
                                  contactus.message,
                                  contactus.userId,
                                  contactus.createdAt,
                                  contactus.updatedAt
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
                                toggleShowCloseContactUsModal(
                                  contactus.contactUsId
                                )
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
                          <td className="truncate-text-cs">
                            {contactus.title}
                          </td>
                          <td className="truncate-text-cs">
                            {contactus.message}
                          </td>
                          <td className="truncate-text-cs">
                            {contactus.reason}
                          </td>
                          <td>{contactus.createdAt}</td>
                          <td>{contactus.updatedAt}</td>
                          <td>{userNames[contactus.userId]}</td>
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
            <Modal.Title style={{ fontSize: "20px" }}>Respond</Modal.Title>
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
                onChange={sanitizeAddedResponse}
                theme="snow"
                className={
                  validationMessages.emptyAddResponse ? "is-invalid" : ""
                }
                style={{ width: "29em" }}
                modules={modules}
                formats={formats}
              />
              {validationMessages.emptyAddResponse && (
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
            <Modal.Title style={{ fontSize: "20px" }}>Preview</Modal.Title>
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
            <Modal.Title style={{ fontSize: "20px" }}>Responses</Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              maxHeight: "400px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                float: "left",
                maxWidth: "50%",
                marginBottom: "20px",
              }}
            >
              <span className="muted-text" style={{ alignSelf: "flex-start" }}>
                {userNames[userId]}
              </span>
              <TextareaAutosize
                readOnly
                style={{
                  borderRadius: "10px",
                  border: "0",
                  backgroundColor: "#FFCB85",
                  resize: "none",
                  overflowY: "auto",
                  padding: "5px",
                  fontSize: "15px",
                  minWidth: "250px",
                }}
                value={respondMessage}
              />
              <span className="muted-text" style={{ alignSelf: "flex-start" }}>
                created at: {createdAt}
              </span>
              {new Date(updatedAt).getTime() !==
                new Date(createdAt).getTime() && (
                <span
                  className="muted-text"
                  style={{ alignSelf: "flex-start" }}
                >
                  updated at: {updatedAt}
                </span>
              )}
            </div>
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
                        marginBottom: "20px",
                      }}
                    >
                      <span
                        className="muted-text"
                        style={{ alignSelf: "flex-end", marginRight: "3.5em" }}
                      >
                        {adminNames[response.adminId]}
                      </span>
                      <div className="adminResponse">
                        <div
                          style={{
                            borderRadius: "10px",
                            border: "0",
                            backgroundColor: "#EECEA3",
                            resize: "none",
                            overflowY: "auto",
                            padding: "5px",
                            fontSize: "15px",
                            minWidth: "220px",
                          }}
                          dangerouslySetInnerHTML={{ __html: response.message }}
                        ></div>
                        <Button
                          size="sm"
                          title="Edit Response"
                          style={{
                            background: "transparent",
                            border: "0",
                            marginLeft: "0.2em",
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
                              width: "16px",
                              height: "16px",
                              color: "black",
                            }}
                          ></MdEditSquare>
                        </Button>
                      </div>
                      <span
                        className="muted-text"
                        style={{ alignSelf: "flex-end", marginRight: "3.5em" }}
                      >
                        created at: {response.createdAt}
                      </span>
                      {new Date(response.updatedAt).getTime() !==
                        new Date(response.createdAt).getTime() && (
                        <span
                          className="muted-text"
                          style={{
                            alignSelf: "flex-end",
                            marginRight: "3.5em",
                          }}
                        >
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
                        marginBottom: "20px",
                      }}
                    >
                      <span
                        className="muted-text"
                        style={{ alignSelf: "flex-start" }}
                      >
                        {userNames[response.userId]}
                      </span>
                      <TextareaAutosize
                        readOnly
                        style={{
                          borderRadius: "10px",
                          border: "0",
                          backgroundColor: "#FFCB85",
                          resize: "none",
                          overflowY: "auto",
                          padding: "5px",
                          fontSize: "15px",
                          minWidth: "250px",
                        }}
                        value={response.message}
                      />
                      <span
                        className="muted-text"
                        style={{ alignSelf: "flex-start" }}
                      >
                        created at: {response.createdAt}
                      </span>
                      {new Date(response.updatedAt).getTime() !==
                        new Date(response.createdAt).getTime() && (
                        <span
                          className="muted-text"
                          style={{ alignSelf: "flex-start" }}
                        >
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
                onChange={sanitizeAddedResponse}
                theme="snow"
                className={
                  validationMessages.emptyAddResponse ? "is-invalid" : ""
                }
                style={{ width: "29em" }}
                modules={modules}
                formats={formats}
              />
              {validationMessages.emptyAddResponse && (
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
                fontWeight: "500",
                fontSize: "14px",
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
            <Modal.Title style={{ fontSize: "20px" }}>Responses</Modal.Title>
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
            <Modal.Title style={{ fontSize: "20px" }}>
              Edit Response
            </Modal.Title>
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
                  onChange={sanitizeEditResponse}
                  theme="snow"
                  className={
                    validationMessages.emptyEditResponse ? "is-invalid" : ""
                  }
                  style={{ width: "29em" }}
                  modules={modules}
                  formats={formats}
                />
                {validationMessages.emptyEditResponse && (
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
        <Modal
          show={showCloseContactUsModal}
          onHide={handleCloseContactUsModal}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: "20px" }}>
              Confirmation of Contact Us
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to close the following contact us?</p>
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
              onClick={handleCloseContactUsModal}
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
              onClick={() => closeRespond()}
            >
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default ContactUs;
