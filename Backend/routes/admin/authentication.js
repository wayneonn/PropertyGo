const express = require("express");
const bcrypt = require("bcrypt");
const { Admin } = require("../../models");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { userName, password } = req.body;

    const admin = await Admin.findOne({ where: { userName } });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const match = await Admin.findOne({ where: { password } });
    if (!match) {
      return res.status(404).json({ message: "Invalid password" });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
