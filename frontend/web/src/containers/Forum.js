import { React, useState, useEffect } from "react";
import { Button, Table, Modal, Form, Toast, Row, Col } from "react-bootstrap";
import "./styles/Forum.css";
import BreadCrumb from "../components/Common/BreadCrumb.js";
import { MdEditSquare, MdDelete } from "react-icons/md";
import ForumTopicCreate from "./ForumTopicCreate";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import the styles

import API from "../services/API";
import { htmlToPlainText } from "../services/richTextEditor";

import Pagination from "react-bootstrap/Pagination";

const Forum = () => {
  const [forumTopics, setForumTopics] = useState([]);
  const [flaggedForumTopics, setFlaggedForumTopics] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [forumTopicId, setForumTopicId] = useState(0);
  const [forumTopicName, setForumTopicName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditStatusModal, setShowEditStatusModal] = useState(false);
  const [deleteForumTopicId, setDeleteForumTopicId] = useState(0);
  const [editForumTopicId, setEditForumTopicId] = useState(0);

  const ITEMS_PER_PAGE = 4;

  const [currentPageForumTopic, setCurrentPageForumTopic] = useState(1);
  const [totalPageForumTopics, setTotalPageForumTopics] = useState(0);

  const indexOfLastItemForumTopic = currentPageForumTopic * ITEMS_PER_PAGE;
  const indexOfFirstItemForumTopic = indexOfLastItemForumTopic - ITEMS_PER_PAGE;

  const [currentPageFlaggedForumTopic, setCurrentPageFlaggedForumTopic] =
    useState(1);
  const [totalPageFlaggedForumTopics, setTotalPageFlaggedForumTopics] =
    useState(0);

  const indexOfLastItemFlaggedForumTopic =
    currentPageFlaggedForumTopic * ITEMS_PER_PAGE;
  const indexOfFirstItemFlaggedForumTopic =
    indexOfLastItemFlaggedForumTopic - ITEMS_PER_PAGE;

  // toast message
  const [show, setShow] = useState(false);
  const [toastAction, setToastAction] = useState("");

  // validation message
  const [validationMessages, setValidationMessages] = useState({
    emptyForumTopicName: false,
    forumTopicNameUnique: false
  });

  const handlePageChangeForumTopic = (pageNumber) => {
    setCurrentPageForumTopic(pageNumber);
  };

  const handlePageChangeFlaggedForumTopic = (pageNumber) => {
    setCurrentPageFlaggedForumTopic(pageNumber);
  };

  const toggleEditModal = (forumTopicId, topicName) => {
    setShowEditModal(!showEditModal);
    setForumTopicId(forumTopicId);
    setForumTopicName(topicName);
  };

  const toggleDeleteModal = (forumTopicId) => {
    setShowDeleteModal(!showDeleteModal);
    setDeleteForumTopicId(forumTopicId);
  };

  const toggleEditStatusModal = (forumTopicId) => {
    setShowEditStatusModal(!showEditStatusModal);
    setEditForumTopicId(forumTopicId);
  }

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleEditStatusModal = () => {
    setShowEditStatusModal(false);
  }

  const handleClose = () => {
    setShowEditModal(false);
    setValidationMessages({});
  };

  const handleCloseEditStatusModal = () => {
    setShowEditStatusModal(false);
    setValidationMessages({});
  }

  const handleEdit = async () => {
    const newMessage = {
      emptyForumTopicName: false,
      forumTopicNameUnique: false
    };

    const forumTopicNameTrimmed = forumTopicName.trim();

    if (forumTopicNameTrimmed === "") {
      newMessage.emptyForumTopicName = true;
    }

    if (newMessage.emptyForumTopicName) {
      setValidationMessages(newMessage);
      return;
    }

    try {
      // Save to database
      const response = await API.patch(
        `/admin/forumTopics/${forumTopicId}`,
        {
          topicName: forumTopicNameTrimmed
        }
      );

      if (response.status === 200) {
        setValidationMessages(newMessage);
        setForumTopicName("");
        setShowEditModal(false);

        showToast("updated");
      }
    } catch (error) {
      const status = error.response.status;
      if (status === 409) {
        newMessage.forumTopicNameUnique = true;
      }

      setValidationMessages(newMessage);
    }
  };

  const handleEditStatus = async () => {
    await API.patch(`/admin/forumTopics/updateForumTopicStatus/${editForumTopicId}`);
    setShowEditStatusModal(false);
    showToast("updated from 'Inappropriate' to 'Appropriate' status of");
  }

  const handleDelete = async () => {
    await API.delete(`/admin/forumTopics/${deleteForumTopicId}`);
    setShowDeleteModal(false);
    showToast("deleted");
  };

  const showToast = (action) => {
    setToastAction(action);
    setShow(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get(`/admin/forumTopics`);
        const forumTopics = response.data.forumTopics;
        const unflaggedForumTopics = forumTopics.filter(
          (forumTopic) => !forumTopic.isInappropriate
        ).filter((forumTopic) => forumTopic.adminId === parseInt(localStorage.getItem("loggedInAdmin")));
        setForumTopics(unflaggedForumTopics);
        const flaggedForumtopics = forumTopics.filter(
          (forumTopic) => forumTopic.isInappropriate
        );
        flaggedForumtopics.sort((a, b) => {
          const timestampA = new Date(a.updatedAt).getTime();
          const timestampB = new Date(b.updatedAt).getTime();
          return timestampB - timestampA;
        });
        setFlaggedForumTopics(flaggedForumtopics);
        setTotalPageForumTopics(
          Math.ceil(unflaggedForumTopics.length / ITEMS_PER_PAGE)
        );
        setTotalPageFlaggedForumTopics(
          Math.ceil(flaggedForumTopics.length / ITEMS_PER_PAGE)
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [forumTopics]);

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
        <BreadCrumb name="Forum"></BreadCrumb>
      </div>
      <div style={{ position: "fixed", top: "5%", left: "50%", zIndex: "1" }}>
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
              <Toast.Body>{`You have ${toastAction} the Forum Topic successfully!`}</Toast.Body>
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
                padding: "5px 5px 5px 5px",
              }}
            >
              FORUM TOPIC
            </h3>
            <div>
              <div>
                <Table responsive style={{ width: "51em" }}>
                  <thead
                    style={{
                      textAlign: "center",
                    }}
                  >
                    <tr>
                      <th>TOPIC NAME</th>
                      <th>DATE CREATED</th>
                      <th>UPDATED AT</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  {Array.isArray(forumTopics) && forumTopics.length > 0 ? (
                    <tbody>
                      {forumTopics
                        .slice(
                          indexOfFirstItemForumTopic,
                          indexOfLastItemForumTopic
                        )
                        .map((forumTopic) => (
                          <tr
                            key={forumTopic.forumTopicId}
                            style={{
                              textAlign: "center",
                            }}
                          >
                            <td className="truncate-text">
                              {forumTopic.topicName}
                            </td>
                            <td className="truncate-text">
                              {forumTopic.createdAt}
                            </td>
                            <td className="truncate-text">
                              {forumTopic.updatedAt}
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
                                  toggleEditModal(
                                    forumTopic.forumTopicId,
                                    forumTopic.topicName
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
                                onClick={() => toggleDeleteModal(forumTopic.forumTopicId)}
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
                          No Forum Topics available
                        </td>
                      </tr>
                    </tbody>
                  )}
                </Table>
              </div>
              <div>
                <Pagination className="faq-paginate">
                  {Array.from({ length: totalPageForumTopics }).map(
                    (_, index) => (
                      <Pagination.Item
                        key={index}
                        active={index + 1 === currentPageForumTopic}
                        onClick={() => handlePageChangeForumTopic(index + 1)}
                      >
                        {index + 1}
                      </Pagination.Item>
                    )
                  )}
                </Pagination>
              </div>
            </div>
          </div>
          <div className="buyerfaq">
            <h3
              style={{
                color: "black",
                font: "Montserrat",
                fontWeight: "700",
                fontSize: "16px",
                padding: "5px 5px 5px 5px",
              }}
            >
              FLAGGED FORUM TOPIC
            </h3>
            <div>
              <Table hover responsive style={{ width: "51em" }}>
                <thead style={{ textAlign: "center" }}>
                  <tr>
                    <th>FORUM TOPIC</th>
                    <th>DATE CREATED</th>
                    <th>UPDATED AT</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                {Array.isArray(flaggedForumTopics) &&
                  flaggedForumTopics.length > 0 ? (
                  <tbody>
                    {flaggedForumTopics
                      .slice(
                        indexOfFirstItemFlaggedForumTopic,
                        indexOfLastItemFlaggedForumTopic
                      )
                      .map((flaggedForumTopic) => (
                        <tr
                          key={flaggedForumTopics.forumTopicId}
                          style={{
                            textAlign: "center",
                          }}
                        >
                          <td className="truncate-text">
                            {htmlToPlainText(flaggedForumTopic.topicName)}
                          </td>
                          <td className="truncate-text">
                            {flaggedForumTopic.createdAt}
                          </td>
                          <td className="truncate-text">
                            {flaggedForumTopic.updatedAt}
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
                                toggleEditStatusModal(flaggedForumTopic.forumTopicId)
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
                              onClick={() => toggleDeleteModal(flaggedForumTopic.forumTopicId)}
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
                        No Flagged Forum Topics available
                      </td>
                    </tr>
                  </tbody>
                )}
              </Table>
              <div>
                <Pagination className="faq-paginate">
                  {Array.from({ length: totalPageFlaggedForumTopics }).map(
                    (_, index) => (
                      <Pagination.Item
                        key={index}
                        active={index + 1 === currentPageFlaggedForumTopic}
                        onClick={() =>
                          handlePageChangeFlaggedForumTopic(index + 1)
                        }
                      >
                        {index + 1}
                      </Pagination.Item>
                    )
                  )}
                </Pagination>
              </div>
            </div>
          </div>
        </div>
        <ForumTopicCreate showToast={showToast}></ForumTopicCreate>
        <Modal
          show={showEditModal}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Forum Topic</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={{ marginBottom: "10px" }}>
              <Form.Control
                as="textarea"
                rows={5}
                value={forumTopicName}
                onChange={(e) => setForumTopicName(e.target.value)}
                isInvalid={
                  validationMessages.emptyForumTopicName ||
                  validationMessages.forumTopicNameUnique
                }
              />
              {validationMessages.emptyForumTopicName && (
                <Form.Control.Feedback type="invalid">
                  Forum Topic Name is required.
                </Form.Control.Feedback>
              )}
              {validationMessages.forumTopicNameUnique && (
                <Form.Control.Feedback type="invalid">
                  Forum Topic Name already exists. Please type another Forum Topic Name.
                </Form.Control.Feedback>
              )}
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
            <Modal.Title>Delete Forum Topic</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this Forum Topic?</p>
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
        <Modal
          show={showEditStatusModal}
          onHide={handleEditStatusModal}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Update Status of Forum Topic</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to update the status to "Appropriate" for this Forum Topic?</p>
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
              onClick={handleCloseEditStatusModal}
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
              onClick={() => handleEditStatus()}
            >
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Forum;
