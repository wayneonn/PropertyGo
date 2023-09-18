import { React } from "react";
import "./styles/Footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <span
        style={{
          font: "Public Sans",
          fontWeight: "700",
          fontSize: "14px",
          textAlign: "center",
          padding: "10px",
          opacity: "0.8",
          color: "#999",
        }}
      >
        © 2023 - PropertyGo
      </span>
    </div>
  );
};

export default Footer;
