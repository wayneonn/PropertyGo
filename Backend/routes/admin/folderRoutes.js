const express = require("express");
const router = express.Router({ mergeParams: true });

const { getAllFolders } = require("../../controllers/admin/folderController");

router.route("/").get(getAllFolders);

module.exports = router;
