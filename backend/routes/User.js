const express = require('express');
const router = express.Router();
const { User, Lawyer } = require("../models");
const multer = require("multer");
const { sequelize } = require('../models');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
    try {
        const listOfUser = await User.findAll({
            attributes: {
                include: [
                    [sequelize.json('profileImage'), 'profileImage']
                ]
            }
        });

        const usersWithProfileImages = listOfUser.map(user => {
            const userJSON = user.toJSON();
            if (userJSON.profileImage) {
                userJSON.profileImage = userJSON.profileImage.toString('base64');
            }
            return userJSON;
        });

        res.json(usersWithProfileImages);
    } catch (error) {
        res.status(500).json({ error: "Error fetching users" });
    }
});


router.post("/", upload.single('profileImage'), async (req, res) => {
    const user = req.body;
    try {
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
        const createdUser = await User.create(user);

        if (req.file) {
            const profileImage = req.file.buffer;
            await createdUser.update({ profileImage });
            res.json(createdUser);
        } else {
            res.json(createdUser);
        }
    } catch (error) {
        res.status(500).json({ error: "Error creating user" });
    }

});

router.put("/:id", upload.single('profileImage'), async (req, res) => {
    const userId = req.params.id;
    const updatedUserData = req.body;
    console.log("Received body:", req.body);
    console.log("Received file:", req.file);

    try {
        // Find the user by ID
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Update user data
        await user.update(updatedUserData);

        if (req.file) {
            const profileImage = req.file.buffer;
            await user.update({ profileImage });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Error updating user profile" });
    }
});

module.exports = router;


module.exports = router;
