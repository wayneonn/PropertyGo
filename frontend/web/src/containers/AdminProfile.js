import { React, useEffect, useState } from "react";
import { Button, 
  Form,
  InputGroup,
  Modal,
  Row,
  Col,
  Toast } from "react-bootstrap";
import "./Adminprofile.css";
import BreadCrumb from "../components/Common/BreadCrumb.js";
import { BsFillKeyFill } from "react-icons/bs";
import { VscEyeClosed, VscEye } from "react-icons/vsc";

// utils
import API from "../services/API";

const AdminProfile = () => {
  const [userName, setUserName] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentOpenEye, setCurrentOpenEye] = useState(false);
  const [newOpenEye, setNewOpenEye] = useState(false);
  const [confirmOpenEye, setConfirmOpenEye] = useState(false);
  const [showEditUsername, setShowEditUsername] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const [validationMessages, setValidationMessages] = useState({
    empty: false,
    notUnique: false,
  });

  // toast message
  const [show, setShow] = useState(false);
  const [toastAction, setToastAction] = useState("");

  const showToast = (action) => {
    setToastAction(action);
    setShow(true);
  }

  const toggleEditUsernameModal = () => {
    setShowChangePassword(false);
    setShowEditUsername(!showEditUsername);
    setNewUserName("");
    setValidationMessages({ empty: false, notUnique: false });
  };

  const toggleChangePasswordModal = () => {
    setShowEditUsername(false);
    setShowChangePassword(!showChangePassword);
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setValidationMessages({ empty: false, notUnique: false });
  };

  const handleUsernameSave = async () => {
    const newMessage = {
      empty: false,
      notUnique: false,
    };

    const newUserNameTrimmed = newUserName.trim()

    if (newUserNameTrimmed === "") {
      newMessage.empty = true;
      setValidationMessages(newMessage);
      return;
    }

    try {
      // Save to database
      const response = await API.patch("/admins/updateUserName", {
        oldUserName: userName,
        updatedUserName: newUserName,
      });

      if (response.status === 200) {
        setValidationMessages(newMessage);
        setUserName(newUserName);
        setNewUserName("");
        setShowEditUsername(false);

        showToast('username');
      }
    } catch (error) {
      const status = error.response.status;
      if (status === 409) {
        newMessage.notUnique = true;
        setValidationMessages(newMessage);
      }
    }
  };

  const handlePasswordSave = async (e) => {
    const newMessage = {
      emptyCurrentPassword: false,
      emptyNewPassword: false,
      emptyConfirmNewPassword: false,
      currentPasswordIncorrect: false,
      newPasswordDifferentConfirmPassword: false,
    };

    const passwordTrimmed = password.trim();
    const newPasswordTrimmed = newPassword.trim();
    const confirmPasswordTrimmed = confirmPassword.trim();

    if (passwordTrimmed === "") {
      newMessage.emptyCurrentPassword = true;
    }

    if (newPasswordTrimmed === "") {
      newMessage.emptyNewPassword = true;
    }

    if (confirmPasswordTrimmed === "") {
      newMessage.emptyConfirmNewPassword = true;
    }

    if (newMessage.emptyCurrentPassword || newMessage.emptyNewPassword || newMessage.emptyConfirmNewPassword) {
      setValidationMessages(newMessage);
      return;
    }

    if (newPasswordTrimmed !== confirmPasswordTrimmed) {
      newMessage.newPasswordDifferentConfirmPassword = true;
      setValidationMessages(newMessage);
      return;
    }

    try {
      // Save to database
      const response = await API.patch("/admins/updatePassword", {
        userName: userName,
        oldPassword: password,
        newPassword: newPassword,
        newConfirmedPassword: confirmPassword
      });

      if (response.status === 200) {
        setValidationMessages(newMessage);
        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowChangePassword(false);

        showToast('password');
      }
    } catch (error) {
      const status = error.response.status;
      if (status === 401) {
        newMessage.currentPasswordIncorrect = true;
      } else if (status === 400) {
        newMessage.newPasswordDifferentConfirmPassword = true;
      }

      setValidationMessages(newMessage);
    }
  };

  const handleCloseUsername = (e) => {
    setNewUserName("");
    setShowEditUsername(false);
  };

  const handleClosePassword = (e) => {
    setNewPassword("");
    setConfirmPassword("");
    setShowChangePassword(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const test = await API.get(
          `/admins/${localStorage.getItem("loggedInAdmin")}`
        );
        const { userName } = test.data;

        setUserName(userName);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="admin-profile">
      <div style={{ marginTop: "20px", marginLeft: "60px" }}>
        <BreadCrumb name="Profile"></BreadCrumb>
      </div>
      <div>
        <div className="loginToast">
          <Row>
            <Col xs={6}>
              <Toast bg="warning" onClose={() => setShow(false)} show={show} delay={4000} autohide>
                <Toast.Header>
                  <strong className="me-auto">Successful</strong>
                </Toast.Header>
                <Toast.Body>{`You have updated your ${toastAction} successfully!`}</Toast.Body>
              </Toast>
            </Col>
          </Row>
        </div>
        <Form>
          <div className="currentUsername">
            <Form.Group controlId="formGroupUserName">
              <Form.Label
                style={{
                  color: "#384D6C",
                  font: "Montserrat",
                  fontWeight: "700",
                  fontSize: "16px",
                }}
              >
                User Name
              </Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  name="username"
                  value={userName}
                  readOnly
                />
                <Button
                  id="editUsername"
                  style={{
                    backgroundColor: "#FFD700",
                    border: "0",
                    color: "#384D6C",
                    font: "Montserrat",
                    fontWeight: "700",
                    fontSize: "16px",
                  }}
                  onClick={toggleEditUsernameModal}
                >
                  Edit Username
                </Button>
              </InputGroup>
            </Form.Group>
          </div>
          <div>
            <Button
              style={{
                marginLeft: "60px",
                marginTop: "20px",
                backgroundColor: "#FFD700",
                border: "0",
                color: "#384D6C",
                font: "Montserrat",
                fontWeight: "700",
                fontSize: "16px",
              }}
              onClick={toggleChangePasswordModal}
            >
              Change password
            </Button>
          </div>
        </Form>
      </div>
      {showEditUsername && (
        <div
          className="modal show"
          style={{
            display: "block",
            position: "initial",
          }}
        >
          <Modal.Dialog show="true">
            <Modal.Header>
              <Modal.Title
                style={{
                  color: "#384D6C",
                  font: "Montserrat",
                  fontWeight: "700",
                  fontSize: "16px",
                }}
              >
                Edit Username
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="dialogUsername">
                <Form.Group controlId="formGroupUserName">
                  <Form.Label
                    style={{
                      color: "#384D6C",
                      font: "Montserrat",
                      fontWeight: "700",
                      fontSize: "16px",
                    }}
                  >
                    New User Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="newUsername"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    isInvalid={
                      validationMessages.empty || validationMessages.notUnique
                    }
                  />
                  {validationMessages.empty && (
                    <Form.Control.Feedback type="invalid">
                      Username is required.
                    </Form.Control.Feedback>
                  )}
                  {validationMessages.notUnique && (
                    <Form.Control.Feedback type="invalid">
                      Username already exists. Please choose another username.
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                style={{
                  backgroundColor: "#0000000D",
                  border: "0",
                  color: "#384D6C",
                  font: "Montserrat",
                  fontWeight: "700",
                  fontSize: "16px",
                }}
                onClick={handleCloseUsername}
              >
                Close
              </Button>
              <Button
                style={{
                  backgroundColor: "#FFD700",
                  border: "0",
                  color: "#384D6C",
                  font: "Montserrat",
                  fontWeight: "700",
                  fontSize: "16px",
                }}
                onClick={handleUsernameSave}
              >
                Save changes
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </div>
      )}
      {showChangePassword && (
        <div
          className="modal show"
          style={{
            display: "block",
            position: "initial",
          }}
        >
          <Modal.Dialog show="true">
            <Modal.Header>
              <Modal.Title
                style={{
                  color: "#384D6C",
                  font: "Montserrat",
                  fontWeight: "700",
                  fontSize: "16px",
                }}
              >
                Change password
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="password">
                <div className="currentPassword">
                  <Form.Label style={{
                    color: "#384D6C",
                    font: "Montserrat",
                    fontWeight: "700",
                    fontSize: "16px",
                  }}>Current Password</Form.Label>
                  <InputGroup>
                    <InputGroup.Text id="keyIcon">
                      <BsFillKeyFill style={{ width: "24px", height: "24px" }} />
                    </InputGroup.Text>
                    <Form.Control
                      type={currentOpenEye ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      isInvalid={validationMessages.emptyCurrentPassword || validationMessages.currentPasswordIncorrect}
                    />
                    <Button
                      variant="info"
                      id="currentEyeOpenIcon"
                      onClick={() => setCurrentOpenEye(!currentOpenEye)}
                      style={{ border: "0", backgroundColor: "#FFD700" }}
                    >
                      {currentOpenEye ? (
                        <VscEye
                          style={{
                            width: "24px",
                            height: "24px",
                            color: "#384D6C",
                          }}
                        ></VscEye>
                      ) : (
                        <VscEyeClosed
                          style={{
                            width: "24px",
                            height: "24px",
                            color: "#384D6C",
                          }}
                        ></VscEyeClosed>
                      )}
                    </Button>
                    {validationMessages.emptyCurrentPassword && (
                      <Form.Control.Feedback type="invalid">
                        Current password is required.
                      </Form.Control.Feedback>
                    )}
                    {validationMessages.currentPasswordIncorrect && (
                      <Form.Control.Feedback type="invalid">
                        Current password is incorrect.
                      </Form.Control.Feedback>
                    )}
                  </InputGroup>
                </div>
                <div className="newPassword">
                  <Form.Label style={{
                    color: "#384D6C",
                    font: "Montserrat",
                    fontWeight: "700",
                    fontSize: "16px",
                  }}>New Password</Form.Label>
                  <InputGroup>
                    <InputGroup.Text id="keyIcon">
                      <BsFillKeyFill style={{ width: "24px", height: "24px" }} />
                    </InputGroup.Text>
                    <Form.Control
                      type={newOpenEye ? "text" : "password"}
                      name="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      isInvalid={validationMessages.emptyNewPassword}
                    />
                    <Button
                      id={newOpenEye ? "newEyeIconOpen" : "newEyeIconClose"}
                      onClick={() => setNewOpenEye(!newOpenEye)}
                      style={{ border: "0", backgroundColor: "#FFD700" }}
                    >
                      {newOpenEye ? (
                        <VscEye
                          style={{
                            width: "24px",
                            height: "24px",
                            color: "#384D6C",
                          }}
                        ></VscEye>
                      ) : (
                        <VscEyeClosed
                          style={{
                            width: "24px",
                            height: "24px",
                            color: "#384D6C",
                          }}
                        ></VscEyeClosed>
                      )}
                    </Button>
                    {validationMessages.emptyNewPassword && (
                      <Form.Control.Feedback type="invalid">
                        New Password is required.
                      </Form.Control.Feedback>
                    )}
                  </InputGroup>
                </div>
                <div className="confirmPassword">
                  <Form.Label style={{
                    color: "#384D6C",
                    font: "Montserrat",
                    fontWeight: "700",
                    fontSize: "16px",
                  }}>Confirm New Password</Form.Label>
                  <InputGroup>
                    <InputGroup.Text id="keyIcon">
                      <BsFillKeyFill style={{ width: "24px", height: "24px" }} />
                    </InputGroup.Text>
                    <Form.Control
                      type={confirmOpenEye ? "text" : "password"}
                      name="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      isInvalid={validationMessages.emptyConfirmNewPassword || validationMessages.newPasswordDifferentConfirmPassword}
                    />
                    <Button
                      id={confirmOpenEye ? "confirmEyeIconOpen" : "confirmEyeIconClose"}
                      onClick={() => setConfirmOpenEye(!confirmOpenEye)}
                      style={{ border: "0", backgroundColor: "#FFD700" }}
                    >
                      {confirmOpenEye ? (
                        <VscEye
                          style={{
                            width: "24px",
                            height: "24px",
                            color: "#384D6C",
                          }}
                        ></VscEye>
                      ) : (
                        <VscEyeClosed
                          style={{
                            width: "24px",
                            height: "24px",
                            color: "#384D6C",
                          }}
                        ></VscEyeClosed>
                      )}
                    </Button>
                    {validationMessages.emptyConfirmNewPassword && (
                      <Form.Control.Feedback type="invalid">
                        Confirm new password is required.
                      </Form.Control.Feedback>
                    )}
                    {validationMessages.newPasswordDifferentConfirmPassword && (
                      <Form.Control.Feedback type="invalid">
                        Confirm new password is different from new password.
                      </Form.Control.Feedback>
                    )}
                  </InputGroup>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                style={{
                  backgroundColor: "#0000000D",
                  border: "0",
                  color: "#384D6C",
                  font: "Montserrat",
                  fontWeight: "700",
                  fontSize: "16px",
                }}
                onClick={handleClosePassword}
              >
                Close
              </Button>
              <Button
                style={{
                  backgroundColor: "#FFD700",
                  border: "0",
                  color: "#384D6C",
                  font: "Montserrat",
                  fontWeight: "700",
                  fontSize: "16px",
                }}
                onClick={handlePasswordSave}
              >
                Save changes
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
