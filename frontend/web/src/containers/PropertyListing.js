import { React, useState, useEffect } from "react";
import { Card, Button, Form } from "react-bootstrap";
import "./styles/PropertyListing.css";
import { useParams, useNavigate } from "react-router-dom";
import BreadCrumb from "../components/Common/BreadCrumb.js";

import API from "../services/API";

const PropertyListing = () => {
  const [user, setUser] = useState({});
  const { userId } = useParams();
  const [properties, setProperties] = useState([]);
  const [propertyStatus, setPropertyStatus] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [propertyApproval, setPropertyApproval] = useState("");

  const imageBasePath =
    window.location.protocol + "//" + window.location.host + "/images/";

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await API.get(
        `http://localhost:3000/admin/users/getUser/${userId}`
      );
      setUser(response.data);

      const responseProperty = await API.get(
        `http://localhost:3000/admin/properties`
      );

      console.log(responseProperty.data);

      const properties = responseProperty.data.filter(
        (property) => property.sellerId == userId
      );

      properties.sort((a, b) => {
        const timestampA = new Date(a.updatedAt).getTime();
        const timestampB = new Date(b.updatedAt).getTime();
        return timestampB - timestampA;
      });

      // console.log(properties);

      // if (propertyStatus === "" && propertyType === "") {
      //   setProperties(properties);
      // } else {
      //   const filtered = properties
      //     .filter(
      //       (property) =>
      //         property.propertyStatus === propertyStatus ||
      //         property.propertyType
      //     )
      //     .filter((property) => property.propertyType === propertyType);
      //   setProperties(filtered);
      // }

      if (
        propertyStatus === "" &&
        propertyType === "" &&
        propertyApproval === ""
      ) {
        setProperties(properties);
      } else if (propertyStatus === "" && propertyApproval === "") {
        const filteredType = properties.filter(
          (property) => property.propertyType === propertyType
        );
        setProperties(filteredType);
      } else if (propertyType === "" && propertyApproval === "") {
        const filteredStatus = properties.filter(
          (property) => property.propertyStatus === propertyStatus
        );
        setProperties(filteredStatus);
      } else if (propertyType === "" && propertyStatus === "") {
        const filteredApproval = properties.filter(
          (property) => property.approvalStatus === propertyApproval
        );
        setProperties(filteredApproval);
      } else if (propertyStatus === "") {
        const filteredApprovalType = properties.filter(
          (property) =>
            property.propertyType === propertyType &&
            property.approvalStatus === propertyApproval
        );
        setProperties(filteredApprovalType);
      } else if (propertyType === "") {
        const filteredApprovalStatus = properties.filter(
          (property) =>
            property.propertyStatus === propertyStatus &&
            property.approvalStatus === propertyApproval
        );
        setProperties(filteredApprovalStatus);
      } else if (propertyApproval === "") {
        const filteredTypeStatus = properties.filter(
          (property) =>
            property.propertyType === propertyType &&
            property.propertyStatus === propertyStatus
        );
        setProperties(filteredTypeStatus);
      } else {
        const filtered = properties.filter(
          (property) =>
            property.propertyType === propertyType &&
            property.propertyStatus === propertyStatus &&
            property.approvalStatus === propertyApproval
        );
        setProperties(filtered);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [propertyStatus, propertyType, propertyApproval]);

  function getPropertyClassName(status) {
    if (status === "ACTIVE") {
      return "status-active";
    } else if (status === "ON_HOLD") {
      return "status-on-hold";
    } else if (status === "COMPLETED") {
      return "status-completed";
    }
  }

  function getPropertyTypeClassName(type) {
    if (type === "NEW_LAUNCH") {
      return "type-new";
    } else if (type === "RESALE") {
      return "type-resale";
    }
  }

  function getApprovalStatusClassName(status) {
    if (status === "PENDING") {
      return "status-pending";
    } else if (status === "APPROVED") {
      return "status-approved";
    } else if (status === "REJECTED") {
      return "status-rejected";
    }
  }

  function formatTime(postedAt) {
    const dateObject = new Date(postedAt);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const day = dateObject.getDate();
    const monthIndex = dateObject.getMonth();
    const year = dateObject.getFullYear();
    const formattedDate = `${day} ${months[monthIndex]} ${year}`;
    return formattedDate;
  }

  return (
    <div className="property-listing">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          // padding: "10px",
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
            names={["Home", "Users", "User Detail"]}
            lastname="Properties"
            links={["/", "/users", `/users/details/${userId}`]}
          ></BreadCrumb>
        </div>
        <div className="filter">
          <Form.Select
            aria-label="Default select example"
            onChange={(e) => setPropertyStatus(e.target.value)}
            value={propertyStatus}
            style={{ marginRight: "10px" }}
          >
            <option value="">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="COMPLETED">Completed</option>
          </Form.Select>
          <Form.Select
            aria-label="Default select example"
            onChange={(e) => setPropertyType(e.target.value)}
            value={propertyType}
          >
            <option value="">All types</option>
            <option value="RESALE">Resale</option>
            <option value="NEW_LAUNCH">New Launch</option>
          </Form.Select>
          <Form.Select
            aria-label="Default select example"
            onChange={(e) => setPropertyApproval(e.target.value)}
            value={propertyApproval}
          >
            <option value="">All Approval Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </Form.Select>
        </div>
      </div>
      <div className="property-container">
        {Array.isArray(properties) && properties.length > 0 ? (
          properties.map((property) => (
            <Card className="property-card" key={property.propertyListingid}>
              <a
                href={`/users/property/${property.propertyListingId}`}
                className="property-card-link"
              >
                {Array.isArray(property.images) &&
                property.images.length > 0 ? (
                  <div className="image-container-listing">
                    <Card.Img
                      variant="top"
                      src={`http://localhost:3000/image/${property.images[0].toString()}`}
                      alt={`Property Image for ${property.title}`}
                      className="image-listing"
                    />
                    {property.approvalStatus == "PENDING" && (
                      <Card.Img
                        variant="top"
                        src="https://images.emojiterra.com/google/noto-emoji/unicode-15/color/svg/2757.svg"
                        alt="Second Image"
                        className="image-listing-all overlay-image"
                        style={{
                          position: "absolute",
                          top: "1.5em",
                          left: "5.5em",
                          zIndex: 1,
                          width: "8em",
                          height: "8em",
                          opacity: 0.8,
                        }}
                      />
                    )}
                  </div>
                ) : (
                  <div className="image-container-listing">
                    <Card.Img
                      variant="top"
                      src={imageBasePath + "login.jpeg"}
                      alt={`Property Image for ${property.title}`}
                      className="image-listing"
                    />
                    {property.approvalStatus == "PENDING" && (
                      <Card.Img
                        variant="top"
                        src="https://images.emojiterra.com/google/noto-emoji/unicode-15/color/svg/2757.svg"
                        alt="Second Image"
                        className="image-listing-all overlay-image"
                        style={{
                          position: "absolute",
                          top: "1.5em",
                          left: "5.5em",
                          zIndex: 1,
                          width: "8em",
                          height: "8em",
                          opacity: 0.8,
                        }}
                      />
                    )}
                  </div>
                )}
                <Card.Body>
                  <Card.Title className="truncate-text-pl">
                    {property.title}
                  </Card.Title>
                  <Card.Text className="truncate-text-pl">
                    {property.description}
                  </Card.Text>
                  <Card.Text>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <div
                        className={getPropertyClassName(
                          property.propertyStatus
                        )}
                      >
                        {property.propertyStatus}
                      </div>
                      <div
                        className={getPropertyTypeClassName(
                          property.propertyType
                        )}
                      >
                        {property.propertyType}
                      </div>
                      <div
                        className={getApprovalStatusClassName(
                          property.approvalStatus
                        )}
                      >
                        {property.approvalStatus}
                      </div>
                    </div>
                  </Card.Text>
                  <Card.Text style={{ fontSize: "12px", opacity: "0.8" }}>
                    Date posted: {formatTime(property.createdAt)}
                  </Card.Text>
                </Card.Body>
              </a>
            </Card>
          ))
        ) : (
          <div className="no-property">
            <h3>No Property Listed</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyListing;
