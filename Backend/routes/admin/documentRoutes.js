const express = require("express");
const router = express.Router();

const {
  getDocumentsWithFolderId,
  getDocumentWithPropertyId,
  getDocuments,
} = require("../../controllers/admin/documentController");

router.get("/folder/:id", getDocumentsWithFolderId);
router.get("/property", getDocumentWithPropertyId);
router.get("/", getDocuments);

module.exports = router;
