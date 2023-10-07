const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  getAllProperties,
  getProperty,
} = require("../../controllers/admin/propertyController");

router.route("/").get(getAllProperties);
router.route("/:id").get(getProperty);

module.exports = router;
