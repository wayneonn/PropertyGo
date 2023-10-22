const { Property, Image } = require("../../models");
const sharp = require("sharp");
const moment = require("moment");

// Get all properties
async function getAllProperties(req, res) {
  try {
    const properties = await Property.findAll();

    // Create an object to store image IDs mapped to property IDs
    const imageIdToPropertyIdMap = {};

    // Fetch associated images and populate the mapping
    const images = await Image.findAll();
    images.forEach((image) => {
      const propertyId = image.propertyId;
      const imageId = image.imageId;
      if (!imageIdToPropertyIdMap[propertyId]) {
        imageIdToPropertyIdMap[propertyId] = [];
      }
      imageIdToPropertyIdMap[propertyId].push(imageId);
    });

    // Create an array to store properties with image IDs
    const propertiesWithImages = properties.map((property) => {
      const propertyJSON = property.toJSON();
      const imageIds = imageIdToPropertyIdMap[property.propertyListingId] || [];
      propertyJSON.images = imageIds;
      return propertyJSON;
    });

    res.json(propertiesWithImages);
  } catch (error) {
    res.status(500).json({ error: "Error fetching properties" });
  }
}

async function getProperty(req, res) {
  try {
    const { id: propertyId } = req.params;

    const property = await Property.findByPk(propertyId);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Fetch associated images
    const images = await Image.findAll({
      where: { propertyId: propertyId },
    });

    // Create an array of imageIds
    const imageIds = images.map((image) => image.imageId);

    // Create a property object with imageIds
    const propertyWithImages = {
      ...property.toJSON(),
      images: imageIds,
    };

    // Respond with the property data
    res.json(propertyWithImages);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

const approveProperty = async (req, res) => {
  const { id: propertyId } = req.params;

  try {
    const property = await Property.findByPk(propertyId);

    req.body.approvalStatus = "APPROVED";
    req.body.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");

    await property.update(req.body);

    const updatedProperty = await Property.findByPk(propertyId);

    res.status(200).json({ property: updatedProperty });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const rejectProperty = async (req, res) => {
  const { id: propertyId } = req.params;

  const { adminNotes } = req.body;

  try {
    const property = await Property.findByPk(propertyId);

    req.body.approvalStatus = "REJECTED";
    req.body.adminNotes = adminNotes;
    req.body.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");

    await property.update(req.body);

    const updatedProperty = await Property.findByPk(propertyId);

    res.status(200).json({ property: updatedProperty });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getAllProperties,
  getProperty,
  approveProperty,
  rejectProperty,
};
