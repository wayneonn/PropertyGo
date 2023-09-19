import React from "react";
import "./styles/NotFound.css";

import SideBar from "./SideBar";
import TopBar from "./TopBar";
import LogoutNotFound from "./LogoutNotFound";

const NotFound = () => {
  const isLoggedIn = localStorage.getItem("loggedInAdmin");

  return (
    <>
      <div>
        {isLoggedIn && (
          <div>
            <SideBar />
            <TopBar />
          </div>
        )}
        ;
      </div>
      <div>
        {isLoggedIn ? (
          <div className="not-found">
            <div
              style={{
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  fontWeight: "400",
                  font: "Montserrat",
                }}
              >
                404 Page Not Found
              </h3>
              <span>The page that you are looking for does not exist.</span>
            </div>
          </div>
        ) : (
          <LogoutNotFound />
        )}
      </div>
    </>
  );
};

export default NotFound;