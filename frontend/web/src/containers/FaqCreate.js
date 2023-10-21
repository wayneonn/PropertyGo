import { React, useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import "./styles/Faq.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import the styles

import API from "../services/API";
import { formats, modules } from "../components/Common/RichTextEditor";

const FaqCreate = ({ showToast }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [faqType, setFaqType] = useState("");

  // validation
  const [validationMessages, setValidationMessages] = useState({
    emptyFaqType: false,
    emptyFaqQuestion: false,
    emptyFaqAnswer: false,
    faqQuestionUnique: false,
  });

  const handleCreate = async (e) => {
    const newMessage = {
      emptyFaqType: false,
      emptyFaqQuestion: false,
      emptyFaqAnswer: false,
      faqQuestionUnique: false,
    };

    const questionTrimmed = htmlToPlainText(question).trim();
    const answerTrimmed = htmlToPlainText(answer).trim();

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
      const response = await API.post(
        `/admin/faqs?adminId=${localStorage.getItem("loggedInAdmin")}`,
        {
          question,
          answer,
          faqType,
        }
      );

      if (response.status === 201) {
        showToast("created");
        setValidationMessages(newMessage);
        setFaqType("");
        setQuestion("");
        setAnswer("");
      }
    } catch (error) {
      const status = error.response.status;
      if (status === 409) {
        newMessage.faqQuestionUnique = true;
      }

      setValidationMessages(newMessage);
    }
  };

  function htmlToPlainText(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return doc.body.textContent || "";
  }

  return (
    <div>
      <Card style={{ width: "26rem", height: "38rem", border: "0" }}>
        <Card.Body>
          <div className="title">
            <Card.Title>Create a FAQ</Card.Title>
          </div>
          <Card.Subtitle className="subtitle">FAQ Type</Card.Subtitle>
          <Form.Select
            aria-label="Default select example"
            isInvalid={validationMessages.emptyFaqType}
            onChange={(e) => setFaqType(e.target.value)}
            value={faqType}
          >
            <option value="">Select a FAQ Type</option>
            <option value="SELLER">SELLER</option>
            <option value="BUYER">BUYER</option>
          </Form.Select>
          {validationMessages.emptyFaqType && (
            <Form.Control.Feedback type="invalid">
              FAQ Type is required.
            </Form.Control.Feedback>
          )}
          <div className="body">
            <div style={{ marginTop: "10px" }}>
              <Card.Subtitle className="subtitle">Question</Card.Subtitle>
              <Form.Group>
                <ReactQuill
                  value={question}
                  onChange={setQuestion}
                  theme="snow"
                  className={
                    validationMessages.emptyFaqQuestion ||
                    validationMessages.faqQuestionUnique
                      ? "is-invalid"
                      : ""
                  }
                  modules={modules}
                  formats={formats}
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
              </Form.Group>
            </div>
            <div style={{ marginTop: "10px" }}>
              <Card.Subtitle className="subtitle">Answer</Card.Subtitle>
              <Form.Group>
                <ReactQuill
                  value={answer}
                  onChange={setAnswer}
                  theme="snow"
                  className={
                    validationMessages.emptyFaqAnswer ? "is-invalid" : ""
                  }
                  modules={modules}
                  formats={formats}
                />
                {validationMessages.emptyFaqAnswer && (
                  <Form.Control.Feedback type="invalid">
                    Answer is required.
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

export default FaqCreate;
