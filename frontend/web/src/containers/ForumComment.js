import { React, useState, useEffect } from "react";
import { Carousel, Button, Table, Modal, Toast, Row, Col } from "react-bootstrap";
import "./styles/Forum.css";
import { IoMdFlag } from "react-icons/io";
import { LuFlagOff } from "react-icons/lu";
import "react-quill/dist/quill.snow.css";
import socketIOClient from 'socket.io-client';

import API from "../services/API";

import Pagination from "react-bootstrap/Pagination";

const ForumComment = () => {
    const [flaggedForumComments, setFlaggedForumComments] = useState([]);
    const [inappropriateForumComments, setInappropriateForumComments] = useState([]);
    const [showEditStatusModal, setShowEditStatusModal] = useState(false);
    const [editForumComment, setEditForumComment] = useState(0);
    const [showResetInapprorpiateForumCommentModal, setShowResetInapprorpiateForumCommentModal] = useState(false);
    const [appropriateForumComment, setAppropriateForumComment] = useState(0);

    const ITEMS_PER_PAGE = 4;

    const [currentPageFlaggedForumComment, setCurrentPageFlaggedForumComment] =
        useState(1);
    const [totalPageFlaggedForumComments, setTotalPageFlaggedForumComments] =
        useState(0);

    const indexOfLastItemFlaggedForumComment =
        currentPageFlaggedForumComment * ITEMS_PER_PAGE;
    const indexOfFirstItemFlaggedForumComment =
        indexOfLastItemFlaggedForumComment - ITEMS_PER_PAGE;

    const [currentPageInappropriateForumComment, setCurrentPageInappropriateForumComment] =
        useState(1);
    const [totalPageInappropriateForumComments, setTotalPageInappropriateForumComments] =
        useState(0);

    const indexOfLastItemInappropriateForumComment =
        currentPageInappropriateForumComment * ITEMS_PER_PAGE;
    const indexOfFirstItemInappropriateForumComment =
        indexOfLastItemInappropriateForumComment - ITEMS_PER_PAGE;

    // toast message
    const [show, setShow] = useState(false);
    const [toastAction, setToastAction] = useState("");

    const handlePageChangeFlaggedForumComment = (pageNumber) => {
        setCurrentPageFlaggedForumComment(pageNumber);
    };

    const handlePageChangeInappropriateForumComment = (pageNumber) => {
        setCurrentPageInappropriateForumComment(pageNumber);
    };

    const toggleEditStatusModal = (forumComment) => {
        setShowEditStatusModal(!showEditStatusModal);
        setEditForumComment(forumComment);
    };

    const toggleAppropriateForumCommentStatusModal = (forumComment) => {
        setShowResetInapprorpiateForumCommentModal(!showResetInapprorpiateForumCommentModal);
        setAppropriateForumComment(forumComment);
    }

    const handleEditStatusModal = () => {
        setShowEditStatusModal(false);
    };

    const handleResetInappropriateForumCommentModal = () => {
        setShowResetInapprorpiateForumCommentModal(false);
    }

    const handleEditStatus = async (typeOfResponse) => {
        const forumCommentId = editForumComment.forumComment.forumCommentId;
        await API.patch(
            `/admin/forumComments/updateForumCommentStatus/${forumCommentId}`,
            {
                adminId: localStorage.getItem("loggedInAdmin"),
                typeOfResponse: typeOfResponse,
            }
        );
        setShowEditStatusModal(false);
        showToast(
            `mark as ${typeOfResponse === "no" ? "appropriate" : "inappropriate"} of`
        );
        fetchData();
    };

    const handleResetForumCommentToAppropriate = async () => {
        const forumCommentId = appropriateForumComment.forumComment.forumCommentId;
        await API.patch(`/admin/forumComments/resetAppropriateForumComment/${forumCommentId}`, {
            adminId: localStorage.getItem("loggedInAdmin")
        });
        setShowResetInapprorpiateForumCommentModal(false);
        showToast("reset back to Appropriate of");
        fetchData();
    };

    const showToast = (action) => {
        setToastAction(action);
        setShow(true);
    };

    const fetchData = async () => {
        try {
            const response = await API.get(`/admin/forumComments/getFlaggedForumComments`);
            const flaggedForumComments = response.data.filter(
                (forumComment) =>
                    forumComment.totalFlagged > 0 && !forumComment.forumComment.isInappropriate
            );
            flaggedForumComments.sort((a, b) => b.totalFlagged - a.totalFlagged);
            setFlaggedForumComments(flaggedForumComments);
            setTotalPageFlaggedForumComments(
                Math.ceil(flaggedForumComments.length / ITEMS_PER_PAGE)
            );

            const inappropriateForumcomments = response.data.filter((forumComment) => forumComment.forumComment.isInappropriate);
            setInappropriateForumComments(inappropriateForumcomments);
            setTotalPageInappropriateForumComments(
                Math.ceil(inappropriateForumcomments.length / ITEMS_PER_PAGE)
            );
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();

        const socket = socketIOClient("http://localhost:3000");

        socket.on("newFlaggedForumCommentNotification", () => {
            fetchData();
        });

        socket.on("newRemoveFlaggedForumCommentNotification", () => {
            fetchData();
        });
    }, []);

    return (
        <div>
            <div
                style={{ position: "absolute", top: "1%", left: "40%", zIndex: "1" }}
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
                            <Toast.Body>{`You have ${toastAction} the Forum Comment successfully!`}</Toast.Body>
                        </Toast>
                    </Col>
                </Row>
            </div>
            <div style={{ display: "flex", marginTop: "20px" }}>
                <div className="displayfaq">
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
                            FLAGGED FORUM COMMENT
                        </h3>
                        <div>
                            <Table hover responsive style={{ width: "51em" }}>
                                <thead style={{ textAlign: "center" }}>
                                    <tr>
                                        <th>MESSAGE</th>
                                        <th>TOTAL FLAGGED</th>
                                        <th>ACTION</th>
                                    </tr>
                                </thead>
                                {Array.isArray(flaggedForumComments) &&
                                    flaggedForumComments.length > 0 ? (
                                    <tbody>
                                        {flaggedForumComments
                                            .slice(
                                                indexOfFirstItemFlaggedForumComment,
                                                indexOfLastItemFlaggedForumComment
                                            )
                                            .map((flaggedForumComment) => (
                                                <tr
                                                    key={flaggedForumComment.forumComment.forumCommentId}
                                                    style={{
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    <td className="truncate-text-forum">
                                                        {flaggedForumComment.forumComment.message == "" ? "No message" : flaggedForumComment.forumComment.message}
                                                    </td>
                                                    <td className="truncate-text-forum">
                                                        {flaggedForumComment.totalFlagged}
                                                    </td>
                                                    <td>
                                                        <Button
                                                            size="sm"
                                                            title="Flag Forum Comment as Appropriate/Inappropriate"
                                                            style={{
                                                                backgroundColor: "#FFD700",
                                                                border: "0",
                                                                marginRight: "10px",
                                                            }}
                                                            onClick={() =>
                                                                toggleEditStatusModal(
                                                                    flaggedForumComment
                                                                )
                                                            }
                                                        >
                                                            <IoMdFlag
                                                                style={{
                                                                    width: "18px",
                                                                    height: "18px",
                                                                    color: "black",
                                                                }}
                                                            ></IoMdFlag>
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                ) : (
                                    <tbody>
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: "center" }}>
                                                No Flagged Forum Comments available
                                            </td>
                                        </tr>
                                    </tbody>
                                )}
                            </Table>
                            <div>
                                <Pagination className="faq-paginate">
                                    {Array.from({ length: totalPageFlaggedForumComments }).map(
                                        (_, index) => (
                                            <Pagination.Item
                                                key={index}
                                                active={index + 1 === currentPageFlaggedForumComment}
                                                onClick={() =>
                                                    handlePageChangeFlaggedForumComment(index + 1)
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
                    <br />
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
                            INAPPROPRIATE FORUM COMMENT
                        </h3>
                        <div>
                            <Table hover responsive style={{ width: "51em" }}>
                                <thead style={{ textAlign: "center" }}>
                                    <tr>
                                        <th>MESSAGE</th>
                                        <th>ACTION</th>
                                    </tr>
                                </thead>
                                {Array.isArray(inappropriateForumComments) &&
                                    inappropriateForumComments.length > 0 ? (
                                    <tbody>
                                        {inappropriateForumComments
                                            .slice(
                                                indexOfFirstItemInappropriateForumComment,
                                                indexOfLastItemInappropriateForumComment
                                            )
                                            .map((inappropriateForumComment) => (
                                                <tr
                                                    key={inappropriateForumComment.forumComment.forumCommentId}
                                                    style={{
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    <td className="truncate-text">
                                                        {inappropriateForumComment.forumComment.message == "" ? "No message" : inappropriateForumComment.forumComment.message}
                                                    </td>
                                                    <td>
                                                        <Button
                                                            size="sm"
                                                            title="Reset Inappropriate Forum Comment to Appropriate"
                                                            style={{
                                                                backgroundColor: "#FFD700",
                                                                border: "0",
                                                                marginRight: "10px",
                                                            }}
                                                            onClick={() =>
                                                                toggleAppropriateForumCommentStatusModal(inappropriateForumComment)
                                                            }
                                                        >
                                                            <LuFlagOff
                                                                style={{
                                                                    width: "18px",
                                                                    height: "18px",
                                                                    color: "black",
                                                                }}
                                                            ></LuFlagOff>
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                ) : (
                                    <tbody>
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: "center" }}>
                                                No Inappropriate Forum Comments available
                                            </td>
                                        </tr>
                                    </tbody>
                                )}
                            </Table>
                            <div>
                                <Pagination className="faq-paginate">
                                    {Array.from({ length: totalPageInappropriateForumComments }).map(
                                        (_, index) => (
                                            <Pagination.Item
                                                key={index}
                                                active={index + 1 === currentPageInappropriateForumComment}
                                                onClick={() =>
                                                    handlePageChangeInappropriateForumComment(index + 1)
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
                <Modal
                    show={showEditStatusModal}
                    onHide={handleEditStatusModal}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Appropriate/Inappropriate Forum Comment</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {editForumComment && (
                            <div>
                                <p>Are you sure this Forum Comment is inappropriate?</p>
                                <p><strong>Topic:</strong> {editForumComment.forumTopic.topicName}</p>
                                <p><strong>Post Title:</strong> {editForumComment.forumPost.title}</p>
                                <p><strong>Comment Message:</strong> {editForumComment.forumComment.message == "" ? "No message" : editForumComment.forumComment.message}</p>
                                <p><strong>Comment Photo(s):</strong> {editForumComment.images.length === 0 && "No photos shown"}</p>
                                {Array.isArray(editForumComment.images) && editForumComment.images.length > 0 && (
                                    <div style={{
                                        display: "flex",
                                    }}>
                                        <Carousel
                                            style={{
                                                width: "600px",
                                                height: "350px",
                                            }}
                                        >
                                            {Array.isArray(editForumComment.images) && editForumComment.images.length > 0 && (
                                                editForumComment.images.map((image) => {
                                                    return (
                                                        <Carousel.Item key={image}>
                                                            <img
                                                                style={{
                                                                    width: "100%",
                                                                    height: "100%",
                                                                    objectFit: "cover",
                                                                    opacity: 0.9
                                                                }}
                                                                src={`http://localhost:3000/image/${image.toString()}`}
                                                                alt="forum comment"
                                                            />
                                                        </Carousel.Item>
                                                    );
                                                })
                                            )}
                                        </Carousel>
                                    </div>
                                )}
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
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
                            onClick={() => handleEditStatus("no")}
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
                            onClick={() => handleEditStatus("yes")}
                        >
                            Yes
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal
                    show={showResetInapprorpiateForumCommentModal}
                    onHide={handleResetInappropriateForumCommentModal}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Appropriate Forum Comment</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {appropriateForumComment && (
                            <div>
                                <p>Reset the current forum comment to Appropriate?</p>
                                <p><strong>Topic:</strong> {appropriateForumComment.forumTopic.topicName}</p>
                                <p><strong>Post Title:</strong> {appropriateForumComment.forumPost.title}</p>
                                <p><strong>Comment Message:</strong> {appropriateForumComment.forumComment.message == "" ? "No message" : appropriateForumComment.forumComment.message}</p>
                                <p><strong>Comment Photo(s):</strong> {appropriateForumComment.images.length === 0 && "No photos shown"}</p>
                                {Array.isArray(appropriateForumComment.images) && appropriateForumComment.images.length > 0 && (
                                    <div style={{
                                        display: "flex",
                                    }}>
                                        <Carousel
                                            style={{
                                                width: "600px",
                                                height: "350px",
                                            }}
                                        >
                                            {Array.isArray(appropriateForumComment.images) && appropriateForumComment.images.length > 0 && (
                                                appropriateForumComment.images.map((image) => {
                                                    return (
                                                        <Carousel.Item key={image}>
                                                            <img
                                                                style={{
                                                                    width: "100%",
                                                                    height: "100%",
                                                                    objectFit: "cover",
                                                                    opacity: 0.9
                                                                }}
                                                                src={`http://localhost:3000/image/${image.toString()}`}
                                                                alt="forum comment"
                                                            />
                                                        </Carousel.Item>
                                                    );
                                                })
                                            )}
                                        </Carousel>
                                    </div>
                                )}
                            </div>
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
                            onClick={handleResetInappropriateForumCommentModal}
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
                            onClick={() => handleResetForumCommentToAppropriate()}
                        >
                            Yes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default ForumComment;
