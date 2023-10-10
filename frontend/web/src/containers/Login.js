// components
import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Form,
  InputGroup,
  Toast
} from "react-bootstrap";
import { VscEyeClosed, VscEye } from "react-icons/vsc";
import { BiRightArrowAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

// css
import "./styles/Login.css";

// utils
import API from "../services/API";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [openEye, setOpenEye] = useState(false);

  // validation
  const [validated, setValidated] = useState(false);

  // toast message
  const [show, setShow] = useState(false);

  const navigate = useNavigate();
  const imageBasePath = window.location.protocol + "//" + window.location.host + "/images/";

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setValidated(true);

    const form = e.currentTarget;

    if (form.checkValidity() === true && userName && password) {
      try {
        const userNameTrimmed = userName.trim();

        const response = await API.post('/admin/auth/login', {
          userName : userNameTrimmed,
          password
        });

        if (response.status === 200) {
          const { adminId } = response.data;

          localStorage.setItem("loggedInAdmin", adminId);
          navigate("/profile");
        }

      } catch (error) {
        setShow(true);
      }
    }
  };

  return (
    <div className="loginContainer">
      <div className="loginToast">
        <Row>
          <Col xs={6}>
            <Toast bg="warning" onClose={() => setShow(false)} show={show} delay={4000} autohide>
              <Toast.Header>
                <strong className="me-auto">Login Unsuccessful</strong>
              </Toast.Header>
              <Toast.Body>Please key in the valid credentials!</Toast.Body>
            </Toast>
          </Col>
        </Row>
      </div>
      <Card>
        <Row nogutters="true" className="loginCardRow">
          <Col>
            <Card.Img
              src={imageBasePath + "login.jpeg"}
              className="loginCardImage"
            />
          </Col>
          <Col className="loginRightSideCard">
            <Card.Body className="loginRightSideCardContent">
              <Card.Img
                src={imageBasePath + "PropertyGo-HighRes-Logo.png"}
                className="loginPropertyGoIcon"
                style={{
                  width: "8em",
                  height: "7em",
                }}
              />
              <div className="loginSpacesBetweenInputs"></div>
              <Card.Title className="loginTitle">
                Login to your account
              </Card.Title>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <div>
                  <Form.Label htmlFor="inputUsername">Username</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      required
                      id="inputUsername"
                      placeholder="Username"
                      className="loginUsernameInput"
                      onChange={handleUserNameChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Username is required.
                    </Form.Control.Feedback>
                  </InputGroup>
                </div>
                <div className="loginSpacesBetweenInputs"></div>
                <div>
                  <Form.Label htmlFor="inputPassword">Password</Form.Label>
                  <br />
                  <InputGroup>
                    <Form.Control
                      required
                      type={openEye ? "text" : "password"}
                      id="inputPassword"
                      placeholder="Password"
                      style={{
                        width: "25em",
                        height: "2.5em",
                      }}
                      onChange={handlePasswordChange}
                    />
                    <Button
                      variant="info"
                      id="eyeIcon"
                      onClick={() => setOpenEye(!openEye)}
                      style={{ backgroundColor: "#FFF066", border: "0" }}
                    >
                      {openEye ? (
                        <VscEye
                          style={{
                            width: "2em",
                            height: "1.5em",
                          }}
                        ></VscEye>
                      ) : (
                        <VscEyeClosed
                          style={{
                            width: "2em",
                            height: "1.5em",
                          }}
                        ></VscEyeClosed>
                      )}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      Password is required.
                    </Form.Control.Feedback>
                  </InputGroup>
                </div>
                <div className="loginSpaceBetweeonPasswordInputButton"></div>
                <div className="d-grid gap-2">
                  <Button
                    variant="warning"
                    size="md"
                    type="submit"
                    className="loginButton"
                  >
                    <span className="loginTextButton">Login</span>
                    <BiRightArrowAlt />
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Login;