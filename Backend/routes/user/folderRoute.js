const express = require("express");
const { Folder } = require("../../models");
const multer = require("multer");

const router = express.Router();
// Memory Storage for reading buffer.
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fieldSize: 25 * 1024 * 1024 },
});

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

router.post("/folders/create/:id", async (req, res) => {
  console.log(req.body);
  try {
    const folder = await Folder.create({
      title: req.body.folderTitle,
      userId: req.params.id,
      timestamp: Date.now(),
    });
    res.json({ folder });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating folder: ", error: error.message });
  }
});

module.exports = router;
