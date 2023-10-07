const express = require("express");
const router = express.Router();

const {
  getUserName,
  getUser,
  getAllUsers,
  activateUser,
  deactivateUser,
} = require("../../controllers/admin/userController");

router.route("/:id").get(getUserName);
router.route("/getUser/:id").get(getUser);
router.route("/").get(getAllUsers);
router.route("/deactivate/:id").patch(deactivateUser);
router.route("/activate/:id").patch(activateUser);

module.exports = router;
