import { React, useState } from "react";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import "./Adminprofile.css";
import BreadCrumb from "../components/Common/BreadCrumb.js";
import { BsFillKeyFill } from "react-icons/bs";
import { VscEyeClosed, VscEye } from "react-icons/vsc";

const AdminProfile = () => {
  const [userName, setUserName] = useState("username"); //set static username first, later fetch from backend
  const [newUserName, setNewUserName] = useState("");
  const [password, setPassword] = useState(""); //set static password first, later fetch from backend
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentOpenEye, setCurrentOpenEye] = useState(false);
  const [newOpenEye, setNewOpenEye] = useState(false);
  const [confirmOpenEye, setConfirmOpenEye] = useState(false);
  const [showEditUsername, setShowEditUsername] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const toggleEditUsernameModal = () => {
    setShowEditUsername(!showEditUsername);
  };

  const toggleChangePasswordModal = () => {
    setShowChangePassword(!showChangePassword);
  };

  const handleUsernameSave = (e) => {
    setUserName(newUserName);
    setNewUserName("");
    setShowEditUsername(false);

    //save to database
  };

  const handlePasswordSave = (e) => {
    setPassword(newPassword);
    setNewPassword("");
    setConfirmPassword("");
    setShowChangePassword("");

    //save to database
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

  return (
    <div className="admin-profile">
      <div style={{ marginTop: "40px", marginLeft: "60px" }}>
        <BreadCrumb name="Profile"></BreadCrumb>
      </div>
      <div>
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
                <Form.Control type="text" name="username" value={userName} />
                <Button
                  // variant="primary"
                  id="editUsername"
                  style={{
                    backgroundColor: "skyblue",
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
              variant="primary"
              style={{
                marginLeft: "60px",
                marginTop: "20px",
                backgroundColor: "skyblue",
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
          <Modal.Dialog show={showEditUsername}>
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
                  />
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
                  backgroundColor: "skyblue",
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
          <Modal.Dialog show={showChangePassword}>
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
                {currentOpenEye == false ? (
                  <div className="currentPassword">
                    <Form.Label
                      style={{
                        color: "#384D6C",
                        font: "Montserrat",
                        fontWeight: "700",
                        fontSize: "16px",
                      }}
                    >
                      Current Password
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text id="keyIcon">
                        <BsFillKeyFill
                          style={{ width: "24px", height: "24px" }}
                        ></BsFillKeyFill>
                      </InputGroup.Text>
                      <Form.Control
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Button
                        variant="info"
                        id="eyeIcon"
                        onClick={() => setCurrentOpenEye(true)}
                        style={{ backgroundColor: "skyblue" }}
                      >
                        <VscEyeClosed
                          style={{ width: "24px", height: "24px" }}
                        ></VscEyeClosed>
                      </Button>
                    </InputGroup>
                  </div>
                ) : (
                  <div className="currentPassword">
                    <Form.Label
                      style={{
                        color: "#384D6C",
                        font: "Montserrat",
                        fontWeight: "700",
                        fontSize: "16px",
                      }}
                    >
                      Current Password
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text id="keyIcon">
                        <BsFillKeyFill
                          style={{ width: "24px", height: "24px" }}
                        ></BsFillKeyFill>
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="password"
                        value={password}
                      />
                      <Button
                        variant="info"
                        id="currentEyeOpenIcon"
                        onClick={() => setCurrentOpenEye(false)}
                        style={{ backgroundColor: "skyblue" }}
                      >
                        <VscEye
                          style={{ width: "24px", height: "24px" }}
                        ></VscEye>
                      </Button>
                    </InputGroup>
                  </div>
                )}
                {newOpenEye == false ? (
                  <div className="newPassword">
                    <Form.Label
                      style={{
                        color: "#384D6C",
                        font: "Montserrat",
                        fontWeight: "700",
                        fontSize: "16px",
                      }}
                    >
                      New Password
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text id="keyIcon">
                        <BsFillKeyFill
                          style={{ width: "24px", height: "24px" }}
                        ></BsFillKeyFill>
                      </InputGroup.Text>
                      <Form.Control
                        type="password"
                        name="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <Button
                        variant="info"
                        id="newEyeIconClose"
                        onClick={() => setNewOpenEye(true)}
                        style={{ backgroundColor: "skyblue" }}
                      >
                        <VscEyeClosed
                          style={{ width: "24px", height: "24px" }}
                        ></VscEyeClosed>
                      </Button>
                    </InputGroup>
                  </div>
                ) : (
                  <div className="newPassword">
                    <Form.Label
                      style={{
                        color: "#384D6C",
                        font: "Montserrat",
                        fontWeight: "700",
                        fontSize: "16px",
                      }}
                    >
                      New Password
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text id="keyIcon">
                        <BsFillKeyFill
                          style={{ width: "24px", height: "24px" }}
                        ></BsFillKeyFill>
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <Button
                        variant="info"
                        id="newEyeIconOpen"
                        onClick={() => setNewOpenEye(false)}
                        style={{ backgroundColor: "skyblue" }}
                      >
                        <VscEye
                          style={{ width: "24px", height: "24px" }}
                        ></VscEye>
                      </Button>
                    </InputGroup>
                  </div>
                )}
                {confirmOpenEye == false ? (
                  <div className="confirmPassword">
                    <Form.Label
                      style={{
                        color: "#384D6C",
                        font: "Montserrat",
                        fontWeight: "700",
                        fontSize: "16px",
                      }}
                    >
                      Confirm New Password
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text id="keyIcon">
                        <BsFillKeyFill
                          style={{ width: "24px", height: "24px" }}
                        ></BsFillKeyFill>
                      </InputGroup.Text>
                      <Form.Control
                        type="password"
                        name="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <Button
                        variant="info"
                        id="confirmEyeOpenIcon"
                        onClick={() => setConfirmOpenEye(true)}
                        style={{ backgroundColor: "skyblue" }}
                      >
                        <VscEyeClosed
                          style={{ width: "24px", height: "24px" }}
                        ></VscEyeClosed>
                      </Button>
                    </InputGroup>
                  </div>
                ) : (
                  <div className="confirmPassword">
                    <Form.Label
                      style={{
                        color: "#384D6C",
                        font: "Montserrat",
                        fontWeight: "700",
                        fontSize: "16px",
                      }}
                    >
                      Confirm New Password
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text id="keyIcon">
                        <BsFillKeyFill
                          style={{ width: "24px", height: "24px" }}
                        ></BsFillKeyFill>
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <Button
                        variant="info"
                        id="confirmEyeCloseIcon"
                        onClick={() => setConfirmOpenEye(false)}
                        style={{ backgroundColor: "skyblue" }}
                      >
                        <VscEye
                          style={{ width: "24px", height: "24px" }}
                        ></VscEye>
                      </Button>
                    </InputGroup>
                  </div>
                )}
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
                  backgroundColor: "skyblue",
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
