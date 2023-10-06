const express = require("express");
const router = express.Router();

const {
  getDocumentsWithFolderId,
  getDocumentWithPropertyId,
} = require("../../controllers/admin/documentController");

router.get("/folder/:id", getDocumentsWithFolderId);
router.get("/property", getDocumentWithPropertyId);

module.exports = router;
