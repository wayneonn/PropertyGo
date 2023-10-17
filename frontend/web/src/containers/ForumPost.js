import { React, useState, useEffect } from "react";
import { Carousel, Button, Table, Modal, Toast, Row, Col } from "react-bootstrap";
import "./styles/Forum.css";
import { IoMdFlag } from "react-icons/io";
import { LuFlagOff } from "react-icons/lu";
import "react-quill/dist/quill.snow.css";
import socketIOClient from 'socket.io-client';

import API from "../services/API";

import Pagination from "react-bootstrap/Pagination";

const ForumPost = () => {
    const [flaggedForumPosts, setFlaggedForumPosts] = useState([]);
    const [inappropriateForumPosts, setInappropriateForumPosts] = useState([]);
    const [showEditStatusModal, setShowEditStatusModal] = useState(false);
    const [editForumPost, setEditForumPost] = useState(0);
    const [showResetInapprorpiateForumPostModal, setShowResetInapprorpiateForumPostModal] = useState(false);
    const [appropriateForumPost, setAppropriateForumPost] = useState(0);

    const ITEMS_PER_PAGE = 4;

    const [currentPageFlaggedForumPost, setCurrentPageFlaggedForumPost] =
        useState(1);
    const [totalPageFlaggedForumPosts, setTotalPageFlaggedForumPosts] =
        useState(0);

    const indexOfLastItemFlaggedForumPost =
        currentPageFlaggedForumPost * ITEMS_PER_PAGE;
    const indexOfFirstItemFlaggedForumPost =
        indexOfLastItemFlaggedForumPost - ITEMS_PER_PAGE;

    const [currentPageInappropriateForumPost, setCurrentPageInappropriateForumPost] =
        useState(1);
    const [totalPageInappropriateForumPosts, setTotalPageInappropriateForumPosts] =
        useState(0);

    const indexOfLastItemInappropriateForumPost =
        currentPageInappropriateForumPost * ITEMS_PER_PAGE;
    const indexOfFirstItemInappropriateForumPost =
        indexOfLastItemInappropriateForumPost - ITEMS_PER_PAGE;

    // toast message
    const [show, setShow] = useState(false);
    const [toastAction, setToastAction] = useState("");

    const handlePageChangeFlaggedForumPost = (pageNumber) => {
        setCurrentPageFlaggedForumPost(pageNumber);
    };

    const handlePageChangeInappropriateForumPost = (pageNumber) => {
        setCurrentPageInappropriateForumPost(pageNumber);
    };

    const toggleEditStatusModal = (forumPost) => {
        setShowEditStatusModal(!showEditStatusModal);
        setEditForumPost(forumPost);
    };

    const toggleAppropriateForumPostStatusModal = (forumPost) => {
        setShowResetInapprorpiateForumPostModal(!showResetInapprorpiateForumPostModal);
        setAppropriateForumPost(forumPost);
    }

    const handleEditStatusModal = () => {
        setShowEditStatusModal(false);
    };

    const handleResetInappropriateForumPostModal = () => {
        setShowResetInapprorpiateForumPostModal(false);
    }

    const handleEditStatus = async (typeOfResponse) => {
        const forumPostId = editForumPost.forumPost.forumPostId;
        await API.patch(
            `/admin/forumPosts/updateForumPostStatus/${forumPostId}`,
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

    const handleResetForumPostToAppropriate = async () => {
        const forumPostId = appropriateForumPost.forumPost.forumPostId;
        await API.patch(`/admin/forumPosts/resetAppropriateForumPost/${forumPostId}`, {
            adminId: localStorage.getItem("loggedInAdmin")
        });
        setShowResetInapprorpiateForumPostModal(false);
        showToast("reset back to Appropriate of");
        fetchData();
    };

    const showToast = (action) => {
        setToastAction(action);
        setShow(true);
    };

    const fetchData = async () => {
        try {
            const response = await API.get(`/admin/forumPosts/getFlaggedForumPosts`);
            const flaggedForumPosts = response.data.filter(
                (forumPost) =>
                    forumPost.totalFlagged > 0 && !forumPost.forumPost.isInappropriate
            );
            flaggedForumPosts.sort((a, b) => b.totalFlagged - a.totalFlagged);
            setFlaggedForumPosts(flaggedForumPosts);
            setTotalPageFlaggedForumPosts(
                Math.ceil(flaggedForumPosts.length / ITEMS_PER_PAGE)
            );

            const inappropriateForumposts = response.data.filter((forumPost) => forumPost.forumPost.isInappropriate);
            console.log(inappropriateForumposts);
            setInappropriateForumPosts(inappropriateForumposts);
            setTotalPageInappropriateForumPosts(
                Math.ceil(inappropriateForumposts.length / ITEMS_PER_PAGE)
            );
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();

        const socket = socketIOClient("http://localhost:3000");

        socket.on("newFlaggedForumPostNotification", () => {
            fetchData();
        });

        socket.on("newRemoveFlaggedForumPostNotification", () => {
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
                            <Toast.Body>{`You have ${toastAction} the Forum Post successfully!`}</Toast.Body>
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
                            FLAGGED FORUM POST
                        </h3>
                        <div>
                            <Table hover responsive style={{ width: "51em" }}>
                                <thead style={{ textAlign: "center" }}>
                                    <tr>
                                        <th>TITLE</th>
                                        <th>TOTAL FLAGGED</th>
                                        <th>ACTION</th>
                                    </tr>
                                </thead>
                                {Array.isArray(flaggedForumPosts) &&
                                    flaggedForumPosts.length > 0 ? (
                                    <tbody>
                                        {flaggedForumPosts
                                            .slice(
                                                indexOfFirstItemFlaggedForumPost,
                                                indexOfLastItemFlaggedForumPost
                                            )
                                            .map((flaggedForumPost) => (
                                                <tr
                                                    key={flaggedForumPost.forumPost.forumPostId}
                                                    style={{
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    <td className="truncate-text-forum">
                                                        {flaggedForumPost.forumPost.title}
                                                    </td>
                                                    <td className="truncate-text-forum">
                                                        {flaggedForumPost.totalFlagged}
                                                    </td>
                                                    <td>
                                                        <Button
                                                            size="sm"
                                                            title="Flag Forum Post as Appropriate/Inappropriate"
                                                            style={{
                                                                backgroundColor: "#FFD700",
                                                                border: "0",
                                                                marginRight: "10px",
                                                            }}
                                                            onClick={() =>
                                                                toggleEditStatusModal(
                                                                    flaggedForumPost
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
                                                No Flagged Forum Posts available
                                            </td>
                                        </tr>
                                    </tbody>
                                )}
                            </Table>
                            <div>
                                <Pagination className="faq-paginate">
                                    {Array.from({ length: totalPageFlaggedForumPosts }).map(
                                        (_, index) => (
                                            <Pagination.Item
                                                key={index}
                                                active={index + 1 === currentPageFlaggedForumPost}
                                                onClick={() =>
                                                    handlePageChangeFlaggedForumPost(index + 1)
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
                            INAPPROPRIATE FORUM POST
                        </h3>
                        <div>
                            <Table hover responsive style={{ width: "51em" }}>
                                <thead style={{ textAlign: "center" }}>
                                    <tr>
                                        <th>TITLE</th>
                                        <th>ACTION</th>
                                    </tr>
                                </thead>
                                {Array.isArray(inappropriateForumPosts) &&
                                    inappropriateForumPosts.length > 0 ? (
                                    <tbody>
                                        {inappropriateForumPosts
                                            .slice(
                                                indexOfFirstItemInappropriateForumPost,
                                                indexOfLastItemInappropriateForumPost
                                            )
                                            .map((inappropriateForumPost) => (
                                                <tr
                                                    key={inappropriateForumPost.forumPost.forumPostId}
                                                    style={{
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    <td className="truncate-text">
                                                        {inappropriateForumPost.forumPost.title}
                                                    </td>
                                                    <td>
                                                        <Button
                                                            size="sm"
                                                            title="Reset Inappropriate Forum Post to Appropriate"
                                                            style={{
                                                                backgroundColor: "#FFD700",
                                                                border: "0",
                                                                marginRight: "10px",
                                                            }}
                                                            onClick={() =>
                                                                toggleAppropriateForumPostStatusModal(inappropriateForumPost)
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
                                                No Inappropriate Forum Posts available
                                            </td>
                                        </tr>
                                    </tbody>
                                )}
                            </Table>
                            <div>
                                <Pagination className="faq-paginate">
                                    {Array.from({ length: totalPageInappropriateForumPosts }).map(
                                        (_, index) => (
                                            <Pagination.Item
                                                key={index}
                                                active={index + 1 === currentPageInappropriateForumPost}
                                                onClick={() =>
                                                    handlePageChangeInappropriateForumPost(index + 1)
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
                        <Modal.Title>Appropriate/Inappropriate Forum Post</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {editForumPost && (
                            <div>
                                <p>Are you sure this Forum Post is inappropriate?</p>
                                <p><strong>Topic:</strong> {editForumPost.forumTopic.topicName}</p>
                                <p><strong>Title:</strong> {editForumPost.forumPost.title}</p>
                                <p><strong>Message:</strong> {editForumPost.forumPost.message}</p>
                                <p><strong>Photo(s):</strong> {editForumPost.images.length === 0 && "No photos shown"}</p>
                                {Array.isArray(editForumPost.images) && editForumPost.images.length > 0 && (
                                    <div style={{
                                        display: "flex",
                                    }}>
                                        <Carousel
                                            style={{
                                                width: "600px",
                                                height: "350px",
                                            }}
                                        >
                                            {Array.isArray(editForumPost.images) && editForumPost.images.length > 0 && (
                                                editForumPost.images.map((image) => {
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
                                                                alt="forum post"
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
                    show={showResetInapprorpiateForumPostModal}
                    onHide={handleResetInappropriateForumPostModal}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Appropriate Forum Post</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {appropriateForumPost && (
                            <div>
                                <p>Reset the current forum post to Appropriate?</p>
                                <p><strong>Topic:</strong> {appropriateForumPost.forumTopic.topicName}</p>
                                <p><strong>Title:</strong> {appropriateForumPost.forumPost.title}</p>
                                <p><strong>Message:</strong> {appropriateForumPost.forumPost.message}</p>
                                <p><strong>Photo(s):</strong> {appropriateForumPost.images.length === 0 && "No photos shown"}</p>
                                {Array.isArray(appropriateForumPost.images) && appropriateForumPost.images.length > 0 && (
                                    <div style={{
                                        display: "flex",
                                    }}>
                                        <Carousel
                                            style={{
                                                width: "600px",
                                                height: "350px",
                                            }}
                                        >
                                            {Array.isArray(appropriateForumPost.images) && appropriateForumPost.images.length > 0 && (
                                                appropriateForumPost.images.map((image) => {
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
                                                                alt="forum post"
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
                            onClick={handleResetInappropriateForumPostModal}
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
                            onClick={() => handleResetForumPostToAppropriate()}
                        >
                            Yes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default ForumPost;
