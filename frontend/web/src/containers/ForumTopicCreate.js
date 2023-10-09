import { React, useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import "./styles/Faq.css";
import "react-quill/dist/quill.snow.css"; // Import the styles

import API from "../services/API";

const ForumTopicCreate = ({ showToast, fetchData }) => {
  const [forumTopicName, setForumTopicName] = useState("");

  // validation
  const [validationMessages, setValidationMessages] = useState({
    emptyForumTopicName: false,
    forumTopicNameUnique: false
  });

  const handleCreate = async (e) => {
    const newMessage = {
      emptyForumTopicName: false,
      forumTopicNameUnique: false
    };

    const forumTopicNameTrimmed = forumTopicName.trim();

    if (forumTopicNameTrimmed === "") {
      newMessage.emptyForumTopicName = true;
    }

    if (newMessage.emptyForumTopicName) {
      setValidationMessages(newMessage);
      return;
    }

    try {
      // Save to database
      const response = await API.post(
        `/admin/forumTopics?adminId=${localStorage.getItem("loggedInAdmin")}`,
        {
          topicName: forumTopicNameTrimmed
        }
      );

      if (response.status === 201) {
        showToast("created");
        setValidationMessages(newMessage);
        setForumTopicName("");

        fetchData();
      }
    } catch (error) {
      const status = error.response.status;
      if (status === 409) {
        newMessage.forumTopicNameUnique = true;
      }

      setValidationMessages(newMessage);
    }
  };

  return (
    <div>
      <Card style={{ width: "26rem", border: "0" }}>
        <Card.Body>
          <div className="body">
            <div style={{ marginTop: "10px" }}>
              <Card.Subtitle className="subtitle">Forum Topic Name</Card.Subtitle>
              <Form.Group>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={forumTopicName}
                  onChange={(e) => setForumTopicName(e.target.value)}
                  isInvalid={
                    validationMessages.emptyForumTopicName ||
                    validationMessages.forumTopicNameUnique
                  }
                />
                {validationMessages.emptyForumTopicName && (
                  <Form.Control.Feedback type="invalid">
                    Forum Topic Name is required.
                  </Form.Control.Feedback>
                )}
                {validationMessages.forumTopicNameUnique && (
                  <Form.Control.Feedback type="invalid">
                    Forum Topic Name already exists. Please type another Forum Topic Name.
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </div>
          </div>
        </Card.Body>
        <div className="button-container">
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
            onClick={handleCreate}
          >
            Create
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ForumTopicCreate;
