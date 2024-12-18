const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { Document } = require("../../models");
const router = express.Router();
const { uploadDocuments, getDocumentsMetadata, getDocumentMetadataByAppId,
  getDocumentData, deleteDocument, updateDocument } = require("../../controllers/user/documentController")

// Setting up a MySQL connection since we are using MySQL.

//Setup for the server + Firebase connection.
//var serviceAccount = require("Backend/config/service-account.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: "gs://propertygo-b6e58.appspot.com",
// });
// const app = express();
// app.use(cors());

// Temporary Disk Storage for Testing.

// const storage = multer.diskStorage({
//   destination: "uploads/",
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// Memory Storage for reading buffer.
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fieldSize: 25 * 1024 * 1024 },
});

router.post(
  "/documents/upload",
  upload.fields([
    {
      name: "documents",
    },
    {
      name: "description",
      maxCount: 1,
    },
    {
      name: "userId",
      maxCount: 1,
    },
    {
      name: "transactionId",
      maxCount: 1,
    },
    {
      name: "folderId",
      maxCount: 1,
    },
    {
      name: "propertyId",
      maxCount: 1,
    },
  ]),
  uploadDocuments
);

router.put(
  "/documents/:documentId/update",
  upload.fields([
    {
      name: "documents",
    },
    {
      name: "description",
      maxCount: 1,
    },
    {
      name: "userId",
      maxCount: 1,
    },
    {
      name: "transactionId",
      maxCount: 1,
    },
    {
      name: "folderId",
      maxCount: 1,
    },
    {
      name: "propertyId",
      maxCount: 1,
    },
  ]),
  updateDocument
);

// Give us the whole list of the documents.
router.get("/documents/list/metadata/:id", getDocumentsMetadata);

// Get us the list of documents associated with a specific App. ID.
router.get("/documents/app/metadata/:id", getDocumentMetadataByAppId)


// Give me the specific dataset.
router.get("/documents/:documentId/data", getDocumentData);

// Delete route
router.delete("/documents/:id", deleteDocument);

// app.listen(3000, () => {
//   console.log("Server started on port 3000");
// });

module.exports = router;
