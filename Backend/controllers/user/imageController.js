const { Image, Property } = require('../../models'); // Import your Image model

// Get all images associated with a property by its ID
async function getImagesByPropertyId(req, res) {
    try {
        const { propertyListingId } = req.params;

        // Find the property by ID
        const property = await Property.findByPk(propertyListingId);

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // Fetch associated images for the property
        const images = await Image.findAll({ where: { propertyId: propertyListingId } });

        // Map image URLs
        const imageUrls = images.map(image => ({
            imageUrl: `${'YOUR_BASE_URL'}/images/${image.imageId}`, // Replace 'YOUR_BASE_URL'
        }));

        // Respond with the image URLs
        res.json(imageUrls);
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ error: 'Error fetching images' });
    }
}

// Get an image by its ID and send it as binary data
async function getImageById(req, res) {
    try {
        const { imageId } = req.params;

        // Find the image by ID
        const image = await Image.findByPk(imageId);

        if (!image) {
            return res.status(404).json({ error: 'Image not found' });
        }

        // Set the response headers to indicate binary data
        res.setHeader('Content-Type', 'image/jpeg'); // Modify the content type as per your image format

        // Send the image binary data
        res.send(image.image);
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).json({ error: 'Error fetching image' });
    }
}

module.exports = {
    getImagesByPropertyId,
    getImageById,
};
