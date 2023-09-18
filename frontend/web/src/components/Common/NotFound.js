import React from "react";
import "./styles/NotFound.css";

const NotFound = () => {
  return (
    <div className="not-found">
      <div
        style={{
          textAlign: "center",
        }}
      >
        <h3
          style={{
            fontWeight: "400",
            font: "Montserrat",
          }}
        >
          404 Page Not Found
        </h3>
        <span>The page that you are looking for does not exist.</span>
      </div>
    </div>
  );
};

export default NotFound;
