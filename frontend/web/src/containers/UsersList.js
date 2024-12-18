import { React, useState, useEffect } from "react";
import { Card, Button, Form, Table } from "react-bootstrap";
import "./styles/UsersList.css";
import API from "../services/API";
import { formats, modules } from "../components/Common/RichTextEditor";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../components/Common/BreadCrumb.js";
import Pagination from "react-bootstrap/Pagination";
import base64 from "react-native-base64";

import { MdPreview } from "react-icons/md";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [naUsers, setNaUsers] = useState([]);
  const [aUsers, setAUsers] = useState([]);
  const [searchQueryActive, setSearchQueryActive] = useState("");
  const [searchQueryInactive, setSearchQueryInactive] = useState("");

  const itemsPerPage = 3;

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

      const buyerSeller = users.filter(
        (user) => user.userType == "BUYER_SELLER"
      );

      const naUsers = buyerSeller.filter((user) => user.isActive === false);

      const aUsers = buyerSeller.filter((user) => user.isActive === true);

      setUsers(users);
      setNaUsers(naUsers);
      setAUsers(aUsers);

      setTotalPageNa(Math.ceil(naUsers.length / itemsPerPage));
      setTotalPageA(Math.ceil(aUsers.length / itemsPerPage));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const searchActiveUsers = async (searchQueryActive) => {
    const fetchData = async () => {
      try {
        const response = await API.get(
          `http://localhost:3000/admin/users/search/active/users?q=${searchQueryActive}`
        );

        setAUsers(response.data);
        console.log("A users :" + response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  };

  const searchInactiveUsers = async (searchQueryInactive) => {
    const fetchData = async () => {
      try {
        const response = await API.get(
          `http://localhost:3000/admin/users/search/inactive/users?q=${searchQueryInactive}`
        );

        setNaUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  };

  return (
    <div className="users">
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
          lastname="Users"
          links={["/"]}
        ></BreadCrumb>
      </div>
      <div className="usersList">
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
            Active Users
          </h3>
          <div className="searchbar-user">
            <input
              placeholder="Search username"
              value={searchQueryActive}
              onChange={(e) => setSearchQueryActive(e.target.value)}
            />
            <img
              src={imageBasePath + "search.svg"}
              alt="search"
              onClick={() => searchActiveUsers(searchQueryActive)}
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
            {Array.isArray(aUsers) && aUsers.length > 0 ? (
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
            )}
          </Table>
        </div>
        <div>
          <Pagination className="users-paginate">
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
      <div className="usersList">
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
            Non active Users
          </h3>
          <div className="searchbar-user">
            <input
              placeholder="Search username"
              value={searchQueryInactive}
              onChange={(e) => setSearchQueryInactive(e.target.value)}
            />
            <img
              src={imageBasePath + "search.svg"}
              alt="search"
              onClick={() => searchInactiveUsers(searchQueryInactive)}
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
            {Array.isArray(naUsers) && naUsers.length > 0 ? (
              <tbody>
                {naUsers
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
            )}
          </Table>
        </div>
        <div>
          <Pagination className="users-paginate">
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

export default UsersList;
