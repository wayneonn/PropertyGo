import { React, useState, useEffect } from "react";
import { Card, Button, Form, Table } from "react-bootstrap";
import "./styles/ContractorsList.css";
import API from "../services/API";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../components/Common/BreadCrumb.js";
import Pagination from "react-bootstrap/Pagination";
import base64 from "react-native-base64";

import { MdPreview } from "react-icons/md";

const ContractorsList = () => {
  const [contractors, setContractors] = useState([]);
  const [naContractors, setNaContractors] = useState([]);
  const [aContractors, setAContractors] = useState([]);
  const [searchQueryActive, setSearchQueryActive] = useState("");
  const [searchQueryInactive, setSearchQueryInactive] = useState("");

  const itemsPerPage = 4;

  const [currentPageNa, setCurrentPageNa] = useState(1);
  const [totalPageNa, setTotalPageNa] = useState(0);

  const indexOfLastItemNa = currentPageNa * itemsPerPage;
  const indexOfFirstItemNa = indexOfLastItemNa - itemsPerPage;

  const [currentPageA, setCurrentPageA] = useState(1);
  const [totalPageA, setTotalPageA] = useState(0);

  const indexOfLastItemA = currentPageA * itemsPerPage;
  const indexOfFirstItemA = indexOfLastItemA - itemsPerPage;

  const navigate = useNavigate();

  const imageBasePath =
    window.location.protocol + "//" + window.location.host + "/images/";

  const handlePageChangeNa = (pageNumber) => {
    setCurrentPageNa(pageNumber);
  };

  const handlePageChangeA = (pageNumber) => {
    setCurrentPageA(pageNumber);
  };

  const fetchData = async () => {
    try {
      const response = await API.get(`http://localhost:3000/admin/users`);
      const users = response.data;

      console.log(users);

      const contractors = users.filter((user) => user.userType == "CONTRACTOR");

      const naUsers = contractors.filter((user) => user.isActive === false);

      const aUsers = contractors.filter((user) => user.isActive === true);

      setContractors(users);
      setNaContractors(naUsers);
      setAContractors(aUsers);

      setTotalPageNa(Math.ceil(naUsers.length / itemsPerPage));
      setTotalPageA(Math.ceil(aUsers.length / itemsPerPage));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const searchActiveContractors = async (searchQueryActive) => {
    const fetchData = async () => {
      try {
        const response = await API.get(
          `http://localhost:3000/admin/users/search/active/contractors?q=${searchQueryActive}`
        );

        setAContractors(response.data);
        console.log("A users :" + response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  };

  const searchInactiveContractors = async (searchQueryInactive) => {
    const fetchData = async () => {
      try {
        const response = await API.get(
          `http://localhost:3000/admin/users/search/inactive/contractors?q=${searchQueryInactive}`
        );

        setNaContractors(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  };

  return (
    <div className="contractors">
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
          lastname="Contractors"
          links={["/"]}
        ></BreadCrumb>
      </div>
      <div className="contractorsList">
        <div className="heading">
          <h3
            style={{
              color: "black",
              font: "Montserrat",
              fontWeight: "700",
              fontSize: "16px",
              padding: "5px 10px 5px 10px",
            }}
          >
            Active Contractors
          </h3>
          <div className="searchbar-contractor">
            <input
              placeholder="Search username"
              value={searchQueryActive}
              onChange={(e) => setSearchQueryActive(e.target.value)}
            />
            <img
              src={imageBasePath + "search.svg"}
              alt="search"
              onClick={() => searchActiveContractors(searchQueryActive)}
            />
          </div>
        </div>
        <div>
          <Table hover responsive="sm" size="md">
            <thead
              style={{
                textAlign: "center",
              }}
            >
              <tr>
                <th style={{ width: "350px" }}>Profile Image</th>
                <th>Username</th>
                <th>Action</th>
              </tr>
            </thead>
            {Array.isArray(aContractors) && aContractors.length > 0 ? (
              <tbody>
                {aContractors
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
                            navigate(`/contractors/details/${user.userId}`)
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
                    There are no contractors
                  </td>
                </tr>
              </tbody>
            )}
          </Table>
        </div>
        <div>
          <Pagination className="contractors-paginate">
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
        </div>
      </div>
      <div className="contractorsList">
        <div className="heading">
          <h3
            style={{
              color: "black",
              font: "Montserrat",
              fontWeight: "700",
              fontSize: "16px",
              padding: "5px 10px 5px 10px",
            }}
          >
            Non active Contractors
          </h3>
          <div className="searchbar-contractor">
            <input
              placeholder="Search username"
              value={searchQueryInactive}
              onChange={(e) => setSearchQueryInactive(e.target.value)}
            />
            <img
              src={imageBasePath + "search.svg"}
              alt="search"
              onClick={() => searchInactiveContractors(searchQueryInactive)}
            />
          </div>
        </div>
        <div>
          <Table hover responsive="sm" size="md">
            <thead
              style={{
                textAlign: "center",
              }}
            >
              <tr>
                <th style={{ width: "350px" }}>Profile Image</th>
                <th>Username</th>
                <th>Action</th>
              </tr>
            </thead>
            {Array.isArray(naContractors) && naContractors.length > 0 ? (
              <tbody>
                {naContractors
                  .slice(indexOfFirstItemNa, indexOfLastItemNa)
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
                              style={{ height: "30px", width: "30px" }}
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
                            navigate(`/contractors/details/${user.userId}`)
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
                    There are no contractors
                  </td>
                </tr>
              </tbody>
            )}
          </Table>
        </div>
        <div>
          <Pagination className="contractors-paginate">
            {Array.from({ length: totalPageNa }).map((_, index) => (
              <Pagination.Item
                key={index}
                active={index + 1 === currentPageNa}
                onClick={() => handlePageChangeNa(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default ContractorsList;
