import { React, useState, useEffect } from "react";
import { Button, Table, Modal, Form } from "react-bootstrap";
import "./styles/Contactus.css";
import BreadCrumb from "../components/Common/BreadCrumb.js";

import API from "../services/API";

import Pagination from "react-bootstrap/Pagination";

const ContactUs = () => {
  const [contactus, setContactus] = useState([]);
  const [pendingContactus, setPendingContactus] = useState([]);
  const [repliedContactus, setRepliedContactus] = useState([]);

  const itemsPerPage = 4;

  const [currentPagePending, setCurrentPagePending] = useState(1);
  const [totalPagePending, setTotalPagePending] = useState(0);

  const indexOfLastItemPending = currentPagePending * itemsPerPage;
  const indexOfFirstItemPending = indexOfLastItemPending - itemsPerPage;

  const [currentPageReplied, setCurrentPageReplied] = useState(1);
  const [totalPageReplied, setTotalPageReplied] = useState(0);

  const indexOfLastItemReplied = currentPageReplied * itemsPerPage;
  const indexOfFirstItemReplied = indexOfLastItemReplied - itemsPerPage;

  const handlePageChangePending = (pageNumber) => {
    setCurrentPagePending(pageNumber);
  };

  const handlePageChangeReplied = (pageNumber) => {
    setCurrentPageReplied(pageNumber);
  };

  return (
    <div className="contactus">
      <div
        style={{
          marginTop: "20px",
          marginLeft: "30px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <BreadCrumb name="Contact Us"></BreadCrumb>
      </div>
      <div className="displayContactus">
        <div className="pendingContactus"></div>
        <div className="repliedContactus"></div>
      </div>
    </div>
  );
};

export default ContactUs;
