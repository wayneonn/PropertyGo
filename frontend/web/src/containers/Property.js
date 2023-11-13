import { React, useState, useEffect, useRef } from "react";
import { Carousel, Modal, Button, Form } from "react-bootstrap";
import "./styles/Property.css";
import { useParams } from "react-router-dom";
import BreadCrumb from "../components/Common/BreadCrumb.js";
import { LiaBedSolid, LiaBathSolid } from "react-icons/lia";
import { RxDimensions } from "react-icons/rx";
import { FcDocument } from "react-icons/fc";

import API from "../services/API";

// import SignatureCanvas from "react-signature-canvas";
// import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const Property = () => {
  const [property, setProperty] = useState({});
  const { propertyId } = useParams();
  const [seller, setSeller] = useState({});
  const [buyer, setBuyer] = useState({});
  const [documents, setDocuments] = useState([]);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  // const [signatureDataURL, setSignatureDataURL] = useState(null);
  // const signatureCanvasRef = useRef();

  const [validationMessages, setValidationMessages] = useState({
    emptyRejectionReason: false,
  });

  const imageBasePath =
    window.location.protocol + "//" + window.location.host + "/images/";

  const fetchData = async () => {
    try {
      const response = await API.get(
        `http://localhost:3000/admin/properties/${propertyId}`
      );
      setProperty(response.data);

      console.log(propertyId);

      setApprovalStatus(response.data.approvalStatus);

      const sellerResponse = await API.get(
        `http://localhost:3000/admin/users/getUser/${response.data.sellerId}`
      );

      setSeller(sellerResponse.data);

      // console.log(sellerResponse.data.userId);

      const transactionResponse = await API.get(
        `http://localhost:3000/admin/transactions`
      );

      console.log("buyer: " + response.data.buyerId);

      if (response.data.buyerId != null) {
        const buyerResponse = await API.get(
          `http://localhost:3000/admin/users/getUser/${response.data.buyerId}`
        );

        setBuyer(buyerResponse.data);
      }

      const documentResponse = await API.get(
        `http://localhost:3000/admin/documents`
      );

      console.log("buyer " + response.data.buyerId);
      console.log("seller " + sellerResponse.data.userId);

      // console.log("document:" + documentResponse);

      const documents = documentResponse.data.data.filter(
        (document) => document.propertyId == propertyId
      );

      setDocuments(documents);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  function getPropertyClassName(status) {
    if (status === "ACTIVE") {
      return "status-active";
    } else if (status === "ON_HOLD") {
      return "status-on-hold";
    } else if (status === "COMPLETED") {
      return "status-completed";
    }
  }

  function getPropertyTypeClassName(type) {
    if (type === "NEW_LAUNCH") {
      return "type-new";
    } else if (type === "RESALE") {
      return "type-resale";
    }
  }

  function getApprovalStatusClassName(status) {
    if (status === "PENDING") {
      return "status-pending-all";
    } else if (status === "APPROVED") {
      return "status-approved-all";
    } else if (status === "REJECTED") {
      return "status-rejected-all";
    }
  }

  function formatTime(postedAt) {
    const dateObject = new Date(postedAt);
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

  const handleDownload = async (documentId) => {
    try {
      const response = await API.get(
        `http://127.0.0.1:3000/user/documents/${documentId}/data`
      );
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
      window.open(url, "_blank");
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error fetching document data: ", error);
    }
  };

  //   const handleDownload = async (documentId) => {
  //     try {
  //       const response = await API.get(`http://127.0.0.1:3000/user/documents/${documentId}/data`);
  //       const byteCharacters = atob(response.data.document);
  //       const byteArrays = [];
  //       for (let offset = 0; offset < byteCharacters.length; offset += 512) {
  //         const slice = byteCharacters.slice(offset, offset + 512);
  //         const byteNumbers = new Array(slice.length);
  //         for (let i = 0; i < slice.length; i++) {
  //           byteNumbers[i] = slice.charCodeAt(i);
  //         }
  //         const byteArray = new Uint8Array(byteNumbers);
  //         byteArrays.push(byteArray);
  //       }

  //       const blob = new Blob(byteArrays, { type: 'application/pdf' });
  //       const url = URL.createObjectURL(blob);

  //       const newTab = window.open(url, '_blank');

  //       newTab.onload = () => {
  //         const newTabDocument = newTab.document;
  //         const signatureContainer = newTabDocument.createElement('div');
  //         newTabDocument.body.appendChild(signatureContainer);

  //         const signCanvas = new SignatureCanvas({
  //           onEnd: () => {
  //             setSignatureDataURL(signCanvas.toDataURL());
  //           },
  //         });
  //         signatureContainer.appendChild(signCanvas);

  //         const saveButton = newTabDocument.createElement('button');
  //         saveButton.innerText = 'Save';
  //         saveButton.onclick = () => {
  //           const combinedDocument = combineDocumentWithSignature(blob, signCanvas.toDataURL());

  //           // Create a new Blob from the combined data
  //           const combinedBlob = new Blob([combinedDocument], { type: 'application/pdf' });

  //           // Open a new tab to download the signed document
  //           const signedDocumentUrl = URL.createObjectURL(combinedBlob);
  //           const signedDocumentTab = window.open(signedDocumentUrl, '_blank');
  //           URL.revokeObjectURL(signedDocumentUrl);

  //           // Close the original document tab
  //           newTab.close();
  //         };
  //         signatureContainer.appendChild(saveButton);
  //       };
  //     } catch (error) {
  //       console.error('Error fetching document data: ', error);
  //     }
  //   };

  // const combineDocumentWithSignature = async (documentBlob, signatureDataURL) => {
  //   const originalDocumentArrayBuffer = await documentBlob.arrayBuffer();

  //   // Load the original PDF document
  //   const pdfDoc = await PDFDocument.load(originalDocumentArrayBuffer);

  //   // Create a new page for the signature
  //   const [width, height] = [pdfDoc.getPage(0).getWidth(), pdfDoc.getPage(0).getHeight()];
  //   const signaturePage = pdfDoc.addPage([width, height]);
  //   const signatureCanvas = signaturePage.getCanvas();
  //   const signatureImage = await pdfDoc.embedPng(signatureDataURL);

  //   // Draw the signature on the new page
  //   signatureCanvas.drawImage(signatureImage, {
  //     x: 0,
  //     y: 0,
  //     width: width,
  //     height: height,
  //   });

  //   // Update the PDF with the new page
  //   const pdfBytes = await pdfDoc.save();

  //   // Convert the Uint8Array to Blob
  //   return new Blob([pdfBytes], { type: 'application/pdf' });
  // };

  const handleCloseDocumentModal = () => {
    setShowDocumentModal(false);
  };

  const toggleApproveModal = () => {
    setShowApproveModal(!showApproveModal);
  };

  const handleCloseApproveModal = () => {
    setShowApproveModal(false);
  };

  const toggleRejectModal = () => {
    setShowRejectModal(!showRejectModal);
  };

  const handleCloseRejectModal = () => {
    setShowRejectModal(false);
    setValidationMessages({});
  };

  const handleApprove = async () => {
    try {
      const response = await API.patch(
        `/admin/properties/approve/${propertyId}`
      );

      console.log(response.data);

      setProperty(response.data);
      setApprovalStatus("APPROVED");

      if (response.status === 200) {
        handleCloseApproveModal();
        console.log("Successully activated user");
      }
    } catch (error) {
      console.error("error");
    }
  };

  const handleReject = async () => {
    const newMessage = {
      emptyRejectionReason: false,
    };

    if (rejectionReason.trim() === "") {
      newMessage.emptyRejectionReason = true;
    }

    if (newMessage.emptyRejectionReason) {
      setValidationMessages(newMessage);
      return;
    }

    try {
      const response = await API.patch(
        `/admin/properties/reject/${propertyId}`,
        {
          adminNotes: rejectionReason,
        }
      );

      setProperty(response.data);
      setApprovalStatus("REJECTED");

      if (response.status === 200) {
        setValidationMessages(newMessage);
        handleCloseRejectModal();
        setRejectionReason("");
        console.log("Successully rejected user");
      }
    } catch (error) {
      console.error("error");
      setValidationMessages(newMessage);
    }
  };

  return (
    <div className="property">
      <div
        style={{
          marginTop: "10px",
          marginLeft: "30px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <BreadCrumb
          names={["Home", "Users", "User Detail", "Properties"]}
          lastname="Property"
          links={[
            "/",
            "/users",
            `/users/details/${seller.userId}`,
            `/users/details/${seller.userId}/property-listing`,
          ]}
        ></BreadCrumb>
      </div>
      <div className="property-main">
        <div style={{ display: "flex" }}>
          {/* <div> */}
          <div className="images">
            <Carousel
              style={{
                width: "600px",
                height: "420px",
              }}
            >
              {Array.isArray(property.images) && property.images.length > 0 ? (
                property.images.map((image) => (
                  <Carousel.Item>
                    <div className="image-container">
                      <img
                        className="image"
                        src={`http://localhost:3000/image/${image.toString()}`}
                        alt="property image"
                      />
                    </div>
                  </Carousel.Item>
                ))
              ) : (
                <Carousel.Item>
                  <div className="image-container">
                    <img
                      className="image"
                      src={imageBasePath + "login.jpeg"}
                      alt="default image"
                    />
                  </div>
                </Carousel.Item>
              )}
            </Carousel>
          </div>
          <div className="description">
            <div className="property-desc">
              <span style={{ fontSize: "25px", fontWeight: "600" }}>
                {property.title}
              </span>
              <span style={{ fontSize: "15px", marginBottom: "30px" }}>
                {property.description}
              </span>
              {property.boostListingStartDate && (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      fontSize: "12px",
                      opacity: "0.8",
                      marginTop: "10px",
                      fontWeight: "500",
                    }}
                  >
                    Boost Listing Start Date - End Date:
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      opacity: "0.8",
                      marginBottom: "10px",
                      fontWeight: "500",
                    }}
                  >
                    {formatTime(property.boostListingStartDate)} -{" "}
                    {formatTime(property.boostListingEndDate)}
                  </span>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    className={getPropertyClassName(property.propertyStatus)}
                  >
                    {property.propertyStatus}
                  </div>
                  <div
                    className={getPropertyTypeClassName(property.propertyType)}
                  >
                    {property.propertyType}
                  </div>
                  <div
                    className={getApprovalStatusClassName(
                      property.approvalStatus
                    )}
                  >
                    {property.approvalStatus}
                  </div>
                </div>
                {property.approvalStatus == "PENDING" && (
                  <div className="approval-actions">
                    <Button
                      style={{
                        backgroundColor: "#FFD700",
                        border: "0",
                        borderRadius: "160px",
                        color: "black",
                        marginRight: "10px",
                      }}
                      onClick={toggleApproveModal}
                    >
                      Approve
                    </Button>
                    <Button
                      style={{
                        backgroundColor: "#FF6666",
                        border: "0",
                        borderRadius: "160px",
                        color: "black",
                      }}
                      onClick={toggleRejectModal}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
              <span
                style={{ fontSize: "12px", opacity: "0.8", marginTop: "20px" }}
              >
                Date posted: {formatTime(property.createdAt)}
              </span>
              {property.approvalStatus == "REJECTED" && (
                <span
                  style={{
                    fontSize: "12px",
                    opacity: "0.8",
                    marginTop: "10px",
                  }}
                >
                  Reason for rejection: {property.adminNotes}
                </span>
              )}
            </div>
            <hr style={{ width: "565px", marginLeft: "30px", padding: "0" }} />
            <div className="attri">
              <div className="property-price">
                <span style={{ opacity: "0.8" }}>Selling price</span>
                <span style={{ fontSize: "25px", fontWeight: "500" }}>
                  S$ {property.price}
                </span>
              </div>
              <div className="property-attri">
                <div className="bed-bath-sqm">
                  <span>
                    <LiaBedSolid className="icon" /> {property.bed}
                  </span>
                </div>
                <div className="bed-bath-sqm">
                  <span>
                    <LiaBathSolid className="icon" /> {property.bathroom}
                  </span>
                </div>
                <div className="bed-bath-sqm">
                  <span>
                    <RxDimensions className="icon" /> {property.size} sqft
                  </span>
                </div>
              </div>
            </div>
            {property.propertyStatus == "COMPLETED" && (
              <div className="sold">
                <div className="sold-price">
                  <span style={{ opacity: "0.8" }}>Offered Price</span>
                  <span style={{ fontSize: "25px", fontWeight: "500" }}>
                    S$ {property.offeredPrice}
                  </span>
                </div>
                <div className="sold-buyer">
                  <span style={{ opacity: "0.8" }}>Transacted with</span>
                  {/* <span className="buyer-name">{buyer.userName}</span> */}
                  <a
                    href={`/users/details/${buyer.userId}`}
                    className="buyer-name"
                  >
                    {buyer.userName}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="document-area">
          <span style={{ fontSize: "15px", fontWeight: "500" }}>
            Property Listing Documents
          </span>
          <hr />
          <div className="documents-boxes">
            {Array.isArray(documents) && documents.length > 0 ? (
              documents.map((document) => (
                <div
                  className="folder"
                  key={document.documentId}
                  onClick={() => handleDownload(document.documentId)}
                >
                  <FcDocument
                    style={{ width: "100px", height: "100px" }}
                  ></FcDocument>
                  <span>{document.title}</span>
                </div>
              ))
            ) : (
              <span>No Documents ...</span>
            )}
          </div>
        </div>
        <Modal>
          <Modal.Body>
            <div width="10em">
              {pdfBlob ? (
                <embed
                  src={URL.createObjectURL(pdfBlob)}
                  type="application/pdf"
                  width="100%"
                  height="550px"
                />
              ) : (
                <p>No PDF</p>
              )}
            </div>
          </Modal.Body>
        </Modal>
        <Modal
          show={showApproveModal}
          onHide={handleCloseApproveModal}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: "20px" }}>
              Approve Property Listing
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to approve this property listing?</p>
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
              onClick={handleCloseApproveModal}
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
              onClick={handleApprove}
            >
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={showRejectModal}
          onHide={handleCloseRejectModal}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: "20px" }}>
              Reject Property Listing
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Label
              style={{
                color: "black",
                // font: "Public Sans",
                fontWeight: "400",
                fontSize: "16px",
              }}
            >
              Reason for rejecting
            </Form.Label>
            <Form.Group>
              <Form.Control
                as="textarea"
                rows={3}
                name="message"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                isInvalid={validationMessages.emptyRejectionReason}
              />
              {validationMessages.emptyRejectionReason && (
                <Form.Control.Feedback type="invalid">
                  Reason is required.
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
              onClick={handleCloseRejectModal}
            >
              Cancel
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
              onClick={handleReject}
            >
              Reject
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Property;
