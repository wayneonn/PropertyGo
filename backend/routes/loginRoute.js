const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { userName, password } = req.body;

    const user = await User.findOne({ where: { userName } });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const match = await User.findOne({ where: { password } });
    if (!match) {
      return res.status(400).json({ message: "Invalid password" });
    }
    await user.save();

    res.json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
