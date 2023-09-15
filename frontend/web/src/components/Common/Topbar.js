import { React, useState } from "react";
import "./Topbar.css";
import { IoMdNotificationsOutline } from "react-icons/io";

const TopBar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="topbar">
      <div className="searchbar">
        <img
          src="search.webp"
          alt="search"
          // onClick={() => search(searchQuery)}
          style={{
            width: "18px",
            height: "18px",
            cursor: "pointer",
            marginLeft: "10px",
            marginRight: "10px",
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
            height: "40px",
            width: "150px",
          }}
        />
      </div>
      <div>
        <IoMdNotificationsOutline className="notif"></IoMdNotificationsOutline>
      </div>
    </div>
  );
};

export default TopBar;
