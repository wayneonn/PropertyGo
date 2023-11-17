import { React, useState, useEffect } from "react";
import { Card, Button, Form, Modal, Spinner } from "react-bootstrap";
import "./styles/ContractorDetail.css";
import API from "../services/API";
import BreadCrumb from "../components/Common/BreadCrumb.js";
import { useParams, useNavigate } from "react-router-dom";

import { BsRocketTakeoff, BsRocketTakeoffFill } from "react-icons/bs";
import { FcFolder, FcOpenedFolder } from "react-icons/fc";
import { VscEyeClosed, VscEye } from "react-icons/vsc";

const ContractorDetail = () => {
  const [contractor, setContractor] = useState({});
  const { contractorId } = useParams();
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
  const [showBankAccount, setShowBankAccount] = useState(false);
  const [openEye, setOpenEye] = useState(false);
  // const [reviewers, setReviewers] = useState([]);

  const navigate = useNavigate();

  const imageBasePath =
    window.location.protocol + "//" + window.location.host + "/images/";

  const fetchData = async () => {
    try {
      const response = await API.get(
        `http://localhost:3000/admin/users/getUser/${contractorId}`
      );
      setContractor(response.data);

      setIsActive(response.data.isActive);

      const responseFolder = await API.get(
        `http://localhost:3000/admin/folders`
      );

      const folders = responseFolder.data.folders.filter(
        (folder) => folder.userId == contractorId
      );

      setFolders(folders);

      setHoverStates(new Array(folders.length).fill(false));

      console.log(folders);
    } catch (error) {
      console.error(error);
    }
  };

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
      const response = await API.patch(
        `/admin/users/deactivate/${contractorId}`
      );

      setContractor(response.data);
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
      const response = await API.patch(`/admin/users/activate/${contractorId}`);

      setContractor(response.data);
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

  const openBankAccountDetails = () => {
    setOpenEye(!openEye);
    setShowBankAccount(!showBankAccount);
    // alert("Bank account details clicked!");
  };

  const replaceBankAccount = (bankAccount) => {
    let mask = "";
    if (bankAccount !== null && bankAccount !== undefined) {
      const bankAccountString = bankAccount.toFixed(0);
      for (const digit of bankAccountString) {
        mask += "x";
      }
    } else {
      mask = "-";
    }
    return mask;
  };

  const formatBankAccount = (bankAccount) => {
    if (bankAccount !== null && bankAccount !== undefined) {
      const bankAccountString = bankAccount.toFixed(0);
      return bankAccountString;
    } else {
      return "-";
    }
  };

  const formatBankName = (bankName) => {
    if (bankName !== null) {
      return bankName;
    } else {
      return "-";
    }
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
    <div className="contractordetail">
      <div
        style={{
          marginTop: "10px",
          marginLeft: "30px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <BreadCrumb
          names={["Home", "Contractors"]}
          lastname="Contractor Detail"
          links={["/", "/contractors"]}
        ></BreadCrumb>
      </div>
      <div className="container-contractor">
        <div className="username-contractor">
          <td>
            {contractor.profileImage ? (
              <>
                <img
                  src={`data:image/jpeg;base64,${contractor.profileImage.toString(
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
            {contractor.userName}
          </span>
        </div>
        <div className="status-transaction">
          <div
            className={
              contractor.isActive === true
                ? "status-box-contractor"
                : "deactivated-box-contractor"
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
                  <span
                    style={{
                      padding: "10px 0px 10px 10px",
                      fontSize: "15px",
                      fontWeight: "500",
                    }}
                  >
                    CURRENT CONTRACTOR STATUS
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
                          style={{ height: "40px", width: "40px" }}
                        />
                        <span
                          style={{
                            fontWeight: "bold",
                            marginLeft: "10px",
                            fontSize: "40px",
                          }}
                        >
                          Active
                        </span>
                      </>
                    ) : (
                      <>
                        <BsRocketTakeoffFill
                          style={{ height: "40px", width: "40px" }}
                        />
                        <span
                          style={{
                            fontWeight: "bold",
                            marginLeft: "10px",
                            fontSize: "40px",
                          }}
                        >
                          Deactivated
                        </span>
                      </>
                    )}
                  </div>
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
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span>
                      Account holder since:{" "}
                      {formatUserCreatedAt(contractor.createdAt)}
                    </span>
                  </div>
                  <div
                    style={{
                      marginTop: "20px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span>Company: {contractor.companyName}</span>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <span style={{ marginBottom: "20px", marginLeft: "80px" }}>
                    Bank name: {formatBankName(contractor.bankName)}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: "55px",
                    }}
                  >
                    <Button
                      id="eyeIcon"
                      onClick={openBankAccountDetails}
                      style={{
                        border: "0",
                        background: "none",
                        color: "black",
                        padding: "0",
                        display: "flex",
                        alignItems: "center",
                        textAlign: "center",
                        marginRight: "6px",
                      }}
                    >
                      {openEye ? (
                        <VscEye
                          style={{
                            width: "1.2em",
                            height: "1.2em",
                          }}
                        ></VscEye>
                      ) : (
                        <VscEyeClosed
                          style={{
                            width: "1.2em",
                            height: "1.2em",
                          }}
                        ></VscEyeClosed>
                      )}
                    </Button>
                    {showBankAccount ? (
                      <div>
                        <span>
                          Bank account:{" "}
                          {formatBankAccount(contractor.bankAccount)}
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span>
                          Bank account:{" "}
                          {replaceBankAccount(contractor.bankAccount)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: "80px",
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
                    Deactivate Contractor
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
                    Activate Contractor
                  </Button>
                )}
              </div>
            </div>
          </div>
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
          <p>Are you sure you want to deactivate this contractor?</p>
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
          <p>Are you sure you want to activate this contractor?</p>
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

export default ContractorDetail;
