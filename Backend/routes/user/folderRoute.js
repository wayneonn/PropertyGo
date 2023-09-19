const express = require("express");
const { Folder } = require("../../models");

const router = express.Router();

router.get("/folders/:id", async (req, res) => {
  try {
    const folders = await Folder.findAll({ where: { userId: req.params.id } });
    res.json({ folders });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching folder: ", error: error.message });
  }
});

module.exports = router;
