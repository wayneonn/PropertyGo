import { React } from "react";
import Breadcrumb from "react-bootstrap/Breadcrumb";

const BreadCrumb = ({ name }) => {
  return (
    <Breadcrumb>
      <Breadcrumb.Item
        style={{
          color: "black",
          font: "Montserrat",
          fontWeight: "700",
          fontSize: "16px",
        }}
        href="/"
      >
        Home
      </Breadcrumb.Item>
      <Breadcrumb.Item
        style={{
          color: "black",
          font: "Montserrat",
          fontWeight: "700",
          fontSize: "16px",
        }}
        active
      >
        {name}
      </Breadcrumb.Item>
    </Breadcrumb>
  );
};

export default BreadCrumb;
