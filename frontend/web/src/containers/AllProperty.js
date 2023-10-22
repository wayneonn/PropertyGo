import { React, useState, useEffect } from "react";
import { Carousel, Modal, Button, Form } from "react-bootstrap";
import "./styles/AllProperty.css";
import { useParams } from "react-router-dom";
import BreadCrumb from "../components/Common/BreadCrumb.js";
import { LiaBedSolid, LiaBathSolid } from "react-icons/lia";
import { RxDimensions } from "react-icons/rx";
import { FcDocument } from "react-icons/fc";

import API from "../services/API";

const AllProperty = () => {
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

  const imageBasePath =
    window.location.protocol + "//" + window.location.host + "/images/";

  const [validationMessages, setValidationMessages] = useState({
    emptyRejectionReason: false,
  });

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

      // console.log(transactionResponse.data);

      // const transactions = transactionResponse.data.transactions
      //   .filter((transaction) => transaction.propertyId == propertyId)
      //   .filter((transaction) => transaction.transactionType == "OTP") // transaction is for OTP payment
      //   .filter((transaction) => transaction.status == "PAID"); // transaction is paid, means property is sold

      // console.log(transactions);

      // const buyerId = transactions[0].buyerId;

      const buyerResponse = await API.get(
        `http://localhost:3000/admin/users/getUser/${response.data.buyerId}`
      );

      setBuyer(buyerResponse.data);

      const documentResponse = await API.get(
        `http://localhost:3000/admin/documents`
      );

      console.log("buyer " + response.data.buyerId);
      console.log("seller " + sellerResponse.data.userId);

      // console.log("document:" + documentResponse);

      const documents = documentResponse.data.data
        .filter((document) => document.propertyId == propertyId)
        .filter(
          (document) =>
            document.userId == response.data.buyerId ||
            document.userId == sellerResponse.data.userId
        );
      //need howard help fetch documents

      // console.log(documents);

      setDocuments(documents);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [approvalStatus]);

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
    <div className="property-all">
      <div
        style={{
          marginTop: "10px",
          marginLeft: "30px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <BreadCrumb
          names={["Home", "Properties"]}
          lastname="Property"
          links={["/", "/properties"]}
        ></BreadCrumb>
      </div>
      <div className="property-main-all">
        <div style={{ display: "flex" }}>
          <div className="images-all">
            <Carousel
              style={{
                width: "600px",
                height: "420px",
              }}
            >
              {Array.isArray(property.images) && property.images.length > 0 ? (
                property.images.map((image) => (
                  <Carousel.Item>
                    <div className="image-container-all">
                      <img
                        className="image-all"
                        src={`http://localhost:3000/image/${image.toString()}`}
                        alt="property image"
                      />
                    </div>
                  </Carousel.Item>
                ))
              ) : (
                <Carousel.Item>
                  <div className="image-container-all">
                    <img
                      className="image-all"
                      src={imageBasePath + "login.jpeg"}
                      alt="default image"
                    />
                  </div>
                </Carousel.Item>
              )}
            </Carousel>
          </div>
          <div className="description-all">
            <div className="property-desc-all">
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {seller.profileImage ? (
                  <>
                    <img
                      src={`data:image/jpeg;base64,${seller.profileImage.toString(
                        "base64"
                      )}`}
                      style={{
                        height: "20px",
                        width: "20px",
                        marginRight: "10px",
                      }}
                      alt="user"
                    />
                  </>
                ) : (
                  <>
                    <>
                      <img
                        src={imageBasePath + "user.png"}
                        style={{
                          height: "20px",
                          width: "20px",
                          marginRight: "10px",
                        }}
                        alt="default user"
                      />
                    </>
                  </>
                )}
                {seller.userName}
              </span>
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
                    {formatTime(property.boostListingStartDate)} ~{" "}
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
                {property.approvalStatus === "PENDING" && (
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
              {property.approvalStatus === "REJECTED" && (
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
            <div className="attri-all">
              <div className="property-price-all">
                <span style={{ opacity: "0.8" }}>Selling price</span>
                <span style={{ fontSize: "25px", fontWeight: "500" }}>
                  S$ {property.price}
                </span>
              </div>
              <div className="property-attri-all">
                <div className="bed-bath-sqm-all">
                  <span>
                    <LiaBedSolid className="icon-all" /> {property.bed}
                  </span>
                </div>
                <div className="bed-bath-sqm-all">
                  <span>
                    <LiaBathSolid className="icon-all" /> {property.bathroom}
                  </span>
                </div>
                <div className="bed-bath-sqm-all">
                  <span>
                    <RxDimensions className="icon-all" /> {property.size} sqft
                  </span>
                </div>
              </div>
            </div>
            {property.propertyStatus == "COMPLETED" && (
              <div className="sold-all">
                <div className="sold-price-all">
                  <span style={{ opacity: "0.8" }}>Offered Price</span>
                  <span style={{ fontSize: "25px", fontWeight: "500" }}>
                    S$ {property.offeredPrice}
                  </span>
                </div>
                <div className="sold-buyer-all">
                  <span style={{ opacity: "0.8" }}>Transacted with</span>
                  <a
                    href={`/users/details/${buyer.userId}`}
                    className="buyer-name-all"
                  >
                    {buyer.userName}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="document-area-all">
          <span>Property Listing Documents</span>
          <hr />
          <div className="documents-boxes-all">
            {Array.isArray(documents) && documents.length > 0 ? (
              documents.map((document) => (
                <div
                  className="folder-all"
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

export default AllProperty;
