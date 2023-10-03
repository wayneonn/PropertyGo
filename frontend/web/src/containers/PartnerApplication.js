// This is the page for React Partner Application.

import React, {useEffect, useState} from 'react';
import {Button, Form, Modal, Table} from 'react-bootstrap';
import axios from "axios";
import app from "../App";

const PartnerApplication = () => {
    const [applications, setApplications] = useState([]); // Replace with actual data fetching
    const [showModal, setShowModal] = useState(false);
    const [showDocumentModal, setShowDocumentModal] = useState(false);
    const [documentDetails, setDocumentDetails] = useState([]);
    const [approvedSuccess, setApprovedSuccess] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionNote, setRejectionNote] = useState('');
    const [rejectId, setRejectId] = useState(0);
    const [selectedApplication, setSelectedApplication] = useState(null);

    useEffect(() => {
        // Fetch applications from the server here
        // setApplications(fetchedData);
        fetchApplicationDataFromServer().then(r => console.log("Fetch data from server activated."));
    }, []);

    useEffect(() => {
        console.log("Document details updated.")
        setDocumentDetails(documentDetails)
    }, [documentDetails]);

    const handleApprove = async (applicationId) => {
        try {
            const res = await axios.put(`http://127.0.0.1:3000/user/partner/admin/approve/${applicationId}`);
            console.log(res);
            setApprovedSuccess(true);
            fetchApplicationDataFromServer().then(r => console.log("Updated table successfully"));
        } catch(error) {
            console.error("Error approving application: ", error);
        }
    };

    const handleReject = (application) => {
        setShowRejectModal(true);
        setRejectId(application.partnerApplicationId);
        setRejectionNote(application.adminNotes !== null ? application.adminNotes : "");
    }

    const handleRejectNoteSubmission = async () => {
        try {
            const headers = {
                'Content-Type': 'application/json'
            };
            const res = await axios.put(`http://127.0.0.1:3000/user/partner/admin/reject/${rejectId}`, {
                description: rejectionNote
            }, {headers})
            console.log("Server response: ", res);
            fetchApplicationDataFromServer().then(r => "Updated rejection successfully.");
            setShowRejectModal(false);
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
            const blob = new Blob(byteArrays, {type: "application/pdf"});
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
            setApplications(response.data.partnerApp); // Assuming the data is directly in the response object
            console.log("Applications are: ", applications);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className="partner-application">
            <div style={{
                marginTop: "30px",
                display: "flex",
                flex: 1
            }}>
                <h2>Partner Applications</h2>
                <Table hover responsive>
                    <thead>
                    <tr>
                        <th>Application ID</th>
                        <th>Name</th>
                        <th>Date Submitted</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {applications.length > 0 ? (
                        applications.map((application) => (
                            <tr key={application.partnerApplicationId}>
                                <td>{application.partnerApplicationId}</td>
                                <td>{application.companyName}</td>
                                <td>{application.createdAt}</td>
                                <td>{application.userRole}</td>
                                <td>
                                    <Button
                                        onClick={() => handleApprove(application.partnerApplicationId)}>Approve</Button>
                                    <Button
                                        onClick={() => handleReject(application)}>Reject</Button>
                                    <Button
                                        onClick={() => handleDocuments(application.partnerApplicationId)}>Documents</Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No applications available</td>
                        </tr>
                    )}
                    </tbody>
                </Table>
            </div>
            <Modal show={showDocumentModal} onHide={() => setShowDocumentModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Document Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table>
                        <thead>
                        <tr>
                            <th>Document ID</th>
                            <th>Document Title</th>
                            <th>Document Description</th>
                            {/* Add more columns as needed */}
                        </tr>
                        </thead>
                        <tbody>
                        {documentDetails.map(doc => (
                            <tr key={doc.documentId}>
                                <td>{doc.documentId}</td>
                                <td>{doc.title}</td>
                                <td>{doc.description}</td>
                                <td>
                                    <Button onClick={() => handleDownload(doc.documentId)}> View </Button>
                                </td>
                                {/* Add more cells as needed */}
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setShowDocumentModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={approvedSuccess} onHide={() => setApprovedSuccess(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Approval Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>Application approved successfully!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setApprovedSuccess(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
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
                            />
                        </Form.Group>
                        <Form.Text className="text-muted">
                            {`${rejectionNote.length}/100`}
                        </Form.Text>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={handleRejectNoteSubmission}>
                        Submit Rejection
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default PartnerApplication;