import { React, useState, useEffect } from "react";
import { Card, Button, Form } from "react-bootstrap";
import "./styles/AllProperties.css";
import { useParams, useNavigate } from "react-router-dom";
import BreadCrumb from "../components/Common/BreadCrumb.js";

import API from "../services/API";

const AllProperties = () => {
  const [properties, setProperties] = useState([]);
  const [propertyStatus, setPropertyStatus] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [propertyApproval, setPropertyApproval] = useState("");
  const [sellerInfo, setSellerInfo] = useState({});

  const imageBasePath =
    window.location.protocol + "//" + window.location.host + "/images/";

  const navigate = useNavigate();

  const fetchSellerInfo = async (property) => {
    const sellerId = property.sellerId;

    try {
      const sellerResponse = await API.get(
        `http://localhost:3000/admin/users/getUser/${sellerId}`
      );
      return {
        ...sellerInfo,
        [property.propertyListingId]: sellerResponse.data,
      };
    } catch (error) {
      console.error("Error fetching seller information:", error);
      return sellerInfo;
    }
  };

  const fetchData = async () => {
    const responseProperty = await API.get(
      `http://localhost:3000/admin/properties`
    );

    const properties = responseProperty.data;

    properties.sort((a, b) => {
      const timestampA = new Date(a.updatedAt).getTime();
      const timestampB = new Date(b.updatedAt).getTime();
      return timestampB - timestampA;
    });

    console.log("properties:" + responseProperty.data.length);

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
          property.approvalStatus === propertyStatus
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

    const sellerInfoPromises = properties.map((property) =>
      fetchSellerInfo(property)
    );

    Promise.all(sellerInfoPromises)
      .then((updatedSellerInfoArray) => {
        const updatedSellerInfo = Object.assign({}, ...updatedSellerInfoArray);
        setSellerInfo(updatedSellerInfo);
      })
      .catch((error) => {
        console.error("Error fetching seller information:", error);
      });
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
      return "status-pending-all";
    } else if (status === "APPROVED") {
      return "status-approved-all";
    } else if (status === "REJECTED") {
      return "status-rejected-all";
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
    <div className="property-listing-all">
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
            names={["Home"]}
            lastname="Properties"
            links={["/"]}
          ></BreadCrumb>
        </div>
        <div className="filter-all">
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
            style={{ marginRight: "10px" }}
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
      <div className="property-container-all">
        {Array.isArray(properties) && properties.length > 0 ? (
          properties.map((property) => (
            <Card
              className="property-card-all"
              key={property.propertyListingid}
            >
              <a
                href={`/property/${property.propertyListingId}`}
                className="property-card-link-all"
              >
                {Array.isArray(property.images) &&
                property.images.length > 0 ? (
                  <div className="image-container-listing-all">
                    <Card.Img
                      variant="top"
                      src={`http://localhost:3000/image/${property.images[0].toString()}`}
                      alt={`Property Image for ${property.title}`}
                      className="image-listing-all"
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
                  <div className="image-container-listing-all">
                    <Card.Img
                      variant="top"
                      src={imageBasePath + "login.jpeg"}
                      alt={`Property Image for ${property.title}`}
                      className="image-listing-all"
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
                  <Card.Title className="truncate-text-pl-all">
                    {property.title}
                  </Card.Title>
                  <Card.Text className="truncate-text-pl-all">
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
                  <Card.Text
                    style={{
                      fontSize: "12px",
                      opacity: "0.8",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    Seller:{" "}
                    {sellerInfo[property.propertyListingId] &&
                      (sellerInfo[property.propertyListingId].profileImage ? (
                        <>
                          <img
                            src={`data:image/jpeg;base64,${sellerInfo[
                              property.propertyListingId
                            ].profileImage.toString("base64")}`}
                            style={{
                              height: "15px",
                              width: "15px",
                              marginLeft: "10px",
                              marginRight: "5px",
                            }}
                            alt="user"
                          />
                        </>
                      ) : (
                        <>
                          <>
                            <img
                              src={imageBasePath + "user.png"}
                              style={{
                                height: "15px",
                                width: "15px",
                                marginLeft: "10px",
                                marginRight: "5px",
                              }}
                              alt="default user"
                            />
                          </>
                        </>
                      ))}
                    {sellerInfo[property.propertyListingId]
                      ? sellerInfo[property.propertyListingId].userName
                      : "N/A"}
                  </Card.Text>
                </Card.Body>
              </a>
            </Card>
          ))
        ) : (
          <div className="no-property-all">
            <h3>No Property Listed</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProperties;
