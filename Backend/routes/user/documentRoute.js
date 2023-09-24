const express = require("express");
const multer = require("multer");
// const admin = require("firebase-admin");
const fs = require("fs");
const { Document } = require("../../models");
const router = express.Router();
const DocumentController = require("../../controllers/user/documentController")

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
  ]),
    DocumentController.uploadDocuments
);

// Give us the whole list of the documents.
router.get("/documents/list/metadata/:id", DocumentController.getDocumentsMetadata());

// Give me the specific dataset.
router.get("/documents/:documentId/data", DocumentController.getDocumentData());

// Delete route
router.delete("/documents/:id", DocumentController.deleteDocument);

// app.listen(3000, () => {
//   console.log("Server started on port 3000");
// });

module.exports = router;
