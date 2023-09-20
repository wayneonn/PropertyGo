const express = require('express');
const router = express.Router();
const { User, Lawyer } = require("../../models");
const multer = require("multer");
const { sequelize } = require('../../models');
const sharp = require('sharp');

const storage = multer.memoryStorage();
const upload = multer({
    storage: multer.memoryStorage(), // stores files in the memory
  });

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
    console.log('Received UserData:', req.body);
    console.log('Received Profile Image:', req.file);
    try {
      const user = await User.findByPk(userId);
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      if (req.file) {
        updatedUserData.profileImage = req.file.buffer;
      }

      console.log("Profile Image: ",updatedUserData.profileImage);
  
      await user.update(updatedUserData);
  
      res.json(user);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ error: "Error updating user profile" });
    }
  });  

  router.post('/:userId/profilePicture', upload.single('profileImage'), async (req, res) => {
    const userId = req.params.userId;
  
    try {
      const profileImage = req.file;
  
      if (!profileImage) {
        return res.status(400).json({ error: 'No profile image provided' });
      }
  
      const user = await User.findByPk(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Process the image using sharp and store it as a Buffer
      const processedImageBuffer = await sharp(profileImage.buffer)
        .resize({ width: 200, height: 200 }) // Adjust the dimensions as needed
        .webp() // Convert to WebP format
        .toBuffer();
  
      // Save the processed image as the user's profileImage
      user.profileImage = processedImageBuffer;
      await user.save();
  
      res.json({ success: true, message: 'Profile image uploaded successfully' });
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      res.status(500).json({ error: 'Error uploading profile picture' });
    }
  });
  
  
module.exports = router;