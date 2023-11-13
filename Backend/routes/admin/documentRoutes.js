const express = require("express");
const multer = require("multer");
const router = express.Router();

const {
  getDocumentsWithFolderId,
  getDocumentWithPropertyId,
  getDocuments,
  updateDocument,
} = require("../../controllers/admin/documentController");

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fieldSize: 25 * 1024 * 1024 },
});

router.get("/folder/:id", getDocumentsWithFolderId);
router.get("/property", getDocumentWithPropertyId);
router.get("/", getDocuments);
router.put(
  "/:documentId/update",
  upload.fields([
    {
      name: "documents",
      maxCount: 1,
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
  updateDocument
);

module.exports = router;
