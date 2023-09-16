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

    // Check if both userName and password fields have values
    if (form.checkValidity() === true && userName && password) {
      try {
        const response = await API.post('/admin/auth/login', {
          userName,
          password
        });

        if (response.status === 200) {
          const { adminId, userName } = response.data;

          localStorage.setItem("adminId", adminId)
          localStorage.setItem("userName", userName);
          navigate("/admin/profile");
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
              src="login.jpeg"
              className="loginCardImage"
            />
          </Col>
          <Col className="loginRightSideCard">
            <Card.Body className="loginRightSideCardContent">
              <Card.Img
                src="Logo.png"
                className="loginPropertyGoIcon"
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
                      Please key in a username.
                    </Form.Control.Feedback>
                  </InputGroup>
                </div>
                <div className="loginSpacesBetweenInputs"></div>
                <div>
                  <Form.Label htmlFor="inputPassword">Password</Form.Label>
                  <br />
                  {openEye == false ? (
                    <InputGroup>
                      <Form.Control
                        type="password"
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
                        onClick={() => setOpenEye(true)}
                        style={{ backgroundColor: "#FFF066", border: "0" }}
                      >
                        <VscEyeClosed
                          style={{
                            width: "2em",
                            height: "1.5em",
                          }}
                        ></VscEyeClosed>
                      </Button>
                    </InputGroup>
                  ) : (
                    <InputGroup>
                      <Form.Control
                        type="text"
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
                        onClick={() => setOpenEye(false)}
                        style={{ backgroundColor: "#FFF066", border: "0" }}
                      >
                        <VscEye
                          style={{
                            width: "2em",
                            height: "1.5em",
                          }}
                        ></VscEye>
                      </Button>
                    </InputGroup>
                  )}
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
