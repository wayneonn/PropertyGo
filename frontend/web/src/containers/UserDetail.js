import { React, useState, useEffect } from "react";
import { Card, Button, Form, Modal } from "react-bootstrap";
import "./styles/UserDetail.css";
import API from "../services/API";
import { formats, modules } from "../components/Common/RichTextEditor";
import BreadCrumb from "../components/Common/BreadCrumb.js";
import Pagination from "react-bootstrap/Pagination";
import { useParams, useNavigate } from "react-router-dom";
import base64 from "react-native-base64";

import { BsRocketTakeoff, BsRocketTakeoffFill } from "react-icons/bs";
import { FaStar } from "react-icons/fa";

const UserDetail = () => {
  const [user, setUser] = useState({});
  const { userId } = useParams();
  const [properties, setProperties] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [aveRating, setAveRating] = useState(0);
  const [folders, setFolders] = useState([]);
  const [folderId, setFolderId] = useState(0);
  const [documents, setDocuments] = useState([]);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);

  const navigate = useNavigate();

  const imageBasePath =
    window.location.protocol + "//" + window.location.host + "/images/";

  const fetchData = async () => {
    try {
      const responseProperty = await API.get(
        `http://localhost:3000/admin/properties`
      );

      const properties = responseProperty.data.filter(
        (property) => property.userId == userId
      );

      setProperties(properties);

      const responseReview = await API.get(
        `http://localhost:3000/admin/reviews`
      );

      const reviews = responseReview.data.reviews.filter(
        (review) => review.userId == userId
      );

      let rating = 0.0;

      if (Array.isArray(reviews) && reviews.length > 0) {
        reviews.map((review) => {
          rating = rating + review.rating;
        });

        setAveRating(parseFloat(rating / reviews.length).toFixed(2));
      }

      setReviews(reviews);

      console.log(reviews.length);

      const responseFolder = await API.get(
        `http://localhost:3000/admin/folders`
      );

      const folders = responseFolder.data.folders.filter(
        (folder) => folder.userId == userId
      );

      setFolders(folders);

      console.log(folders);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await API.get(
        `http://localhost:3000/admin/users/getUser/${userId}`
      );
      setUser(response.data);

      console.log(user);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchUser();
  }, [user]);

  const toggleDeactivateModal = async () => {
    setShowDeactivateModal(!showDeactivateModal);
  };

  const handleCloseDeactivateModal = () => {
    setShowDeactivateModal(false);
  };

  const toggleActivateModal = async () => {
    setShowActivateModal(!showActivateModal);
  };

  const handleCloseActivateModal = () => {
    setShowActivateModal(false);
  };

  const handleDeactivate = async () => {
    try {
      const response = await API.patch(`/admin/users/deactivate/${userId}`);

      setUser(response.data);

      if (response.status === 200) {
        handleCloseDeactivateModal();
        console.log("Successully deactivated user");
      }
    } catch (error) {
      console.error("error");
    }
  };

  const handleActivate = async () => {
    try {
      const response = await API.patch(`/admin/users/activate/${userId}`);

      setUser(response.data);

      if (response.status === 200) {
        handleCloseActivateModal();
        console.log("Successully activated user");
      }
    } catch (error) {
      console.error("error");
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

  const toggleDocumentModal = async (folderId) => {
    setFolderId(folderId);
    setShowDocumentModal(!showDocumentModal);

    const responseDocument = await API.get(
      `http://localhost:3000/admin/documents/folder/${folderId}`
    );

    setDocuments(responseDocument.data.documents);
  };

  const handleCloseDocumentModal = () => {
    setShowDocumentModal(false);
  };

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

  return (
    <div className="userdetail">
      <div
        style={{
          marginTop: "10px",
          marginLeft: "30px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <BreadCrumb
          names={["Home", "Users"]}
          lastname="User Detail"
          links={["/", "/users"]}
        ></BreadCrumb>
      </div>
      <div className="container">
        <div className="username">
          <td>
            {user.profileImage ? (
              <>
                <img
                  src={`data:image/jpeg;base64,${user.profileImage.toString(
                    "base64"
                  )}`}
                  style={{ height: "30px", width: "30px" }}
                  alt="user"
                />
              </>
            ) : (
              <>
                <>
                  <img
                    src={imageBasePath + "user.png"}
                    style={{ height: "30px", width: "30px" }}
                    alt="default user"
                  />
                </>
              </>
            )}
          </td>
          <span style={{ marginLeft: "12px", fontWeight: "bold" }}>
            {user.userName}
          </span>
        </div>
        <div className="status-transaction">
          <div
            className={
              user.isActive === true ? "status-box" : "deactivated-box"
            }
          >
            <div style={{ padding: "15px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <span style={{ padding: "10px 0px 10px 10px" }}>
                    CURRENT USER STATUS
                  </span>
                  <div
                    style={{
                      lineHeight: "40px",
                      display: "flex",
                      alignItems: "center",
                      padding: "15px 0px 10px 10px",
                    }}
                  >
                    {user.isActive === true ? (
                      <>
                        <BsRocketTakeoff
                          style={{ height: "35px", width: "35px" }}
                        />
                        <span
                          style={{
                            fontWeight: "bold",
                            marginLeft: "10px",
                            fontSize: "30px",
                          }}
                        >
                          Active
                        </span>
                      </>
                    ) : (
                      <>
                        <BsRocketTakeoffFill
                          style={{ height: "35px", width: "35px" }}
                        />
                        <span
                          style={{
                            fontWeight: "bold",
                            marginLeft: "10px",
                            fontSize: "30px",
                          }}
                        >
                          Deactivated
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="rating">
                  <span
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {aveRating} /
                  </span>
                  <span
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    5 <FaStar style={{ marginLeft: "3px", color: "#FF6666" }} />
                  </span>
                </div>
              </div>
              <div
                style={{
                  marginLeft: "10px",
                  display: "flex",
                  marginTop: "20px",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span>Account holder since:</span>
                  <span>{formatUserCreatedAt(user.createdAt)}</span>
                </div>
                <span style={{ marginLeft: "60px" }}>
                  Listed property: {properties.length}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: "20px",
                  marginLeft: "5px",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {user.isActive === true ? (
                  <Button
                    style={{
                      backgroundColor: "#FF6666",
                      border: "0",
                      borderRadius: "160px",
                      color: "black",
                    }}
                    onClick={toggleDeactivateModal}
                  >
                    Deactivate User
                  </Button>
                ) : (
                  <Button
                    style={{
                      backgroundColor: "#FFD700",
                      border: "0",
                      borderRadius: "160px",
                      color: "black",
                    }}
                    onClick={toggleActivateModal}
                  >
                    Activate User
                  </Button>
                )}
                <Button
                  style={{
                    backgroundColor: "white",
                    border: "0",
                    borderRadius: "160px",
                    color: "black",
                    marginLeft: "50px",
                  }}
                  onClick={() =>
                    navigate(`/users/details/${user.userId}/property-listing`)
                  }
                >
                  View Listed Property
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="document-area">
          <span>User Documents</span>
          <hr />
          <div className="documents-boxes">
            {Array.isArray(folders) && folders.length > 0 ? (
              folders.map((folder) => (
                <div
                  className="folder"
                  key={folder.id}
                  onClick={() => toggleDocumentModal(folder.folderId)}
                >
                  <span>{folder.title}</span>
                </div>
              ))
            ) : (
              <span>No Folders</span>
            )}
          </div>
        </div>
      </div>
      <Modal
        show={showDocumentModal}
        onHide={handleCloseDocumentModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Documents</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="document">
            {Array.isArray(documents) && documents.length > 0 ? (
              documents.map((document) => (
                <div className="document-title">
                  <span>
                    <a
                      href="#"
                      onClick={() => handleDownload(document.documentId)}
                    >
                      {document.title}
                    </a>
                  </span>
                </div>
              ))
            ) : (
              <span>No documents...</span>
            )}
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={showDeactivateModal}
        onHide={handleCloseDeactivateModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Deactivate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to deactivate this user?</p>
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
            onClick={handleCloseDeactivateModal}
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
            onClick={handleDeactivate}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showActivateModal}
        onHide={handleCloseActivateModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Activate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to activate this user?</p>
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
            onClick={handleCloseActivateModal}
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
            onClick={handleActivate}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserDetail;
