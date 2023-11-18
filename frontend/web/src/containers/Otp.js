import { React, useState, useEffect, useRef } from "react";
import { Table, Button } from "react-bootstrap";
import "./styles/Otp.css";
import API from "../services/API";
import { formats, modules } from "../components/Common/RichTextEditor";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../components/Common/BreadCrumb.js";
import Pagination from "react-bootstrap/Pagination";
import base64 from "react-native-base64";
import { FcDocument } from "react-icons/fc";
import { FiUpload } from "react-icons/fi";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import axios from "axios";

const Otp = () => {
  const fileInputRef = useRef(null);
  const [transactions, setTransactions] = useState([]);
  const [selectedFile, setSelectedFile] = useState({});
  // const [selectedFiles, setSelectedFiles] = useState([])
  const [documentId, setDocumentId] = useState(0);
  // const [pendingTransactions, setPendingTransactions] = useState([]);

  const itemsPerPage = 4;

  // const [currentPageSigned, setCurrentPageSigned] = useState(1);
  // const [totalPageSigned, setTotalPageSigned] = useState(0);

  // const indexOfLastItemSigned = currentPageSigned * itemsPerPage;
  // const indexOfFirstItemSigned = indexOfLastItemSigned - itemsPerPage;

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

  // const handlePageChangePaid = (pageNumber) => {
  //   setCurrentPageSigned(pageNumber);
  // };

  const fetchData = async () => {
    try {
      const response = await API.get(
        `http://localhost:3000/admin/transactions`
      );
      const transactions = response.data.transactions;

      const otpTransactions = transactions.filter(
        (transaction) =>
          transaction.transactionType === "OPTION_FEE" &&
          (transaction.optionFeeStatusEnum === "BUYER_UPLOADED" ||
            transaction.optionFeeStatusEnum === "ADMIN_SIGNED")
      );

      // const unreimbursed = otpTransactions.filter(
      //   (transaction) => transaction.reimbursed == 0
      // );

      // setSignedTransactions(reimbursedTransactions);
      // setPendingTransactions(unreimbursed);
      setTransactions(otpTransactions);

      // console.log("fetch data " + transactions);

      console.log(otpTransactions);

      setTotalPagePending(Math.ceil(otpTransactions.length / itemsPerPage));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedFile]);

  const handleDownload = async (documentId) => {
    try {
      const response = await API.get(
        `http://127.0.0.1:3000/user/documents/${documentId}/data`
      );
      console.log("This is the document: ", response.data.document);
      const byteCharacters = atob(response.data.document); // Decode the Base64 string
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      const blob = new Blob(byteArrays, { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error fetching document data: ", error);
    }
  };

  const handleButtonClick = async (documentId) => {
    setDocumentId(documentId);
    // Trigger the click event of the file input
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    // const selectedFiles = event.target.files;
    const selectedFile = event.target.files[0];

    console.log("hi");

    // setSelectedFiles(selectedFiles);
    setSelectedFile(selectedFile);

    // console.log(selectedFile);
    // console.log(selectedFiles);
  };

  const handleUpload = async (documentId, transactionId) => {
    const documentResponse = await API.get(
      `http://localhost:3000/admin/documents`
    );

    const document = documentResponse.data.data.filter(
      (document) => document.documentId == documentId
    );

    console.log("document: " + document[0].userId);

    console.log("document: " + document);

    console.log("document transaction id " + document[0].transactionId);

    if (selectedFile) {
      try {
        const fileData = new FormData();

        // Append other required data to the FormData object
        fileData.append("documents", selectedFile);
        fileData.append("userId", document[0].userId);
        fileData.append("transactionId", transactionId);
        fileData.append("folderId", document[0].folderId);
        fileData.append("description", document[0].description);

        const response = await axios.put(
          `http://localhost:3000/admin/documents/${documentId}/update`,
          fileData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setSelectedFile({});
      } catch (error) {
        console.log("Error upload:", error);
        return null;
      }
    }
  };

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
        <BreadCrumb names={["Home"]} lastname="OTP" links={["/"]}></BreadCrumb>
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
            OTP
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
                <th style={{ width: "300px" }}>OTP document</th>
                <th>Upload</th>
                <th style={{ width: "300px" }}>Signed</th>
              </tr>
            </thead>
            {Array.isArray(transactions) && transactions.length > 0 ? (
              <tbody>
                {transactions
                  .slice(indexOfFirstItemPending, indexOfLastItemPending)
                  .map((transaction) => (
                    <tr
                      key={transaction.transactionId}
                      style={{
                        textAlign: "center",
                      }}
                    >
                      <td>
                        {transaction.optionToPurchaseDocumentId != null ? (
                          <div
                            className="document-otp"
                            onClick={() =>
                              handleDownload(
                                transaction.optionToPurchaseDocumentId
                              )
                            }
                          >
                            <FcDocument
                              style={{ width: "45px", height: "45px" }}
                            ></FcDocument>
                          </div>
                        ) : (
                          <span>No Document</span>
                        )}
                      </td>
                      <td>
                        {transaction.reimbursed == 0 ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <input type="file" onChange={handleFileChange} />
                            <Button
                              style={{
                                backgroundColor: "#FFD700",
                                color: "black",
                                border: 0,
                              }}
                              onClick={() =>
                                handleUpload(
                                  transaction.optionToPurchaseDocumentId, transaction.transactionId
                                )
                              }
                            >
                              <FiUpload />
                            </Button>
                          </div>
                        ) : (
                          <span>Document uploaded successfully!</span>
                        )}
                      </td>
                      <td>
                        <div>
                          {transaction.reimbursed == 1 ? (
                            <Button
                              style={{
                                // backgroundColor: "#FFD700",
                                background: "none",
                                color: "black",
                                border: 0,
                              }}
                            >
                              <TiTick
                                style={{ width: "20px", height: "20px" }}
                              />
                            </Button>
                          ) : (
                            <Button
                              style={{
                                // backgroundColor: "#FFD700",
                                background: "none",
                                color: "black",
                                border: 0,
                              }}
                            >
                              <ImCross
                                style={{ width: "12px", height: "12px" }}
                              />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>
                    There are no otp documents
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
    </div>
  );
};

export default Otp;
