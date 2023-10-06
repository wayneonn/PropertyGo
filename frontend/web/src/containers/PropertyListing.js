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
  const [active, setActive] = useState([]);
  const [onhold, setOnhold] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [propertyStatus, setPropertyStatus] = useState("");

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

      const properties = responseProperty.data.filter(
        (property) => property.userId == userId
      );

      if (propertyStatus === "") {
        setProperties(properties);
      } else {
        const filtered = properties.filter(
          (property) => property.propertyStatus === propertyStatus
        );
        setProperties(filtered);
      }

      const active = responseProperty.data.filter(
        (property) => property.propertyStatus == "ACTIVE"
      );

      setActive(active);

      const onhold = responseProperty.data.filter(
        (property) => property.propertyStatus == "ON_HOLD"
      );

      setOnhold(onhold);

      const completed = responseProperty.data.filter(
        (property) => property.propertyStatus == "COMPLETED"
      );

      setCompleted(completed);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [propertyStatus]);

  function getPropertyClassName(status) {
    if (status === "ACTIVE") {
      return "status-active";
    } else if (status === "ON_HOLD") {
      return "status-on-hold";
    } else if (status === "COMPLETED") {
      return "status-completed";
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
          marginTop: "10px",
          marginLeft: "30px",
          display: "flex",
          justifyContent: "space-between",
          padding: "0",
        }}
      >
        <BreadCrumb
          names={["Home", "Users", "User Detail"]}
          lastname="Properties"
          links={["/", "/users", `/users/details/${userId}`]}
        ></BreadCrumb>
        <div className="filter">
          <Form.Select
            aria-label="Default select example"
            onChange={(e) => setPropertyStatus(e.target.value)}
            value={propertyStatus}
          >
            <option value="">All</option>
            <option value="ACTIVE">Active</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="COMPLETED">Completed</option>
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
                  <Card.Img
                    variant="top"
                    src={`data:image/jpeg;base64,${property.images[0]}`}
                    alt={`Property Image for ${property.title}`}
                  />
                ) : (
                  <Card.Img
                    variant="top"
                    src={imageBasePath + "login.jpeg"}
                    alt={`Property Image for ${property.title}`}
                  />
                )}
                <Card.Body>
                  <Card.Title>{property.title}</Card.Title>
                  <Card.Text>{property.description}</Card.Text>
                  <Card.Text>
                    <div
                      className={getPropertyClassName(property.propertyStatus)}
                    >
                      {property.propertyStatus}
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
          <span>No Property Listed</span>
        )}
      </div>
    </div>
  );
};

export default PropertyListing;
