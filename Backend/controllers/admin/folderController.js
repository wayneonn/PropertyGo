const { Folder } = require("../../models");
const sharp = require("sharp");

// Get all properties
async function getAllFolders(req, res) {
  try {
    const folders = await Folder.findAll();

    res.status(200).json({ folders: folders });
  } catch (error) {
    res.status(500).json({ error: "Error fetching folders" });
  }
}

module.exports = {
  getAllFolders,
};
