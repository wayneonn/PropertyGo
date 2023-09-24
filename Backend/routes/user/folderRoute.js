const express = require("express");
const { FolderController } = require("../../controllers/user/folderController")
const multer = require("multer");

const router = express.Router();
// Memory Storage for reading buffer.
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fieldSize: 25 * 1024 * 1024 },
});

router.get("/folders/:id", FolderController.getFolders);

router.post("/folders/create/:id", FolderController.createFolders);

module.exports = router;
