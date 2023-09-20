const express = require("express");
const multer = require("multer");
// const admin = require("firebase-admin");
const fs = require("fs");
const { Document } = require("../../models");
const router = express.Router();

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

// API works when tested with Insomnia.
// Works with one more more then one.
// TODO: Append UserID to the file so we can grab it by UserID in the giant bucket.
// TODO: Or add more folders to it so each user gets a unique folder.
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
  async (req, res) => {
    // Handle the uploaded files
    const files = req.files["documents"];
    let description = req.body.description;
    console.log(req.body);
    // If description is an array, pick first element
    if (Array.isArray(description)) {
      description = description[0];
    }
    // All the ID to input into the document.
    let userId = req.body.userId;
    let transactionId = req.body.transactionId;
    let folderId = req.body.folderId;
    // If userId is an array, pick first element
    if (Array.isArray(userId)) {
      userId = userId[0];
    }
    // If transactionId is an array, pick first element
    if (Array.isArray(transactionId)) {
      transactionId = transactionId[0];
    }
    // If folderId is an array, pick first element
    if (Array.isArray(folderId)) {
      folderId = folderId[0];
    }

    // Perform necessary operations with the uploaded files
    // For example, you can move the files to a different directory, save their metadata to a database, etc.

    // I think the Blob is being saved wrongly.
    // It is not writing the full buffer jajajaajaja. Not suited in a NodeJS backend?
    try {
      for (const file of files) {
        const bufferData = Buffer.from(file.buffer);
        console.log([bufferData]);

        await Document.create({
          title: file.originalname,
          type: file.mimetype,
          size: file.size,
          description: description,
          document: bufferData,
          userId: userId,
          transactionId: transactionId,
          folderId: folderId,
        });
      }

      res.json({ message: "File upload successful" });
    } catch (error) {
      // Handle any errors
      console.error(error);
      res.status(500).json({ message: "File upload to Firebase failed" });
    }

    // Check the data received.
    // Generally the data is sent over the right way.
    console.log(files);
    console.log(description);
  }
);

// Give us the whole list of the documents.
router.get("/documents/list/metadata", async (req, res) => {
  try {
    const documents = await Document.findAll({
      attributes: [
        "documentId",
        "folderId",
        "userId",
        "transactionId",
        "title",
        "createdAt",
        "updatedAt",
      ],
    });
    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).send("Document metadata collection error.");
  }
});

// Give me the specific dataset.
router.get("/documents/:documentId/data", async (req, res) => {
  try {
    const documentData = await Document.findByPk(req.params.documentId);
    if (documentData) {
      res.json(documentData);
    } else {
      res.status(404).send("Document not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// Delete route
router.delete("/documents/:id", async (req, res) => {
  console.log("Delete API called.");
  const document = await Document.findByPk(req.params.id);
  // Soft delete
  await document.update({ deleted: true });
  res.sendStatus(204);
});

// app.listen(3000, () => {
//   console.log("Server started on port 3000");
// });

module.exports = router;
