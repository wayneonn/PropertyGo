import { React } from "react";
import Breadcrumb from "react-bootstrap/Breadcrumb";

const BreadCrumb = (props) => {
  return (
    <Breadcrumb>
      {props.names.map((name, index) => (
        <Breadcrumb.Item
          key={name}
          style={{
            color: "black",
            font: "Montserrat",
            fontWeight: "700",
            fontSize: "16px",
          }}
          href={props.links[index]} // Use index to get the corresponding link
        >
          {name}
        </Breadcrumb.Item>
      ))}
      <Breadcrumb.Item
        style={{
          color: "black",
          font: "Montserrat",
          fontWeight: "700",
          fontSize: "16px",
        }}
        active
      >
        {props.lastname}
      </Breadcrumb.Item>
    </Breadcrumb>
  );
};

export default BreadCrumb;
