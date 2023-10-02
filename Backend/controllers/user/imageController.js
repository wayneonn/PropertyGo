const sharp = require('sharp');
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

async function removeImageById(req, res) {
    try {
        const { imageId } = req.params;

        // Find the image by ID
        const image = await Image.findByPk(imageId);

        if (!image) {
            return res.status(404).json({ error: 'Image not found' });
        }

        // Delete the image from the database
        await image.destroy();

        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ error: 'Error deleting image' });
    }
}

// Update an image by its ID
async function updateImageById(req, res) {
    try {
        const { imageId } = req.params;
        const { title } = req.body; // Assuming you can update the image title and data
        const image = req.file;
        // Find the image by ID
        const imageToUpdate = await Image.findByPk(imageId);

        if (!imageToUpdate) {
            return res.status(404).json({ error: 'Image not found' });
        }

        // Update image properties
        if (title) {
            imageToUpdate.title = title;
        }

        if (image) {
            try {
                // Process and update the image data as needed (e.g., resize or convert format)
                const processedImageBuffer = await sharp(image.buffer)
                    .resize({ width: 800 }) // You can set the dimensions accordingly
                    .webp()
                    .toBuffer();

                imageToUpdate.image = processedImageBuffer;
            } catch (imageError) {
                console.error('Error processing image:', imageError);
                return res.status(500).json({ error: 'Error processing image' });
            }
        }

        // Save the updated image
        await imageToUpdate.save();
        console.log("imageToUpdate", imageToUpdate)
        res.json({ message: 'Image updated successfully' });
    } catch (error) {
        console.error('Error updating image:', error);
        res.status(500).json({ error: 'Error updating image' });
    }
}


async function createImageWithPropertyId(req, res) {
    try {
        const { propertyId } = req.params;
        const { title } = req.body;
        const image = req.file; // Use req.file to get the uploaded image data
        console.log("image", image)
        // Find the property by ID
        const property = await Property.findByPk(propertyId);

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // Process and save the image data
        try {
            if (!image) {
                return res.status(400).json({ error: 'No image selected' });
            }

            const processedImageBuffer = await sharp(image.buffer)
                .resize({ width: 800 }) // You can set the dimensions accordingly
                .webp()
                .toBuffer();

            const imageData = {
                title,
                image: processedImageBuffer,
                propertyId: propertyId,
            };

            // Create the image record with the associated propertyId
            const createdImage = await Image.create(imageData);

            res.json({ message: 'Image created successfully', imageId: createdImage.imageId });
        } catch (imageError) {
            console.error('Error processing image:', imageError);
            return res.status(500).json({ error: 'Error processing image' });
        }
    } catch (error) {
        console.error('Error creating image:', error);
        res.status(500).json({ error: 'Error creating image' });
    }
}



module.exports = {
    getImagesByPropertyId,
    getImageById,
    removeImageById,
    updateImageById,
    createImageWithPropertyId,
};
