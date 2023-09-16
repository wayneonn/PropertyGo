// components
import React, { useState } from "react";
import { 
  Card,
  Row, 
  Col, 
  Button,
  Form,
  InputGroup,
  Toast } from "react-bootstrap";
import { BiRightArrowAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

// utils
import API from "../services/API";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

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
          // TODO: Add localStorage
          navigate("/login");
        } 

      } catch (error) {
        setShow(true);
      }
  }
  };

  return (
    <div
      style={{
        backgroundColor: "#F5F6F7",
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div>
        <div
          style={{
            position: "fixed",
            top: "10%", // Adjust this value to control the vertical position
            left: "55%", // Center horizontally
            transform: "translateX(-50%)", // Center horizontally
            }}
          >
          <Row>
              <Col xs={6}>
                <Toast bg="warning" onClose={() => setShow(false)} show={show} delay={4000} autohide >
                  <Toast.Header>
                    <strong className="me-auto">Login Unsuccessful</strong>
                  </Toast.Header>
                  <Toast.Body>Please key in the valid credentials!</Toast.Body>
                </Toast>
              </Col>
          </Row>
        </div>
        <Card>
          <Row nogutters="true" style={{ display: "flex" }}>
            <Col>
              <Card.Img
                src="login.jpeg"
                style={{ width: "508px", height: "432px" }}
              />
            </Col>
            <Col
              style={{
                background: "#FFFFFF",
                width: "508px",
                height: "432px",
                display: "flex",
                justifyContent: "center", // Center horizontally
              }}
            >
              <Card.Body
                style={{
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Card.Img
                  src="Logo.png"
                  style={{
                    width: "100.78px",
                    height: "100.78px",
                    marginTop: "1em",
                  }}
                  alt="..."
                />
                <div style={{ padding: "0.7em" }}></div>
                <Card.Title style={{ fontWeight: "bold", fontSize: "24px" }}>
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
                        style={{
                          width: "30em",
                          height: "2.5em",
                          borderRadius: "0.5em",
                        }}
                        onChange={handleUserNameChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please key in a username.
                      </Form.Control.Feedback>
                    </InputGroup>
                  </div>
                  <div style={{marginTop: '0.3em'}}></div>
                  <div>
                    <Form.Label htmlFor="inputPassword">Password</Form.Label>
                    <Form.Control
                      required
                      type="password"
                      id="inputPassword"
                      placeholder="Password"
                      style={{
                        width: "30em",
                        height: "2.5em",
                        borderRadius: "0.5em",
                      }}
                      onChange={handlePasswordChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please key in a password.
                    </Form.Control.Feedback>
                  </div>
                  <div style={{marginTop: '1em'}}></div>
                  <div className="d-grid gap-2">
                    <Button
                      variant="warning"
                      size="md"
                      type="submit"
                      style={{
                        borderRadius: "160px",
                        backgroundColor: "#FDE933",
                        borderColor: "#FDE933",
                      }}
                    >
                      <span style={{ marginRight: "0.3em" }}>Login</span>
                      <BiRightArrowAlt />
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default Login;
