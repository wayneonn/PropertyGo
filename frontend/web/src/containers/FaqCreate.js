import { React, useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import "./Faq.css";

import API from "../services/API";

const FaqCreate = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [faqType, setFaqType] = useState("");

  // validation
  const [validated, setValidated] = useState(false);
  const [validationMessages, setValidationMessages] = useState({
    emptyFaqType: false,
    emptyFaqQuestion: false,
    emptyFaqAnswer: false,
    faqQuestionUnique: false
  });

  const handleCreate = async (e) => {
    const newMessage = {
      emptyFaqType: false,
      emptyFaqQuestion: false,
      emptyFaqAnswer: false,
      faqQuestionUnique: false
    };

    const questionTrimmed = question.trim();
    const answerTrimmed = answer.trim();

    if (questionTrimmed === "") {
      newMessage.emptyFaqQuestion = true;
    }

    if (answerTrimmed === "") {
      newMessage.emptyFaqAnswer = true;
    }

    if (faqType === "") {
      newMessage.emptyFaqType = true;
    }

    if (
      newMessage.emptyFaqQuestion ||
      newMessage.emptyFaqAnswer ||
      newMessage.emptyFaqType
    ) {
      setValidationMessages(newMessage);
      return;
    }

    try {
      // Save to database
      const response = await API.post(`/admin/faqs?adminId=${localStorage.getItem("loggedInAdmin")}`, {
        question,
        answer,
        faqType
      });

      if (response.status === 201) {
        alert("created successfully");
        setValidationMessages(newMessage);
        setFaqType("");
        setQuestion("");
        setAnswer("");

        // showToast("password");
      }
    } catch (error) {
      const status = error.response.status;
      if (status === 409) {
        newMessage.faqQuestionUnique = true;
      } 

      setValidationMessages(newMessage);
    }

  };

  return (
    <div>
      <Card style={{ width: "25rem", height: "36rem", border: "0" }}>
        <Card.Body>
          <div className="title">
            <Card.Title>Create a FAQ</Card.Title>
          </div>
          <Form noValidate validated={validated} id="faqForm">
            <Card.Subtitle className="subtitle">FAQ Type</Card.Subtitle>
            <Form.Select aria-label="Default select example" isInvalid={validationMessages.emptyFaqType} onChange={(e) => setFaqType(e.target.value)} value={faqType}>
              <option value="">Select a FAQ Type</option>
              <option value="SELLER">
                SELLER
              </option>
              <option value="BUYER">
                BUYER
              </option>
            </Form.Select>
            {validationMessages.emptyFaqType && (
              <Form.Control.Feedback type="invalid">
                FAQ Type is required.
              </Form.Control.Feedback>
            )}
            <Card.Subtitle className="subtitle">Question</Card.Subtitle>
            <Form.Control
              as="textarea"
              id="question"
              rows={5}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              isInvalid={validationMessages.emptyFaqQuestion || validationMessages.faqQuestionUnique}
            />
            {validationMessages.emptyFaqQuestion && (
              <Form.Control.Feedback type="invalid">
                Question is required.
              </Form.Control.Feedback>
            )}
            {validationMessages.faqQuestionUnique && (
              <Form.Control.Feedback type="invalid">
                Question already exists. Please type another question.
              </Form.Control.Feedback>
            )}
            <Card.Subtitle className="subtitle">Answer</Card.Subtitle>
            <Form.Control
              as="textarea"
              id="answer"
              rows={5}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              isInvalid={validationMessages.emptyFaqAnswer}
            />
            {validationMessages.emptyFaqAnswer && (
              <Form.Control.Feedback type="invalid">
                Answer is required.
              </Form.Control.Feedback>
            )}
          </Form>
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

export default FaqCreate;
