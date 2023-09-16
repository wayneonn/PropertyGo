import { React, useState } from "react";
import "./styles/Topbar.css";
import { IoMdNotificationsOutline, IoIosLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const TopBar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const imageBasePath =
    window.location.protocol + "//" + window.location.host + "/images/";

  const handleLogout = () => {
    localStorage.removeItem("loggedInAdmin");

    navigate("/login");
  };

  return (
    <div className="topbar">
      <div className="searchbar">
        <img
          src={imageBasePath + "search.webp"}
          alt="search"
          // onClick={() => search(searchQuery)}
          style={{
            width: "18px",
            height: "18px",
            cursor: "pointer",
            marginLeft: "5px",
            marginRight: "5px",
          }}
        />
        <input
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            border: "0",
            backgroundColor: "#F2F3F480",
            fontSize: "14px",
            color: "#959FA3",
            marginLeft: "0.2em",
            height: "38px",
            width: "169px",
          }}
        />
      </div>
      <div className="icons-container">
        <IoMdNotificationsOutline className="notif"></IoMdNotificationsOutline>
        <IoIosLogOut className="notif" onClick={handleLogout}></IoIosLogOut>
      </div>
    </div>
  );
};

export default TopBar;
