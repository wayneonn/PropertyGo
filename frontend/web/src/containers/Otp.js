import { React, useState, useEffect } from "react";
import { Card, Button, Form, Table, Modal } from "react-bootstrap";
import "./styles/Otp.css";
import API from "../services/API";
import { formats, modules } from "../components/Common/RichTextEditor";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../components/Common/BreadCrumb.js";
import Pagination from "react-bootstrap/Pagination";
import base64 from "react-native-base64";

const Otp = () => {
  const itemsPerPage = 4;

  const [currentPageSigned, setCurrentPageSigned] = useState(1);
  const [totalPageSigned, setTotalPageSigned] = useState(0);

  const indexOfLastItemSigned = currentPageSigned * itemsPerPage;
  const indexOfFirstItemSigned = indexOfLastItemSigned - itemsPerPage;

  const [currentPagePending, setCurrentPagePending] = useState(1);
  const [totalPagePending, setTotalPagePending] = useState(0);

  const indexOfLastItemPending = currentPagePending * itemsPerPage;
  const indexOfFirstItemPending = indexOfLastItemPending - itemsPerPage;

  const navigate = useNavigate();

  const imageBasePath =
    window.location.protocol + "//" + window.location.host + "/images/";

  const handlePageChangePending = (pageNumber) => {
    setCurrentPagePending(pageNumber);
  };

  const handlePageChangePaid = (pageNumber) => {
    setCurrentPageSigned(pageNumber);
  };

  const fetchData = async () => {
    try {
      // const response = await API.get(`http://localhost:3000/admin/users`);
      // const users = response.data;
      // setTotalPageSigned(Math.ceil(paidTransactions.length / itemsPerPage));
      // setTotalPagePending(Math.ceil(pendingTransactions.length / itemsPerPage));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="otp">
      <div
        style={{
          marginTop: "10px",
          marginLeft: "30px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <BreadCrumb names={["Home"]} lastname="OTP" links={["/"]}></BreadCrumb>
      </div>
      <div className="otpList">
        <div className="heading-otp">
          <h3
            style={{
              color: "black",
              font: "Montserrat",
              fontWeight: "700",
              fontSize: "16px",
              padding: "5px 10px 5px 10px",
            }}
          >
            Pending Signature
          </h3>
        </div>
        <div>
          <Table hover responsive="sm" size="md">
            <thead
              style={{
                textAlign: "center",
              }}
            >
              <tr>
                <th>OTP document</th>
                <th>Property Listing</th>
              </tr>
            </thead>
            {/* {Array.isArray(aUsers) && aUsers.length > 0 ? (
                <tbody>
                  {aUsers
                    .slice(indexOfFirstItemA, indexOfLastItemA)
                    .map((user) => (
                      <tr
                        key={user.userId}
                        style={{
                          textAlign: "center",
                        }}
                      >
                        <td>
                          {user.profileImage ? (
                            <>
                              <img
                                src={`data:image/jpeg;base64,${user.profileImage.toString(
                                  "base64"
                                )}`}
                                style={{
                                  height: "30px",
                                  width: "30px",
                                }}
                                alt="User Image"
                              />
                            </>
                          ) : (
                            <>
                              <>
                                <img
                                  src={imageBasePath + "user.png"}
                                  style={{ height: "30px", width: "30px" }}
                                />
                              </>
                            </>
                          )}
                        </td>
                        <td>{user.userName}</td>
                        <td>
                          <Button
                            size="sm"
                            title="View profile"
                            style={{
                              backgroundColor: "#FFD700",
                              border: "0",
                              marginRight: "10px",
                            }}
                            onClick={() =>
                              navigate(`/users/details/${user.userId}`)
                            }
                          >
                            <MdPreview
                              style={{
                                width: "18px",
                                height: "18px",
                                color: "black",
                              }}
                            ></MdPreview>
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center" }}>
                      There are no users
                    </td>
                  </tr>
                </tbody>
              )} */}
          </Table>
        </div>
        {/* <div>
            <Pagination className="otp-paginate">
              {Array.from({ length: totalPageA }).map((_, index) => (
                <Pagination.Item
                  key={index}
                  active={index + 1 === currentPageA}
                  onClick={() => handlePageChangeA(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </div> */}
      </div>
    </div>
  );
};

export default Otp;
