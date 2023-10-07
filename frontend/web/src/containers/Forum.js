import { React, useState, useEffect } from "react";
import { Button, Table, Modal, Form, Toast, Row, Col } from "react-bootstrap";
import "./styles/Forum.css";
import BreadCrumb from "../components/Common/BreadCrumb.js";
import { MdEditSquare, MdDelete } from "react-icons/md";
import FaqCreate from "./FaqCreate.js";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import the styles

import API from "../services/API";
import { htmlToPlainText } from "../services/richTextEditor";

import Pagination from "react-bootstrap/Pagination";

const Forum = () => {
  const [forumTopics, setForumTopics] = useState([]);
  const [flaggedForumTopics, setFlaggedForumTopics] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [faqId, setFaqId] = useState(0);
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [faqType, setFaqType] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteFaqId, setDeleteFaqId] = useState(0);

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
    emptyFaqType: false,
    emptyFaqQuestion: false,
    emptyFaqAnswer: false,
    faqQuestionUnique: false,
  });

  const handlePageChangeForumTopic = (pageNumber) => {
    setCurrentPageForumTopic(pageNumber);
  };

  const handlePageChangeFlaggedForumTopic = (pageNumber) => {
    setCurrentPageFlaggedForumTopic(pageNumber);
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
    setValidationMessages({});
  };

  //   const handleEdit = async () => {
  //     //edit faq in database
  //     const newMessage = {
  //       emptyFaqQuestion: false,
  //       emptyFaqAnswer: false,
  //       faqQuestionUnique: false,
  //     };

  //     const questionTrimmed = htmlToPlainText(faqQuestion).trim();
  //     const answerTrimmed = htmlToPlainText(faqAnswer).trim();

  //     if (questionTrimmed === "") {
  //       newMessage.emptyFaqQuestion = true;
  //     }

  //     if (answerTrimmed === "") {
  //       newMessage.emptyFaqAnswer = true;
  //     }

  //     if (newMessage.emptyFaqQuestion || newMessage.emptyFaqAnswer) {
  //       setValidationMessages(newMessage);
  //       return;
  //     }

  //     try {
  //       // Save to database
  //       const response = await API.patch(
  //         `/admin/faqs/${faqId}?adminId=${localStorage.getItem("loggedInAdmin")}`,
  //         {
  //           question: faqQuestion,
  //           answer: faqAnswer,
  //           faqType,
  //         }
  //       );

  //       if (response.status === 200) {
  //         setValidationMessages(newMessage);
  //         setFaqType("");
  //         setFaqQuestion("");
  //         setFaqAnswer("");
  //         setShowEditModal(false);

  //         showToast("updated");
  //       }
  //     } catch (error) {
  //       const status = error.response.status;
  //       if (status === 409) {
  //         newMessage.faqQuestionUnique = true;
  //       }

  //       setValidationMessages(newMessage);
  //     }
  //   };

  //   const handleDelete = async () => {
  //     //delete faq from database. Use the value of the useState deleteFaqId for the faqId
  //     await API.delete(`/admin/faqs/${deleteFaqId}`);
  //     setShowDeleteModal(false);
  //     showToast("deleted");
  //   };

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
        );
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
          marginTop: "10px",
          marginLeft: "30px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <BreadCrumb
          names={["Home"]}
          lastname="Forum"
          links={["/"]}
        ></BreadCrumb>
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
                padding: "5px 5px 5px 5px",
              }}
            >
              UNFLAGGED FORUM TOPIC
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
                              {htmlToPlainText(forumTopic.topicName)}
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
                                // onClick={() =>
                                //   toggleEditModal(
                                //     faq.faqId,
                                //     htmlToPlainText(faq.question),
                                //     htmlToPlainText(faq.answer),
                                //     faq.faqType
                                //   )
                                // }
                              >
                                <MdEditSquare
                                  style={{
                                    width: "18px",
                                    height: "18px",
                                    color: "black",
                                  }}
                                ></MdEditSquare>
                              </Button>
                              {/* <Button
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
                              </Button> */}
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
                              //   onClick={() =>
                              //     toggleEditModal(
                              //       faq.faqId,
                              //       htmlToPlainText(faq.question),
                              //       htmlToPlainText(faq.answer),
                              //       faq.faqType
                              //     )
                              //   }
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
                              //   onClick={() => toggleDeleteModal(faq.faqId)}
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
        <FaqCreate showToast={showToast}></FaqCreate>
        {/* <Modal
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
            <Form.Group>
              <ReactQuill
                value={faqQuestion}
                onChange={setFaqQuestion}
                theme="snow"
                className={
                  validationMessages.emptyFaqQuestion ||
                  validationMessages.faqQuestionUnique
                    ? "is-invalid"
                    : ""
                }
              />
              {validationMessages.emptyFaqQuestion && (
                <Form.Control.Feedback type="invalid">
                  Question is required.
                </Form.Control.Feedback>
              )}
              {validationMessages.faqQuestionUnique && (
                <Form.Control.Feedback type="invalid">
                  Question already exists. Please type another question.
                </Form.Control.Feedback>
              )}
            </Form.Group>
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
            <Form.Group>
              <ReactQuill
                value={faqAnswer}
                onChange={setFaqAnswer}
                theme="snow"
                className={
                  validationMessages.emptyFaqAnswer ? "is-invalid" : ""
                }
              />
              {validationMessages.emptyFaqAnswer && (
                <Form.Control.Feedback type="invalid">
                  Answer is required.
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
        </Modal> */}
      </div>
    </div>
  );
};

export default Forum;
