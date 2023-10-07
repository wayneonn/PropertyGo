const { Property, Image } = require("../../models");
const sharp = require("sharp");

// Get all properties
async function getAllProperties(req, res) {
  try {
    const properties = await Property.findAll();

    const propertiesWithImages = properties.map((property) => {
      const propertyJSON = property.toJSON();
      if (propertyJSON.images) {
        propertyJSON.images = propertyJSON.images.toString("base64");
      }
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

    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

module.exports = {
  getAllProperties,
  getProperty,
};
