import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Table, Pagination, Toast, Row, Col } from 'react-bootstrap';
import BreadCrumb from "../components/Common/BreadCrumb.js";
import axios from "axios";
import socketIOClient from 'socket.io-client';

import "./styles/PartnerApplication.css";

const PartnerApplication = () => {
    const [applications, setApplications] = useState([]); // Replace with actual data fetching
    const [showDocumentModal, setShowDocumentModal] = useState(false);
    const [documentDetails, setDocumentDetails] = useState([]);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionNote, setRejectionNote] = useState('');
    const [rejectId, setRejectId] = useState(0);

    const [showAcceptPartnerApplicationModal, setShowAcceptPartnerApplicationModal] = useState(false);
    const [partnerApplicationId, setPartnerApplicationId] = useState(0);

    const itemsPerPage = 9;

    const [currentPagePartnerApplication, setCurrentPagePartnerApplication] = useState(1);
    const [totalPagePartnerApplication, setTotalPagePartnerApplication] = useState(0);

    const indexOfLastItemPartnerApplication = currentPagePartnerApplication * itemsPerPage;
    const indexOfFirstItemPartnerApplication = indexOfLastItemPartnerApplication - itemsPerPage;

    // toast message
    const [show, setShow] = useState(false);
    const [toastAction, setToastAction] = useState("");

    // validation
    const [validationMessages, setValidationMessages] = useState({
        emptyRejectionMessage: false,
    });

    const showToast = (action) => {
        setToastAction(action);
        setShow(true);
    };

    const handlePageChangePartnerApplication = (pageNumber) => {
        setCurrentPagePartnerApplication(pageNumber);
    };

    useEffect(() => {
        // Fetch applications from the server here
        fetchApplicationDataFromServer().then(r => console.log("Fetch data from server activated."));
    }, []);

    useEffect(() => {
        const socket = socketIOClient('http://localhost:3000');

        socket.on('newPartnerApplicationNotification', () => {
            fetchApplicationDataFromServer();
        });
    }, []);

    useEffect(() => {
        console.log("Document details updated.")
        setDocumentDetails(documentDetails)
    }, [documentDetails]);

    useEffect(() => {
        setApplications(applications)
        setTotalPagePartnerApplication(Math.ceil(applications.length / itemsPerPage));
        console.log("Application details updated. ", applications)
    }, [applications]);

    const handleAcceptPartnerApplicationModal = () => {
        setShowAcceptPartnerApplicationModal(false);
    };

    const handleCloseRejectionReason = () => {
        setValidationMessages({});
        setShowRejectModal(false);
    };

    const handleApprove = async () => {
        try {
            await axios.put(`http://127.0.0.1:3000/user/partner/admin/approve/${partnerApplicationId}`);
            setShowAcceptPartnerApplicationModal(false);
            fetchApplicationDataFromServer();

            showToast("approved");
        } catch (error) {
            console.error("Error approving application: ", error);
        }
    };

    const toggleAcceptPartnerApplicationModal = (partnerApplicationId) => {
        setShowAcceptPartnerApplicationModal(!showAcceptPartnerApplicationModal);
        setPartnerApplicationId(partnerApplicationId);
    }

    const handleReject = (application) => {
        setShowRejectModal(true);
        setRejectId(application.partnerApplicationId);
        setRejectionNote(application.adminNotes !== null ? application.adminNotes : "");
    }

    const handleRejectNoteSubmission = async () => {
        const newMessage = {
            emptyRejectionMessage: false,
        };

        const rejectionNoteTrimmed = rejectionNote.trim();

        if (rejectionNoteTrimmed === "") {
            newMessage.emptyRejectionMessage = true;
            setValidationMessages(newMessage);
            return;
        }

        try {
            const headers = {
                'Content-Type': 'application/json'
            };
            const res = await axios.put(`http://127.0.0.1:3000/user/partner/admin/reject/${rejectId}`, {
                description: rejectionNote
            }, { headers })
            console.log("Server response: ", res);
            fetchApplicationDataFromServer().then(r => "Updated rejection successfully.");
            setShowRejectModal(false);
            setValidationMessages({});
            showToast("rejected");
        } catch (error) {
            console.error("Error updating rejection reason: ", error);
        }
    }

    const handleDocuments = async (applicationId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:3000/user/documents/app/metadata/${applicationId}`);
            console.log(response);
            setShowDocumentModal(true);
            setDocumentDetails(response.data)
        } catch (error) {
            console.error("Error fetching documents: ", error);
        }
    };

    const handleDownload = async (documentId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:3000/user/documents/${documentId}/data`)
            console.log("This is the document: ", response.data.document);
            const byteCharacters = atob(response.data.document); // Decode the Base64 string
            const byteArrays = [];
            for (let offset = 0; offset < byteCharacters.length; offset += 512) {
                const slice = byteCharacters.slice(offset, offset + 512);
                const byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }
            const blob = new Blob(byteArrays, { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank')
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error fetching document data: ", error);
        }
    }

    const fetchApplicationDataFromServer = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:3000/user/partner/admin/approval');
            console.log("Response is: ", response.data.partnerApp);

            const partnerApp = response.data.partnerApp.filter((pa) => pa.adminNotes === null);

            setApplications(partnerApp); // Assuming the data is directly in the response object
            console.log("Applications are: ", applications);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    function formatUserCreatedAt(userCreatedAt) {
        const dateObject = new Date(userCreatedAt);
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        const day = dateObject.getDate();
        const monthIndex = dateObject.getMonth();
        const year = dateObject.getFullYear();
        const formattedDate = `${day} ${months[monthIndex]} ${year}`;
        return formattedDate;
    }

    return (
        <div className="partner-application-container">
            <div style={{
                marginTop: "20px",
                marginLeft: "30px",
                display: "flex",
                justifyContent: "space-between",
            }}>
                <BreadCrumb names={["Home"]} lastname="Partner Application" links={["/"]}></BreadCrumb>
            </div>
            <div style={{ position: "absolute", top: "1%", left: "40%", zIndex: "1" }}>
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
                            <Toast.Body>{`You have ${toastAction} the Partner Application successfully!`}</Toast.Body>
                        </Toast>
                    </Col>
                </Row>
            </div>
            <div style={{ display: "flex", marginTop: "10px" }}>
                <div className="display-partner-application">
                    <div className="partner-application">
                        <h3
                            style={{
                                color: "black",
                                font: "Montserrat",
                                fontWeight: "700",
                                fontSize: "16px",
                                padding: "5px 5px 5px 5px",
                            }}
                        >
                            PARTNER APPLICATION
                        </h3>
                        <div>
                            <div>
                                <Table hover responsive>
                                    <thead
                                        style={{
                                            textAlign: "center"
                                        }}
                                    >
                                        <tr>
                                            <th>NAME</th>
                                            <th>DATE SUBMITTED</th>
                                            <th>ROLE APPLIED FOR</th>
                                            <th>SUBMITTED BY</th>
                                            <th>ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applications.length > 0 ? (
                                            applications.slice(indexOfFirstItemPartnerApplication, indexOfLastItemPartnerApplication).map((application) => (
                                                <tr key={application.partnerApplicationId} style={{ textAlign: "center" }}>
                                                    <td>{application.companyName}</td>
                                                    <td>{formatUserCreatedAt(application.createdAt)}</td>
                                                    <td>{application.userRole}</td>
                                                    <td>{application.username}</td>
                                                    <td>
                                                        <Button variant="warning"
                                                            onClick={() => toggleAcceptPartnerApplicationModal(application.partnerApplicationId)}>Approve</Button>&nbsp;
                                                        <Button variant="warning"
                                                            onClick={() => handleReject(application)}>Reject</Button>&nbsp;
                                                        <Button variant="warning"
                                                            onClick={() => handleDocuments(application.partnerApplicationId)}>View Documents</Button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" style={{ textAlign: "center" }}>No applications available</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                            <div>
                                <Pagination className="faq-paginate">
                                    {Array.from({ length: totalPagePartnerApplication }).map((_, index) => (
                                        <Pagination.Item
                                            key={index}
                                            active={index + 1 === currentPagePartnerApplication}
                                            onClick={() => handlePageChangePartnerApplication(index + 1)}
                                        >
                                            {index + 1}
                                        </Pagination.Item>
                                    ))}
                                </Pagination>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                show={showAcceptPartnerApplicationModal}
                onHide={handleAcceptPartnerApplicationModal}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Approval of Partner Application</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to approve this Partner Application?</p>
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
                        onClick={handleAcceptPartnerApplicationModal}
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
                        onClick={() => handleApprove()}
                    >
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showDocumentModal} onHide={() => setShowDocumentModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Document Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table>
                        <thead>
                            <tr style={{ textAlign: "center" }}>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documentDetails.map(doc => (
                                <tr key={doc.documentId} style={{ textAlign: "center" }}>
                                    <td>{doc.title}</td>
                                    <td>{doc.description}</td>
                                    <td>
                                        <Button onClick={() => handleDownload(doc.documentId)}> View </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
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
                        onClick={() => setShowDocumentModal(false)}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showRejectModal} onHide={handleCloseRejectionReason}>
                <Modal.Header closeButton>
                    <Modal.Title>Rejection Reason</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="rejectionNote">
                            <Form.Label>Notes for Rejection:</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={rejectionNote}
                                maxLength={100}
                                onChange={(e) => setRejectionNote(e.target.value)}
                                isInvalid={
                                    validationMessages.emptyRejectionMessage
                                }
                            />
                            {validationMessages.emptyRejectionMessage && (
                                <Form.Control.Feedback type="invalid">
                                    Rejection Note is required.
                                </Form.Control.Feedback>
                            )}
                        </Form.Group>
                        <Form.Text className="text-muted">
                            {`${rejectionNote.length}/100 characters`}
                        </Form.Text>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button style={{
                        backgroundColor: "#F5F6F7",
                        border: "0",
                        width: "92px",
                        height: "40px",
                        borderRadius: "160px",
                        color: "black",
                        font: "Public Sans",
                        fontWeight: "600",
                        fontSize: "14px",
                    }} onClick={handleCloseRejectionReason}>
                        Close
                    </Button>
                    <Button style={{
                        backgroundColor: "#FFD700",
                        border: "0",
                        width: "92px",
                        height: "40px",
                        borderRadius: "160px",
                        color: "black",
                        font: "Public Sans",
                        fontWeight: "600",
                        fontSize: "14px",
                    }} onClick={handleRejectNoteSubmission}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default PartnerApplication;