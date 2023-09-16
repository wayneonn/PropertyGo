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

const SideBar = () => {
  return (
    <div className="navibar">
      <Nav defaultActiveKey="/" className="flex-column">
        <Nav.Item>
          <Image
            src="Logo.png"
            alt=".."
            style={{
              width: "30px",
              height: "30px",
              marginBottom: "2em",
              marginLeft: "0.6em",
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
          <Nav.Link className="a" href="/">
            <LiaClipboardListSolid
              style={{ marginRight: "1em" }}
            ></LiaClipboardListSolid>
            Users
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="a" href="/">
            <AiOutlineFolderOpen
              style={{ marginRight: "1em" }}
            ></AiOutlineFolderOpen>
            Lawyers
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="a" href="/">
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
          <Nav.Link className="a" href="/">
            <GoPerson style={{ marginRight: "1em" }}></GoPerson>
            Profile
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="a" href="/">
            <AiOutlineBook style={{ marginRight: "1em" }}></AiOutlineBook>
            Invoice
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="a" href="/">
            <AiOutlineCreditCard
              style={{ marginRight: "1em" }}
            ></AiOutlineCreditCard>
            Billing
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="a" href="/">
            <AiOutlineQuestionCircle
              style={{ marginRight: "1em" }}
            ></AiOutlineQuestionCircle>
            FAQs
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="a" href="/">
            <PiPuzzlePiece style={{ marginRight: "1em" }}></PiPuzzlePiece>
            Forum
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="a" href="/">
            <AiOutlineFolderOpen
              style={{ marginRight: "1em" }}
            ></AiOutlineFolderOpen>
            Properties
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="a" href="/">
            <LiaStickyNote style={{ marginRight: "1em" }}></LiaStickyNote>
            Contact Us
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
};

export default SideBar;