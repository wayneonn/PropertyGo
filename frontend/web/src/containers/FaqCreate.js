import { React, useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import "./Faq.css";

const FaqCreate = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleCreate = () => {
    //add faq into database
  };

  return (
    <div>
      <Card style={{ width: "25rem", height: "36rem", border: "0" }}>
        <Card.Body>
          <div className="title">
            <Card.Title>Create a FAQ</Card.Title>
          </div>
          <Card.Subtitle className="subtitle">Question</Card.Subtitle>
          <Form.Control
            as="textarea"
            id="question"
            rows={6}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <Card.Subtitle className="subtitle">Answer</Card.Subtitle>
          <Form.Control
            as="textarea"
            id="answer"
            rows={6}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
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
            onClick={() => handleCreate()}
          >
            Create
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default FaqCreate;
