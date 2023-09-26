const { User } = require('../../models');
const sharp = require('sharp');

async function getAllUsers(req, res) {
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
    res.status(500).json({ error: 'Error fetching users' });
  }
}

async function createUser(req, res) {
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
      return res.status(400).json({ error: 'Username already exists' });
    }

    if (existingEmail) {
      return res.status(400).json({ error: 'Email already exists' });
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
    res.status(500).json({ error: 'Error creating user' });
  }
}

async function updateUser(req, res) {
  const userId = req.params.id;
  const updatedUserData = req.body;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existingEmail = await User.findOne({
      where: {
        email: updatedUserData.email
      }
    });

    if (existingEmail && updatedUserData.email !== user.email) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    if (req.file) {
      updatedUserData.profileImage = req.file.buffer;
    }

    await user.update(updatedUserData);

    res.json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Error updating user profile' });
  }
}

async function uploadProfilePicture(req, res) {
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

    const processedImageBuffer = await sharp(profileImage.buffer)
      .resize({ width: 200, height: 200 })
      .webp()
      .toBuffer();

    user.profileImage = processedImageBuffer;
    await user.save();

    res.json({ success: true, message: 'Profile image uploaded successfully' });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ error: 'Error uploading profile picture' });
  }
}

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  uploadProfilePicture
};
