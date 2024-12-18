import React from "react";
import { Nav } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import "./styles/Sidebar.css";
import { LiaClipboardListSolid, LiaStickyNote } from "react-icons/lia";
import {
  AiOutlineFolderOpen,
  AiOutlineBook,
  AiOutlineCreditCard,
  AiOutlineQuestionCircle,
} from "react-icons/ai";
import { PiPuzzlePiece, PiHouseLine } from "react-icons/pi";
import { GoPerson } from "react-icons/go";
import { FaWpforms } from "react-icons/fa";
import { AiOutlineNotification } from "react-icons/ai";

const SideBar = () => {
  const imageBasePath =
    window.location.protocol + "//" + window.location.host + "/images/";

  return (
    <div className="navibar">
      <Nav defaultActiveKey="/profile" className="flex-column">
        <Nav.Item>
          <Image
            src={imageBasePath + "PropertyGo-HighRes-Logo.png"}
            alt=".."
            style={{
              width: "60px",
              height: "60px",
              marginBottom: "2em",
              marginLeft: "3em",
              marginTop: "1.5em",
            }}
          />
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="a" href="/">
            <PiHouseLine style={{ marginRight: "1em" }}></PiHouseLine>
            Dashboard
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="a" href="/users">
            <LiaClipboardListSolid
              style={{ marginRight: "1em" }}
            ></LiaClipboardListSolid>
            Users
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="a" href="/lawyers">
            <AiOutlineFolderOpen
              style={{ marginRight: "1em" }}
            ></AiOutlineFolderOpen>
            Lawyers
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="a" href="/contractors">
            <PiPuzzlePiece style={{ marginRight: "1em" }}></PiPuzzlePiece>
            Contractors
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            style={{
              color: "#959FA3",
              fontWeight: "500",
              fontSize: "12px",
              marginTop: "2em",
            }}
            eventKey="disabled"
            disabled
          >
            PAGES
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="a" href="/profile">
            <GoPerson style={{ marginRight: "1em" }}></GoPerson>
            Profile
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="a" href="/faqs">
            <AiOutlineQuestionCircle
              style={{ marginRight: "1em" }}
            ></AiOutlineQuestionCircle>
            FAQs
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="a" href="/forum">
            <PiPuzzlePiece style={{ marginRight: "1em" }}></PiPuzzlePiece>
            Forum
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="a" href="/properties">
            <AiOutlineFolderOpen
              style={{ marginRight: "1em" }}
            ></AiOutlineFolderOpen>
            Properties
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="a" href="/partner-application">
            <FaWpforms style={{ marginRight: "1em" }}></FaWpforms>
            Partner App
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="a" href="/contact-us">
            <LiaStickyNote style={{ marginRight: "1em" }}></LiaStickyNote>
            Contact Us
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="a" href="/otp">
            <AiOutlineCreditCard
              style={{ marginRight: "1em" }}
            ></AiOutlineCreditCard>
            OTP
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="a" href="/notifications">
            <AiOutlineNotification
              style={{ marginRight: "1em" }}
            ></AiOutlineNotification>
            Notification
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
};

export default SideBar;
