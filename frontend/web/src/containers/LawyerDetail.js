import { React, useState, useEffect } from "react";
import { Card, Button, Form, Modal, Spinner } from "react-bootstrap";
import "./styles/LawyerDetail.css";
import API from "../services/API";
import BreadCrumb from "../components/Common/BreadCrumb.js";
import { useParams, useNavigate } from "react-router-dom";
import base64 from "react-native-base64";

import { BsRocketTakeoff, BsRocketTakeoffFill } from "react-icons/bs";
import { FaStar } from "react-icons/fa";
import { FcFolder, FcOpenedFolder } from "react-icons/fc";

const LawyerDetail = () => {
  const [lawyer, setLawyer] = useState({});
  const { lawyerId } = useParams();
  // const [reviews, setReviews] = useState([]);
  // const [aveRating, setAveRating] = useState(0);
  const [folders, setFolders] = useState([]);
  const [folderId, setFolderId] = useState(0);
  const [documents, setDocuments] = useState([]);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [fetching, setFetching] = useState();
  const [hoverStates, setHoverStates] = useState([]);
  const [isActive, setIsActive] = useState();
  // const [reviewers, setReviewers] = useState([]);

  const navigate = useNavigate();

  const imageBasePath =
    window.location.protocol + "//" + window.location.host + "/images/";

  const fetchData = async () => {
    try {
      const response = await API.get(
        `http://localhost:3000/admin/users/getUser/${lawyerId}`
      );
      setLawyer(response.data);

      setIsActive(response.data.isActive);

      // const responseReview = await API.get(
      //   `http://localhost:3000/admin/reviews`
      // );

      // const reviews = responseReview.data.reviews.filter(
      //   (review) => review.revieweeId == lawyerId
      // );

      // let rating = 0.0;

      // if (Array.isArray(reviews) && reviews.length > 0) {
      //   reviews.map((review) => {
      //     rating = rating + review.rating;
      //   });

      //   setAveRating(parseFloat(rating / reviews.length).toFixed(2));
      // }

      // setReviews(reviews);

      // console.log(reviews.length);

      const responseFolder = await API.get(
        `http://localhost:3000/admin/folders`
      );

      const folders = responseFolder.data.folders.filter(
        (folder) => folder.userId == lawyerId
      );

      setFolders(folders);

      setHoverStates(new Array(folders.length).fill(false));

      console.log(folders);
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
  //   const fetchReviewers = async () => {
  //     const reviewersData = await Promise.all(
  //       reviews.map(async (review) => {
  //         try {
  //           const response = await API.get(
  //             `http://localhost:3000/admin/users/getUser/${review.reviewerId}`
  //           );
  //           return response.data;
  //         } catch (error) {
  //           console.error(error);
  //         }
  //       })
  //     );
  //     setReviewers(reviewersData);
  //   };

  //   fetchReviewers();
  // }, [reviews]);

  useEffect(() => {
    fetchData();
  }, [fetching, isActive]);

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
      const response = await API.patch(`/admin/users/deactivate/${lawyerId}`);

      setLawyer(response.data);
      setIsActive(false);

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
      const response = await API.patch(`/admin/users/activate/${lawyerId}`);

      setLawyer(response.data);
      setIsActive(true);

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
    setShowDocumentModal(true);
    setFetching(true);

    try {
      const responseDocument = await API.get(
        `http://localhost:3000/admin/documents/folder/${folderId}`
      );

      setDocuments(responseDocument.data.documents);
    } catch (error) {
      console.error("Error fetching documents: ", error);
    } finally {
      setFetching(false);
    }
  };

  const handleCloseDocumentModal = () => {
    setShowDocumentModal(false);
    setDocuments([]);
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

  const handleHoverChange = (index, isHovered) => {
    const newHoverStates = new Array(folders.length).fill(false);
    newHoverStates[index] = isHovered;
    setHoverStates(newHoverStates);
  };

  return (
    <div className="lawyerdetail">
      <div
        style={{
          marginTop: "10px",
          marginLeft: "30px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <BreadCrumb
          names={["Home", "Lawyers"]}
          lastname="Lawyer Detail"
          links={["/", "/lawyers"]}
        ></BreadCrumb>
      </div>
      <div className="container-lawyer">
        <div className="username-lawyer">
          <td>
            {lawyer.profileImage ? (
              <>
                <img
                  src={`data:image/jpeg;base64,${lawyer.profileImage.toString(
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
          <span
            style={{ marginLeft: "12px", fontWeight: "600", fontSize: "18px" }}
          >
            {lawyer.userName}
          </span>
        </div>
        <div className="status-transaction">
          <div
            className={
              lawyer.isActive === true
                ? "status-box-lawyer"
                : "deactivated-box-lawyer"
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
                    CURRENT LAWYER STATUS
                  </span>
                  <div
                    style={{
                      lineHeight: "40px",
                      display: "flex",
                      alignItems: "center",
                      padding: "15px 0px 10px 10px",
                    }}
                  >
                    {isActive === true ? (
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
                {/* <div className="rating-lawyer">
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
                    5 <FaStar style={{ marginLeft: "3px", color: "red" }} />
                  </span>
                </div> */}
              </div>
              <div
                style={{
                  marginLeft: "10px",
                  display: "flex",
                  marginTop: "20px",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span>Account holder since:</span>
                    <span>{formatUserCreatedAt(lawyer.createdAt)}</span>
                  </div>
                  <div
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span>Company:</span>
                    <span>{lawyer.companyName}</span>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "120px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span>Experience:</span>
                    <span>{lawyer.experience}</span>
                  </div>
                  <div
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span>Projects Completed:</span>
                    <span>{lawyer.projectsCompleted}</span>
                  </div>
                </div>
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
                {isActive === true ? (
                  <Button
                    style={{
                      backgroundColor: "#FF6666",
                      border: "0",
                      borderRadius: "160px",
                      color: "black",
                    }}
                    onClick={toggleDeactivateModal}
                  >
                    Deactivate Lawyer
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
                    Activate Lawyer
                  </Button>
                )}
              </div>
            </div>
          </div>
          {/* <div className="reviews-lawyer">
            <span
              style={{
                display: "flex",
                justifyContent: "center",
                fontSize: "18px",
                fontWeight: "600",
              }}
            >
              REVIEWS
            </span>
            {Array.isArray(reviews) && reviews.length > 0 ? (
              reviews.map((review, index) => {
                return (
                  <div
                    key={review.reviewId}
                    className="individual-review-lawyer"
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div className="review-username-lawyer">
                        <td>
                          {reviewers[index] &&
                            (reviewers[index].profileImage ? (
                              <>
                                <img
                                  src={`data:image/jpeg;base64,${reviewers[
                                    index
                                  ].profileImage.toString("base64")}`}
                                  style={{ height: "20px", width: "20px" }}
                                  alt="user"
                                />
                              </>
                            ) : (
                              <>
                                <>
                                  <img
                                    src={imageBasePath + "user.png"}
                                    style={{ height: "20px", width: "20px" }}
                                    alt="default user"
                                  />
                                </>
                              </>
                            ))}
                        </td>
                        {reviewers[index] && (
                          <span
                            style={{
                              marginLeft: "12px",
                              fontWeight: "600",
                              fontSize: "15px",
                            }}
                          >
                            {reviewers[index].userName}
                          </span>
                        )}
                      </div>
                      <div className="review-rating-lawyer">
                        <span style={{ display: "flex", alignItems: "center" }}>
                          {review.rating} / 5{" "}
                          <FaStar
                            style={{ color: "#FFFDCE", marginLeft: "5px" }}
                          />
                        </span>
                      </div>
                    </div>
                    <div className="review-description-lawyer">
                      <span>{review.description}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: "500",
                  marginTop: "110px",
                  marginLeft: "170px",
                }}
              >
                There are currently no reviews...
              </span>
            )}
          </div> */}
        </div>
        <div className="document-area-lawyer">
          <span style={{ fontSize: "18px", fontWeight: "500" }}>Folders</span>
          <hr />
          <div className="documents-boxes-lawyer">
            {Array.isArray(folders) && folders.length > 0 ? (
              folders.map((folder, index) => (
                <div
                  className="folder-lawyer"
                  key={folder.id}
                  onClick={() => toggleDocumentModal(folder.folderId)}
                  onMouseOver={() => handleHoverChange(index, true)}
                  onMouseOut={() => handleHoverChange(index, false)}
                >
                  {hoverStates[index] ? (
                    <FcOpenedFolder
                      style={{
                        height: "90px",
                        width: "90px",
                      }}
                    />
                  ) : (
                    <FcFolder
                      style={{
                        height: "90px",
                        width: "90px",
                      }}
                    />
                  )}
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
          <Modal.Title style={{ fontSize: "20px" }}>Documents</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {fetching ? (
            <Spinner animation="border" variant="warning" />
          ) : (
            <div className="document-lawyer">
              {Array.isArray(documents) && documents.length > 0 ? (
                documents.map((document) => (
                  <div className="document-title-lawyer">
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
          )}
        </Modal.Body>
      </Modal>
      <Modal
        show={showDeactivateModal}
        onHide={handleCloseDeactivateModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "20px" }}>Deactivate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to deactivate this lawyer?</p>
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
          <Modal.Title style={{ fontSize: "20px" }}>Activate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to activate this lawyer?</p>
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

export default LawyerDetail;
