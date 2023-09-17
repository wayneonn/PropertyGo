import { React, useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import "./Faq.css";
import { MdOutlineClose } from "react-icons/md";

const FaqEdit = ({ faqId, faqQuestion, faqAnswer, faqType, onClose }) => {
  const [newQuestion, setNewQuestion] = useState(faqQuestion);
  const [newAnswer, setNewAnswer] = useState(faqAnswer);

  const handleDelete = () => {
    //delete faq from database

    onClose(); //close this component once done
  };

  const handleEdit = () => {
    //edit faq in database
    //use newQuestion and newAnswer values

    onClose(); //close this component once done
  };

  return (
    <div>
      <Card style={{ width: "25rem", height: "36rem", border: "0" }}>
        <Card.Body>
          <div className="title">
            <Card.Title>{faqType} FAQ</Card.Title>
            <MdOutlineClose
              style={{ height: "25px", width: "25px", cursor: "pointer" }}
              onClick={() => onClose()}
            ></MdOutlineClose>
          </div>
          <Card.Subtitle className="subtitle">Question</Card.Subtitle>
          <Form.Control
            as="textarea"
            id="question"
            rows={6}
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
          />
          <Card.Subtitle className="subtitle">Answer</Card.Subtitle>
          <Form.Control
            as="textarea"
            id="answer"
            rows={6}
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
          />
        </Card.Body>
        <div className="button-container">
          <Button
            style={{
              border: "0",
              width: "92px",
              height: "40px",
              borderRadius: "160px",
              backgroundColor: "#F5F6F7",
              color: "black",
              font: "Public Sans",
              fontWeight: "600",
              fontSize: "14px",
            }}
            onClick={() => handleDelete()}
          >
            Delete
          </Button>
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
            onClick={() => handleEdit()}
          >
            Confirm
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default FaqEdit;
