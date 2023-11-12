import React from "react";
import Image from "react-bootstrap/Image";
import "./styles/NotFound.css";

const LogoutNotFound = () => {
  const imageBasePath =
    window.location.protocol + "//" + window.location.host + "/images/";

  return (
    <div className="logout-not-found">
      <div style={{ marginBottom: "40px" }}>
        <Image
          src={imageBasePath + "PropertyGo-HighRes-Logo.png"}
          alt=".."
          style={{
            width: "150px",
            height: "150px",
          }}
        />
      </div>
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
  );
};

export default LogoutNotFound;
