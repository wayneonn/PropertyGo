const { Property, Image, User } = require('../../models');
const sharp = require('sharp');

// Get all properties
async function getAllProperties(req, res) {
    try {
        const properties = await Property.findAll();
        
        const propertiesWithImages = properties.map(property => {
            const propertyJSON = property.toJSON();
            if (propertyJSON.images) {
                propertyJSON.images = propertyJSON.images.toString('base64');
            }
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
    console.log(propertyData);
    try {
        const images = req.files;

        if (images.length === 0) {
            return res.status(400).json({ error: 'No images selected' });
        }

        // Populate required fields for the property
        propertyData.postedAt = new Date(); // Set the postedAt date

        // Create the property in the database
        const createdProperty = await Property.create(propertyData);

        // Create and associate images with the property
        await Promise.all(
            images.map(async (image, index) => {
                const processedImageBuffer = await sharp(image.buffer)
                    .resize({ width: 800 }) // You can set the dimensions accordingly
                    .webp()
                    .toBuffer();

                const imageData = {
                    title: `Image ${index + 1}`,
                    image: processedImageBuffer,
                    propertyId: createdProperty.propertyListingId, // Associate the image with the created property
                };

                const createdImage = await Image.create(imageData);
            })
        );

        res.json({ propertyListingId: createdProperty.propertyListingId });
    } catch (error) {
        console.error('Error creating property:', error);
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

        // Map image URLs
        const imageId = images.map(image => ({
            imageId: `${image.imageId}`, 
        }));

        // Create a property object with image URLs
        const propertyWithImages = {
            ...property.toJSON(),
            images: imageId,
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

// Add a new route to filter properties by region
async function getPropertiesByRegion(req, res) {
    try {
        const { region } = req.params;

        // Find properties based on the region parameter
        const properties = await Property.findAll({
            where: {
                region: region,
            },
        });

        if (!properties || properties.length === 0) {
            return res.status(404).json({ message: 'No properties found in the specified region' });
        }

        // Respond with properties from the specified region
        res.json(properties);
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
        });

        // Create an array to store property data along with favorite counts
        const propertiesWithFavoriteCount = properties.map(property => {
            const favoriteCount = property.favouritedByUsers.length;
            return {
                propertyData: property.toJSON(),
                favoriteCount,
            };
        });

        // Sort properties by favorite count in descending order
        propertiesWithFavoriteCount.sort((a, b) => b.favoriteCount - a.favoriteCount);

        if (propertiesWithFavoriteCount.length === 0) {
            return res.status(404).json({ message: 'No properties found' });
        }

        // Respond with the sorted list of properties
        res.json(propertiesWithFavoriteCount.map(item => item.propertyData));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

  
module.exports = {
    getAllProperties,
    createProperty,
    updateProperty,
    getPropertyById,
    countUsersFavoritedProperty,
    getPropertiesByFavoriteCount,
    getPropertiesByRegion
};
