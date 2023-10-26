const { User, Property, Image, sequelize } = require('../../models');
const sharp = require('sharp');

async function getAllUsers(req, res) {
  try {
    const listOfUser = await User.findAll({
      attributes: {
        include: [[sequelize.json("profileImage"), "profileImage"]],
      },
    });

    const usersWithProfileImages = listOfUser.map((user) => {
      const userJSON = user.toJSON();
      if (userJSON.profileImage) {
        userJSON.profileImage = userJSON.profileImage.toString("base64");
      }
      return userJSON;
    });

    res.json(usersWithProfileImages);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
}

async function createUser(req, res) {
  const user = req.body;
  try {
    // Check if the username already exists
    const existingUser = await User.findOne({
      where: {
        userName: user.userName,
      },
    });

    // Check if the email already exists
    const existingEmail = await User.findOne({
      where: {
        email: user.email,
      },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }
    console.log("This is the data sent in: ", user)
    // If neither the username nor email exists, create the user
    const createdUser = await User.create(user);
    console.log("Attempting to create a user: ", createdUser)

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
}

async function updateUser(req, res) {
  const userId = req.params.id;
  const updatedUserData = req.body;
  console.log('updatedUserData', updatedUserData);
  console.log('userId', userId);

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingEmail = await User.findOne({
      where: {
        email: updatedUserData.email,
      },
    });

    if (existingEmail && updatedUserData.email !== user.email) {
      return res.status(400).json({ error: "Email already exists" });
    }

    if (req.file) {
      updatedUserData.profileImage = req.file.buffer;
    }

    await user.update(updatedUserData);

    res.json(user);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Error updating user profile" });
  }
}

async function uploadProfilePicture(req, res) {
  const userId = req.params.userId;

  try {
    const profileImage = req.file;

    if (!profileImage) {
      return res.status(400).json({ error: "No profile image provided" });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const processedImageBuffer = await sharp(profileImage.buffer)
      .resize({ width: 200, height: 200 })
      .webp()
      .toBuffer();

    user.profileImage = processedImageBuffer;
    await user.save();

    res.json({ success: true, message: "Profile image uploaded successfully" });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({ error: "Error uploading profile picture" });
  }
}

async function getUserById(req, res) {
  const userId = req.params.userId;

  try {
    const user = await User.findByPk(userId, {
      attributes: {
        exclude: ['password'], // Exclude sensitive data like password
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Error fetching user' });
  }
}

async function addFavoriteProperty(req, res) {
  try {
    const { userId, propertyId } = req.params;

    // Find the user by ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the property by ID
    const property = await Property.findByPk(propertyId);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Add the property to the user's favorites
    await user.addFavouriteProperty(property);

    res.status(201).json({ message: 'Property added to favorites' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

async function removeFavoriteProperty(req, res) {
  try {
    const { userId, propertyId } = req.params;

    // Find the user by ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the property by ID
    const property = await Property.findByPk(propertyId);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Remove the property from the user's favorites
    await user.removeFavouriteProperty(property);

    res.status(200).json({ message: 'Property removed from favorites' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getUserFavorites(req, res) {
  try {
    const { userId } = req.params;

    // Find the user by ID and include their favorite properties
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Property,
          as: 'favouriteProperties',
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create an array to store user's favorite properties with image IDs
    const favoritePropertiesWithImages = [];

    // Loop through the user's favorite properties
    for (const property of user.favouriteProperties) {
      // Find the associated images for the property
      const images = await Image.findAll({ where: { propertyId: property.propertyListingId } });

      // Map image IDs
      const imageIds = images.map((image) => image.imageId);

      // Create a property object with image IDs
      const propertyWithImages = {
        ...property.toJSON(),
        images: imageIds,
      };

      // Add the property object to the array
      favoritePropertiesWithImages.push(propertyWithImages);
    }

    // Respond with the user's favorite properties including image IDs
    res.json(favoritePropertiesWithImages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

async function isPropertyInFavorites(req, res) {
  try {
    const { userId, propertyId } = req.params;

    // Find the user by ID and include their favorite properties
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Property,
          as: 'favouriteProperties',
          where: { propertyListingId: propertyId }, // Check if the property with the given ID exists in favorites
          required: false, // Use "required: false" to perform a left join
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the property exists in the user's favorite properties
    const isLiked = user.favouriteProperties.length > 0;

    res.json({ isLiked });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getPartnerByRangeAndType(req, res) {
  try {
    const partners = await User.findAll({
      where: {
        userType: req.params.type
      },
      offset: Number(req.params.start - 1),
      limit: Number(req.params.end)
    })
    res.status(201).json({ partnerInfo: partners })
  } catch (error) {
    console.error("Fail to fetch particular customer type: ", error)
  }
}

async function savePushToken(req, res) {
  try {
    const { userId, pushToken } = req.body;

    // Find the user by their user ID and update their pushToken
    user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.pushToken = pushToken
    await user.save();

    res.status(200).json({ message: 'Push token saved successfully' });
  } catch (error) {
    console.error('Error saving push token:', error);
    res.status(500).json({ error: 'Could not save push token' });
  }
}

async function editUserBoost(req, res) {
  const userId = req.params.id;
  const userData = req.body;
  console.log('Received user data:', userData);
  const transaction = await sequelize.transaction();
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the property details
    await user.update(userData, { transaction });

    await transaction.commit();
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error editing user:', error);
    res.status(500).json({ error: 'Error editing user' });
  }
}

async function uploadCompanyPictures(req, res) {
  // Start a transaction
  const transaction = await sequelize.transaction();
  try {
    const images = req.files;
    console.log('Received images:', images);
    if (images.length === 0) {
      await transaction.rollback();
      console.log('No images selected. Rolling back transaction.');
      return res.status(400).json({error: 'No images selected'});
    }
    const failedImages = [];

    // Create and associate images with the property
    for (let index = 0; index < images.length; index++) {
      const image = images[index];
      console.log('Creating image for index', index, 'with User ID', req.params.id);

      try {
        const processedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800 }) // You can set the dimensions accordingly
            .webp()
            .toBuffer();

        const imageData = {
          // title: `Image ${index + 1}`,
          image: processedImageBuffer,
          userId: req.params.id, // Associate the image with the created property
        };

        // Create the image record with the associated propertyId
        await Image.create(imageData, { transaction });
        console.log(`Image ${index + 1} created successfully.`);
      } catch (imageError) {
        console.error('Error creating image:', imageError);
        failedImages.push({ index, error: 'Failed to create image' });
      }
    }

    if (failedImages.length > 0) {
      // If there were failed images, roll back the transaction
      await transaction.rollback();
      console.log('Rolled back transaction due to errors in creating images.');
      return res.status(500).json({ error: 'Error creating some images', failedImages });
    }

    // If everything went well for all images, commit the transaction
    await transaction.commit();
    console.log('Transaction committed successfully.');
    // Inform image update.
    req.io.emit("newImageLoaded", "New image update has been called.");
    res.status(200).json({ message: 'Photos saved successfully' });
  } catch (error) {
    console.error("Error uploading company photos: ", error)
  }

}

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  uploadProfilePicture,
  getUserById,
  addFavoriteProperty,
  removeFavoriteProperty,
  getUserFavorites,
  isPropertyInFavorites,
  getPartnerByRangeAndType,
  editUserBoost,
  savePushToken,
  uploadCompanyPictures
};
