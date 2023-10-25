const sharp = require('sharp');
const { sequelize, Property, Image, User } = require('../../models');
const { Op } = require('sequelize');

// Get all properties
async function getAllProperties(req, res) {
    try {
        const properties = await Property.findAll();

        // Create an object to store image IDs mapped to property IDs
        const imageIdToPropertyIdMap = {};

        // Fetch associated images and populate the mapping
        const images = await Image.findAll();
        images.forEach(image => {
            const propertyId = image.propertyId;
            const imageId = image.imageId;
            if (!imageIdToPropertyIdMap[propertyId]) {
                imageIdToPropertyIdMap[propertyId] = [];
            }
            imageIdToPropertyIdMap[propertyId].push(imageId);
        });

        // Create an array to store properties with image IDs
        const propertiesWithImages = properties.map(property => {
            const propertyJSON = property.toJSON();
            const imageIds = imageIdToPropertyIdMap[property.propertyListingId] || [];
            propertyJSON.images = imageIds;
            return propertyJSON;
        });

        res.json(propertiesWithImages);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching properties' });
    }
}

// Create a property
// Modify the createProperty function to handle multiple images
async function createProperty(req, res) {
    const propertyData = JSON.parse(req.body.property);
    console.log('Received property data:', propertyData);

    // Start a transaction
    const transaction = await sequelize.transaction();

    try {
        const images = req.files;
        console.log('Received images:', images);

        if (images.length === 0) {
            await transaction.rollback();
            console.log('No images selected. Rolling back transaction.');
            return res.status(400).json({ error: 'No images selected' });
        }

        // Populate required fields for the property
        propertyData.postedAt = new Date(); // Set the postedAt date

        // Create the property in the database
        const createdProperty = await Property.create(propertyData, { transaction });
        console.log('Created property:', createdProperty);

        const failedImages = [];

        // Create and associate images with the property
        for (let index = 0; index < images.length; index++) {
            const image = images[index];
            console.log('Creating image for index', index, 'with propertyId', createdProperty.propertyListingId);

            try {
                const processedImageBuffer = await sharp(image.buffer)
                    .resize({ width: 800 }) // You can set the dimensions accordingly
                    .webp()
                    .toBuffer();

                const imageData = {
                    // title: `Image ${index + 1}`,
                    image: processedImageBuffer,
                    propertyId: createdProperty.propertyListingId, // Associate the image with the created property
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

        res.json({ propertyListingId: createdProperty.propertyListingId });
    } catch (error) {
        await transaction.rollback(); // Roll back the transaction if there was an error creating the property
        console.error('Error creating property:', error);
        console.log('Rolling back transaction due to an error.');
        res.status(500).json({ error: 'Error creating property' });
    }
}


// Update a property
async function updateProperty(req, res) {
    const propertyId = req.params.id;
    const updatedPropertyData = req.body;

    try {
        const property = await Property.findByPk(propertyId);

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        if (req.file) {
            const processedImageBuffer = await sharp(req.file.buffer)
                .resize({ width: 800 }) // You can set the dimensions accordingly
                .webp()
                .toBuffer();

            updatedPropertyData.images = processedImageBuffer;
        }

        await property.update(updatedPropertyData);

        res.json(property);
    } catch (error) {
        console.error('Error updating property:', error);
        res.status(500).json({ error: 'Error updating property' });
    }
}

// Get a property by ID
async function getPropertyById(req, res) {
    try {
        const { propertyListingId } = req.params;

        // Find the property by ID
        const property = await Property.findByPk(propertyListingId);

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // Fetch associated images
        const images = await Image.findAll({ where: { propertyId: propertyListingId } });

        // Create an array of imageIds
        const imageIds = images.map(image => image.imageId);

        // Create a property object with imageIds
        const propertyWithImages = {
            ...property.toJSON(),
            images: imageIds,
        };

        // Respond with the property data
        res.json(propertyWithImages);
    } catch (error) {
        console.error('Error fetching property:', error);
        res.status(500).json({ error: 'Error fetching property' });
    }
}

async function countUsersFavoritedProperty(req, res) {
    try {
        
      const { propertyId } = req.params;
      console.log('Counting users who favorited property...', propertyId);
      // Find the property by ID
      const property = await Property.findByPk(propertyId);
  
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
  
      // Count the number of users who have favorited this property
      const count = await User.count({
        include: [
          {
            model: Property,
            as: 'favouriteProperties',
            where: { propertyListingId: propertyId },
          },
        ],
      });
  
      res.json({ count });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

// Get properties by region with imageIds
async function getPropertiesByRegion(req, res) {
    try {
        const { region } = req.params;

        // Find properties based on the specified region parameter
        const properties = await Property.findAll({
            where: {
                region: region,
            },
            include: [
                {
                    model: User,
                    as: 'favouritedByUsers',
                },
            ],
            where: {
                approvalStatus: 'APPROVED', // Filter for properties with approvalStatus === "APPROVED"
            },
        });

        // Check if properties is undefined or empty
        if (!properties || properties.length === 0) {
            return res.status(404).json({ message: 'No properties found in the specified region' });
        }

        // Create an object to store image IDs mapped to property IDs
        const imageIdToPropertyIdMap = {};

        // Fetch associated images and populate the mapping
        const images = await Image.findAll();
        images.forEach(image => {
            const propertyId = image.propertyId;
            const imageId = image.imageId;
            if (!imageIdToPropertyIdMap[propertyId]) {
                imageIdToPropertyIdMap[propertyId] = [];
            }
            imageIdToPropertyIdMap[propertyId].push(imageId);
        });

        // Create an array to store properties with image IDs and like counts
        const propertiesWithImagesAndLikes = properties.map(property => {
            const favoriteCount = property.favouritedByUsers.length;
            const propertyJSON = property.toJSON();
            const imageIds = imageIdToPropertyIdMap[property.propertyListingId] || [];
            propertyJSON.images = imageIds;
            propertyJSON.favoriteCount = favoriteCount;
            return propertyJSON;
        });

        // Sort properties by boosted status and favorite count in descending order
        propertiesWithImagesAndLikes.sort((a, b) => {
            // Check if both properties are boosted
            const isBoostedA = a.boostListingEndDate && new Date(a.boostListingEndDate) >= new Date();
            const isBoostedB = b.boostListingEndDate && new Date(b.boostListingEndDate) >= new Date();

            if (isBoostedA && isBoostedB) {
                // If both are boosted, sort by favorite count in descending order
                return b.favoriteCount - a.favoriteCount;
            } else if (isBoostedA) {
                // If only A is boosted, place it above B
                return -1;
            } else if (isBoostedB) {
                // If only B is boosted, place it above A
                return 1;
            } else {
                // If neither is boosted, sort by postedAt (creation date) in descending order
                return new Date(b.postedAt) - new Date(a.postedAt);
            }
        });

        res.json(propertiesWithImagesAndLikes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}




// Add a new route to get properties sorted by favorite count in descending order
async function getPropertiesByFavoriteCount(req, res) {
    try {
        // Find all properties and include the associated users who favorited them
        const properties = await Property.findAll({
            include: [
                {
                    model: User,
                    as: 'favouritedByUsers',
                },
            ],
            where: {
                approvalStatus: 'APPROVED', // Filter for properties with approvalStatus === "APPROVED"
            },
        });

        // Check if properties is undefined or empty
        if (!properties || properties.length === 0) {
            return res.status(404).json({ message: 'No properties found' });
        }

        // Create an object to store image IDs mapped to property IDs
        const imageIdToPropertyIdMap = {};

        // Fetch associated images and populate the mapping
        const images = await Image.findAll();
        images.forEach(image => {
            const propertyId = image.propertyId;
            const imageId = image.imageId;
            if (!imageIdToPropertyIdMap[propertyId]) {
                imageIdToPropertyIdMap[propertyId] = [];
            }
            imageIdToPropertyIdMap[propertyId].push(imageId);
        });

        // Create an array to store property data along with favorite counts and image IDs
        const propertiesWithFavoriteCountAndImages = properties.map(property => {
            const favoriteCount = property.favouritedByUsers.length;
            const propertyJSON = property.toJSON();
            const imageIds = imageIdToPropertyIdMap[property.propertyListingId] || [];
            propertyJSON.images = imageIds;
            propertyJSON.favoriteCount = favoriteCount;
            return propertyJSON;
        });

        // Sort properties by favorite count in descending order
        propertiesWithFavoriteCountAndImages.sort((a, b) => {
            // Check if both properties are boosted
            const isBoostedA = a.boostListingEndDate && new Date(a.boostListingEndDate) >= new Date();
            const isBoostedB = b.boostListingEndDate && new Date(b.boostListingEndDate) >= new Date();

            if (isBoostedA && isBoostedB) {
                // If both are boosted, sort by favorite count in descending order
                return b.favoriteCount - a.favoriteCount;
            } else if (isBoostedA) {
                // If only A is boosted, place it above B
                return -1;
            } else if (isBoostedB) {
                // If only B is boosted, place it above A
                return 1;
            } else {
                // If neither is boosted, sort by favorite count in descending order
                return b.favoriteCount - a.favoriteCount;
            }
        });

        // Respond with the sorted list of properties including image IDs
        res.json(propertiesWithFavoriteCountAndImages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

// Get recently added properties sorted by postedAt datetime
async function getRecentlyAddedProperties(req, res) {
    try {
        // Find all properties and sort them by postedAt datetime in descending order
        const properties = await Property.findAll({
            include: [
                {
                    model: User,
                    as: 'favouritedByUsers',
                },
            ],
            where: {
                approvalStatus: 'APPROVED', // Filter for properties with approvalStatus === "APPROVED"
            },
            order: [['postedAt', 'DESC']],
        });

        // Create an object to store image IDs mapped to property IDs
        const imageIdToPropertyIdMap = {};

        // Fetch associated images and populate the mapping
        const images = await Image.findAll();
        images.forEach(image => {
            const propertyId = image.propertyId;
            const imageId = image.imageId;
            if (!imageIdToPropertyIdMap[propertyId]) {
                imageIdToPropertyIdMap[propertyId] = [];
            }
            imageIdToPropertyIdMap[propertyId].push(imageId);
        });

        // Create an array to store property data along with image IDs
        const propertiesWithImagesAndLikes = properties.map(property => {
            const favoriteCount = property.favouritedByUsers.length;
            const propertyJSON = property.toJSON();
            const imageIds = imageIdToPropertyIdMap[property.propertyListingId] || [];
            propertyJSON.images = imageIds;
            propertyJSON.favoriteCount = favoriteCount;
            return propertyJSON;
        });

        // Respond with the sorted list of properties including image IDs
        res.json(propertiesWithImagesAndLikes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}


// Get properties posted by a user with imageIds
async function getPropertiesByUser(req, res) {
    try {
        const { userId } = req.params;

        // Find properties associated with the specified user
        const properties = await Property.findAll({
            where: {
                sellerId: userId, // Assuming userId is a foreign key in the Property model
            },
        });

        // Create an object to store image IDs mapped to property IDs
        const imageIdToPropertyIdMap = {};

        // Fetch associated images and populate the mapping
        const images = await Image.findAll();
        images.forEach(image => {
            const propertyId = image.propertyId;
            const imageId = image.imageId;
            if (!imageIdToPropertyIdMap[propertyId]) {
                imageIdToPropertyIdMap[propertyId] = [];
            }
            imageIdToPropertyIdMap[propertyId].push(imageId);
        });

        // Create an array to store property data along with image IDs
        const propertiesWithImageIds = properties.map(property => {
            const propertyJSON = property.toJSON();
            const imageIds = imageIdToPropertyIdMap[property.propertyListingId] || [];
            propertyJSON.images = imageIds;
            return propertyJSON;
        });

        // Respond with the list of properties posted by the user, including image IDs
        res.json(propertiesWithImageIds);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

// Remove a property
async function removeProperty(req, res) {
    const propertyId = req.params.propertyId;

    // Start a transaction
    const transaction = await sequelize.transaction();

    try {
        // Delete associated images first
        await Image.destroy({ where: { propertyId: propertyId }, transaction });

        // Then delete the property
        const deleteCount = await Property.destroy({ where: { propertyListingId: propertyId }, transaction });

        if (deleteCount === 0) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Property not found' });
        }

        await transaction.commit();
        res.json({ message: 'Property removed successfully' });
    } catch (error) {
        await transaction.rollback();
        console.error('Error removing property:', error);
        res.status(500).json({ error: 'Error removing property' });
    }
}

// Edit a property
async function editProperty(req, res) {
    const propertyId = req.params.propertyId;
    const propertyData = req.body; // Receive text data directly from the request body
    console.log('Received property data:', propertyData);
    // Start a transaction
    const transaction = await sequelize.transaction();
  
    try {
      const property = await Property.findByPk(propertyId);
      if (!property) {
        await transaction.rollback();
        return res.status(404).json({ error: 'Property not found' });
      }
  
      // Update the property details
      await property.update(propertyData, { transaction });
  
      await transaction.commit();
      res.json({ message: 'Property updated successfully' });
    } catch (error) {
      await transaction.rollback();
      console.error('Error editing property:', error);
      res.status(500).json({ error: 'Error editing property' });
    }
  }

  async function searchProperties(req, res) {
    try {
      const { q } = req.query;
  
      // Perform a database query to search for properties
      const results = await Property.findAll({
        where: {
          // Use Sequelize operators to search in relevant fields (address, area, postal code)
          [Op.or]: [
            { address: { [Op.like]: `%${q}%` } },
            { area: { [Op.like]: `%${q}%` } },    
            { postalCode: { [Op.like]: `%${q}%` } }, 
          ],
        },
      });
  
      // Extract the property IDs from the results
      const propertyIds = results.map((property) => property);
  
      res.json(propertyIds);
    } catch (error) {
      console.error('Error searching for properties:', error);
      res.status(500).json({ error: 'Error searching for properties' });
    }
  }
  
module.exports = {
    getAllProperties,
    createProperty,
    updateProperty,
    getPropertyById,
    countUsersFavoritedProperty,
    getPropertiesByFavoriteCount,
    getPropertiesByRegion,
    getRecentlyAddedProperties,
    getPropertiesByUser,
    removeProperty,
    editProperty,
    searchProperties,
};
