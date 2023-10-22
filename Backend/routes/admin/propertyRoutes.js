const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  getAllProperties,
  getProperty,
  approveProperty,
  rejectProperty,
} = require("../../controllers/admin/propertyController");

router.route("/").get(getAllProperties);
router.route("/:id").get(getProperty);
router.route("/approve/:id").patch(approveProperty);
router.route("/reject/:id").patch(rejectProperty);

module.exports = router;
