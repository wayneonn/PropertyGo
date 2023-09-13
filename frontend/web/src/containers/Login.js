// components
import React, { useState, useContext } from "react";
import { Card, Row, Col, Button, Form } from "react-bootstrap";
import { BiRightArrowAlt } from "react-icons/bi";

// utils
import API from "../services/API";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post('/admin/auth/login', {
        userName,
        password
      });

      if (response.status === 200) {
        alert("Login successful");
      } else {
        alert("Login unsuccessful");
      }

    } catch (error) {
      alert("Invalid credentials");
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
      <Card>
        <Row nogutters="true" style={{ display: "flex" }}>
          <Col>
            <Card.Img
              src="login.jpeg"
              style={{ width: "508px", height: "432px" }}
              alt="..."
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
              <Form onSubmit={handleSubmit}>
                <div>
                  <Form.Label htmlFor="inputUsername">Username</Form.Label>
                  <br />
                  <Form.Control
                    id="inputUsername"
                    placeholder="Username"
                    style={{
                      width: "30em",
                      height: "2.5em",
                      borderRadius: "0.5em",
                    }}
                    onChange={handleUserNameChange}
                  />
                </div>
                <br />
                <div>
                  <Form.Label htmlFor="inputPassword">Password</Form.Label>
                  <br />
                  <Form.Control
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
                </div>
                <br />
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
  );
};

export default Login;
