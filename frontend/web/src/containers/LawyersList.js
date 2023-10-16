import { React, useState, useEffect } from "react";
import { Card, Button, Form, Table } from "react-bootstrap";
import "./styles/LawyersList.css";
import API from "../services/API";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../components/Common/BreadCrumb.js";
import Pagination from "react-bootstrap/Pagination";
import base64 from "react-native-base64";

import { MdPreview } from "react-icons/md";

const LawyersList = () => {
  const [lawyers, setLawyers] = useState([]);
  const [naLawyers, setNaLawyers] = useState([]);
  const [aLawyers, setALawyers] = useState([]);
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

      const lawyers = users.filter((user) => user.userType == "LAWYER");

      const naLawyers = lawyers.filter((user) => user.isActive === false);

      const aLawyers = lawyers.filter((user) => user.isActive === true);

      setLawyers(lawyers);
      setNaLawyers(naLawyers);
      setALawyers(aLawyers);

      setTotalPageNa(Math.ceil(naLawyers.length / itemsPerPage));
      setTotalPageA(Math.ceil(aLawyers.length / itemsPerPage));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const searchActiveLawyers = async (searchQueryActive) => {
    const fetchData = async () => {
      try {
        const response = await API.get(
          `http://localhost:3000/admin/users/search/active/lawyers?q=${searchQueryActive}`
        );

        setALawyers(response.data);
        console.log("A users :" + response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  };

  const searchInactiveLawyers = async (searchQueryInactive) => {
    const fetchData = async () => {
      try {
        const response = await API.get(
          `http://localhost:3000/admin/users/search/inactive/lawyers?q=${searchQueryInactive}`
        );

        setNaLawyers(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  };

  return (
    <div className="lawyers">
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
          lastname="Lawyers"
          links={["/"]}
        ></BreadCrumb>
      </div>
      <div className="lawyersList">
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
            Active Lawyers
          </h3>
          <div className="searchbar-lawyer">
            <input
              placeholder="Search username"
              value={searchQueryActive}
              onChange={(e) => setSearchQueryActive(e.target.value)}
            />
            <img
              src={imageBasePath + "search.svg"}
              alt="search"
              onClick={() => searchActiveLawyers(searchQueryActive)}
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
            {Array.isArray(aLawyers) && aLawyers.length > 0 ? (
              <tbody>
                {aLawyers
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
                            navigate(`/lawyers/details/${user.userId}`)
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
                    There are no lawyers
                  </td>
                </tr>
              </tbody>
            )}
          </Table>
        </div>
        <div>
          <Pagination className="lawyers-paginate">
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
      <div className="lawyersList">
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
            Non active Lawyers
          </h3>
          <div className="searchbar-lawyer">
            <input
              placeholder="Search username"
              value={searchQueryInactive}
              onChange={(e) => setSearchQueryInactive(e.target.value)}
            />
            <img
              src={imageBasePath + "search.svg"}
              alt="search"
              onClick={() => searchInactiveLawyers(searchQueryInactive)}
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
            {Array.isArray(naLawyers) && naLawyers.length > 0 ? (
              <tbody>
                {naLawyers
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
                            navigate(`/lawyers/details/${user.userId}`)
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
                    There are no lawyers
                  </td>
                </tr>
              </tbody>
            )}
          </Table>
        </div>
        <div>
          <Pagination className="lawyers-paginate">
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

export default LawyersList;
