const express = require('express');
const router = express.Router();
const { User, Lawyer } = require("../models");

router.get("/", async (req, res) => {
    const listOfUser = await User.findAll();
    res.json(listOfUser);
});

router.post("/", async (req, res) => {
    const user = req.body;

    // Check if the username already exists
    const existingUser = await User.findOne({
        where: {
            userName: user.userName
        }
    });

    // Check if the email already exists
    const existingEmail = await User.findOne({
        where: {
            email: user.email
        }
    });

    if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
    }

    if (existingEmail) {
        return res.status(400).json({ error: "Email already exists" });
    }

    // If neither the username nor email exists, create the user
    await User.create(user);
    res.json(user);
});

module.exports = router;
