const express = require("express");
const router = express.Router();

const {
  getUserName,
  getUser,
  getAllUsers,
  activateUser,
  deactivateUser,
  searchActiveUsers,
  searchInactiveUsers,
  searchActiveLawyers,
  searchInactiveLawyers,
  searchActiveContractors,
  searchInactiveContractors,
} = require("../../controllers/admin/userController");

router.route("/:id").get(getUserName);
router.route("/getUser/:id").get(getUser);
router.route("/").get(getAllUsers);
router.route("/search/active/users").get(searchActiveUsers);
router.route("/search/inactive/users").get(searchInactiveUsers);
router.route("/search/active/lawyers").get(searchActiveLawyers);
router.route("/search/inactive/lawyers").get(searchInactiveLawyers);
router.route("/search/active/contractors").get(searchActiveContractors);
router.route("/search/inactive/contractors").get(searchInactiveContractors);
router.route("/activate/:id").patch(activateUser);
router.route("/deactivate/:id").patch(deactivateUser);
router.route("/activate/:id").patch(activateUser);

module.exports = router;
