import React, { useState } from "react";
import { ButtonGroup, ToggleButton } from "react-bootstrap";
import "./styles/Forum.css";
import BreadCrumb from "../components/Common/BreadCrumb.js";
import ForumTopic from "./ForumTopic";
import ForumPost from "./ForumPost";
import ForumComment from "./ForumComment";

const Forum = () => {
  const [selectedCategory, setSelectedCategory] = useState("TOPIC");

  const handleForumPageChange = (category) => {
    console.log(category);
    setSelectedCategory(category);
  };

  const components = {
    TOPIC: <ForumTopic />,
    POST: <ForumPost />,
    COMMENT: <ForumComment />,
  };

  return (
    <div
      style={{
        backgroundColor: "#0000000D",
        width: "calc(100% - 180px)",
        top: "60px",
        right: 0,
        bottom: 0,
        position: "fixed",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          marginTop: "10px",
          marginLeft: "30px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <BreadCrumb
          names={["Home"]}
          lastname="Forum"
          links={["/"]}
        ></BreadCrumb>
      </div>
      <ButtonGroup
        key="category-group"
        toggle="true"
        style={{
          marginLeft: "2em",
        }}
      >
        {Object.keys(components).map((category) => (
          <ToggleButton
            key={category + "-button"}
            type="radio"
            variant="warning"
            name="category"
            value={category}
            checked={selectedCategory === category}
            onClick={() => handleForumPageChange(category)}
          >
            {category}
          </ToggleButton>
        ))}
      </ButtonGroup>
      {components[selectedCategory]}
    </div>
  );
};

export default Forum;
