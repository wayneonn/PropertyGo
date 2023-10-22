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
  const [transactions, setTransactions] = useState([]);
  const [paidTransactions, setPaidTransactions] = useState([]);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);

  const itemsPerPage = 4;

  const [currentPagePaid, setCurrentPagePaid] = useState(1);
  const [totalPagePaid, setTotalPagePaid] = useState(0);

  const indexOfLastItemPaid = currentPagePaid * itemsPerPage;
  const indexOfFirstItemPaid = indexOfLastItemPaid - itemsPerPage;

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
    setCurrentPagePaid(pageNumber);
  };

  const fetchData = async () => {
    try {
      const response = await API.get(
        `http://localhost:3000/admin/transactions`
      );
      const transactions = response.data.transactions;

      console.log(transactions);

      const onHoldTransactions = transactions.filter(
        (transaction) => transaction.onHoldBalance > 0
      );

      const paidTransactions = onHoldTransactions.filter(
        (transaction) => transaction.status == "PAID"
      );

      const pendingTransactions = onHoldTransactions.filter(
        (transaction) => transaction.status == "PENDING"
      );

      setTransactions(onHoldTransactions);
      setPaidTransactions(paidTransactions);
      setPendingTransactions(pendingTransactions);

      setTotalPagePaid(Math.ceil(paidTransactions.length / itemsPerPage));
      setTotalPagePending(Math.ceil(pendingTransactions.length / itemsPerPage));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleReleaseModal = async () => {
    setShowReleaseModal(!showReleaseModal);
  };

  const handleCloseReleaseModal = () => {
    setShowReleaseModal(false);
  };

  const toggleRefundModal = async () => {
    setShowRefundModal(!showRefundModal);
  };

  const handleCloseRefundModal = () => {
    setShowRefundModal(false);
  };

  const handleReleasePayment = () => {};

  const handleRefund = () => {};

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
        <BreadCrumb
          names={["Home"]}
          lastname="Users"
          links={["/"]}
        ></BreadCrumb>
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
            Pending Payments
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
                <th>On Hold Balance</th>
                <th style={{ width: "600px" }}>Action</th>
              </tr>
            </thead>
            {Array.isArray(pendingTransactions) &&
            pendingTransactions.length > 0 ? (
              <tbody>
                {pendingTransactions
                  .slice(indexOfFirstItemPending, indexOfLastItemPending)
                  .map((transaction) => (
                    <tr
                      key={transaction.transactionId}
                      style={{
                        textAlign: "center",
                      }}
                    >
                      <td>S$ {transaction.onHoldBalance}</td>
                      <td>
                        <Button
                          size="sm"
                          title="View property listing"
                          style={{
                            backgroundColor: "#FFD700",
                            border: "0",
                            marginRight: "10px",
                            color: "black",
                          }}
                          onClick={() =>
                            navigate(`/property/${transaction.propertyId}`)
                          }
                        >
                          View Property Listing
                        </Button>
                        <Button
                          size="sm"
                          title="Release payment to seller"
                          style={{
                            backgroundColor: "#FFD700",
                            border: "0",
                            marginRight: "10px",
                            color: "black",
                          }}
                          onClick={() => toggleReleaseModal()}
                        >
                          Release Payment to seller
                        </Button>
                        <Button
                          size="sm"
                          title="Refund payment to buyer"
                          style={{
                            backgroundColor: "#FFD700",
                            border: "0",
                            marginRight: "10px",
                            color: "black",
                          }}
                          onClick={() => toggleRefundModal()}
                        >
                          Refund Payment to buyer
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan="2" style={{ textAlign: "center" }}>
                    There are no pending payments
                  </td>
                </tr>
              </tbody>
            )}
          </Table>
        </div>
        <div>
          <Pagination className="otp-paginate">
            {Array.from({ length: totalPagePending }).map((_, index) => (
              <Pagination.Item
                key={index}
                active={index + 1 === currentPagePending}
                onClick={() => handlePageChangePending(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      </div>
      <div className="otpList">
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
            Paid payments
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
                <th>Status</th>
                <th>Balance</th>
                <th style={{ width: "400px" }}>Action</th>
              </tr>
            </thead>
            {Array.isArray(paidTransactions) && paidTransactions.length > 0 ? (
              <tbody>
                {paidTransactions
                  .slice(indexOfFirstItemPaid, indexOfLastItemPaid)
                  .map((transaction) => (
                    <tr
                      key={transaction.transactionId}
                      style={{
                        textAlign: "center",
                      }}
                    >
                      <td>{transaction.status}</td>
                      <td>S$ {transaction.onHoldBalance}</td>
                      <td>
                        <Button
                          size="sm"
                          title="View property listing"
                          style={{
                            backgroundColor: "#FFD700",
                            border: "0",
                            marginRight: "10px",
                            color: "black",
                          }}
                          onClick={() =>
                            navigate(`/property/${transaction.propertyId}`)
                          }
                        >
                          View property listing
                        </Button>
                        <Button
                          size="sm"
                          title="View prospective buyer"
                          style={{
                            backgroundColor: "#FFD700",
                            border: "0",
                            marginRight: "10px",
                            color: "black",
                          }}
                          onClick={() =>
                            navigate(`/users/details/${transaction.buyerId}`)
                          }
                        >
                          View prospective buyer
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>
                    There are no paid payments
                  </td>
                </tr>
              </tbody>
            )}
          </Table>
        </div>
        <div>
          <Pagination className="otp-paginate">
            {Array.from({ length: totalPagePaid }).map((_, index) => (
              <Pagination.Item
                key={index}
                active={index + 1 === currentPagePaid}
                onClick={() => handlePageChangePaid(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      </div>
      <Modal
        show={showReleaseModal}
        onHide={handleCloseReleaseModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "20px" }}>
            Release payment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to release otp payment to the seller?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{
              backgroundColor: "#F5F6F7",
              border: "0",
              width: "92px",
              height: "40px",
              borderRadius: "160px",
              color: "black",
              font: "Public Sans",
              fontWeight: "600",
              fontSize: "14px",
            }}
            onClick={handleCloseReleaseModal}
          >
            No
          </Button>
          <Button
            style={{
              backgroundColor: "#FFD700",
              border: "0",
              width: "92px",
              height: "40px",
              borderRadius: "160px",
              color: "black",
              font: "Public Sans",
              fontWeight: "600",
              fontSize: "14px",
            }}
            onClick={handleReleasePayment}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showRefundModal}
        onHide={handleCloseRefundModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "20px" }}>Refund payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to refund otp payment to the buyer?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{
              backgroundColor: "#F5F6F7",
              border: "0",
              width: "92px",
              height: "40px",
              borderRadius: "160px",
              color: "black",
              font: "Public Sans",
              fontWeight: "600",
              fontSize: "14px",
            }}
            onClick={handleCloseRefundModal}
          >
            No
          </Button>
          <Button
            style={{
              backgroundColor: "#FFD700",
              border: "0",
              width: "92px",
              height: "40px",
              borderRadius: "160px",
              color: "black",
              font: "Public Sans",
              fontWeight: "600",
              fontSize: "14px",
            }}
            onClick={handleRefund}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Otp;
