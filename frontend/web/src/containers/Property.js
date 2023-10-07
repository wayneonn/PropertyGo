import { React, useState, useEffect } from "react";
import { Carousel, Modal } from "react-bootstrap";
import "./styles/Property.css";
import { useParams } from "react-router-dom";
import BreadCrumb from "../components/Common/BreadCrumb.js";
import { LiaBedSolid, LiaBathSolid } from "react-icons/lia";
import { RxDimensions } from "react-icons/rx";

import API from "../services/API";

const Property = () => {
  const [property, setProperty] = useState({});
  const { propertyId } = useParams();
  const [seller, setSeller] = useState({});
  const [buyer, setBuyer] = useState({});
  const [documents, setDocuments] = useState([]);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);

  const imageBasePath =
    window.location.protocol + "//" + window.location.host + "/images/";

  const fetchData = async () => {
    try {
      const response = await API.get(
        `http://localhost:3000/admin/properties/${propertyId}`
      );
      setProperty(response.data);

      // console.log(propertyId);

      const sellerResponse = await API.get(
        `http://localhost:3000/admin/users/getUser/${response.data.userId}`
      );

      setSeller(sellerResponse.data);

      // console.log(sellerResponse.data.userId);

      const transactionResponse = await API.get(
        `http://localhost:3000/admin/transactions`
      );

      // console.log(transactionResponse.data);

      const transactions = transactionResponse.data.transactions
        .filter((transaction) => transaction.propertyId == propertyId)
        .filter((transaction) => transaction.requestId === null) // transaction is for OTP payment
        .filter((transaction) => transaction.status == "PAID"); // transaction is paid, means property is sold

      // console.log(transactions);

      const buyerId = transactions[0].buyerId;

      const buyerResponse = await API.get(
        `http://localhost:3000/admin/users/getUser/${buyerId}`
      );

      setBuyer(buyerResponse.data);

      const documentResponse = await API.get(
        `http://localhost:3000/admin/documents`
      );

      console.log("buyer " + buyerId);
      console.log("seller " + sellerResponse.data.userId);

      // console.log("document:" + documentResponse);

      const documents = documentResponse.data.data
        .filter((document) => document.propertyId == propertyId)
        .filter(
          (document) =>
            document.userId == buyerId ||
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

  // const toggleDocumentModal = async (documentId) => {
  //   const documents = await API.get(`http://localhost:3000/admin/documents`);
  //   // console.log(document);
  //   // const binaryString = atob(document.data.formattedDocuments[0].document);

  //   const document = documents.filter(
  //     (document) => document.documentId == documentId
  //   );

  //   const binaryString = atob(document.data.formattedDocuments[0].document); //need howard help fetch documents
  //   const test = new Blob(
  //     [
  //       new Uint8Array(binaryString.length).map((_, i) =>
  //         binaryString.charCodeAt(i)
  //       ),
  //     ],
  //     { type: "application/pdf" }
  //   );
  //   setPdfBlob(test);
  //   setShowDocumentModal(!showDocumentModal);
  // };

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
                        src={`data:image/jpeg;base64,${image.toString(
                          "base64"
                        )}`}
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div className={getPropertyClassName(property.propertyStatus)}>
                  {property.propertyStatus}
                </div>
                <div
                  className={getPropertyTypeClassName(property.propertyType)}
                >
                  {property.propertyType}
                </div>
              </div>
              <span
                style={{ fontSize: "12px", opacity: "0.8", marginTop: "20px" }}
              >
                Date posted: {formatTime(property.createdAt)}
              </span>
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
          <span>Property Listing Documents</span>
          <hr />
          <div className="documents-boxes">
            {Array.isArray(documents) && documents.length > 0 ? (
              documents.map((document) => (
                <div
                  className="folder"
                  key={document.documentId}
                  onClick={() => handleDownload(document.documentId)}
                >
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
      </div>
    </div>
  );
};

export default Property;