const { Folder } = require("../../models")

exports.getFolders = async (req, res) => {
    try {
        const folders = await Folder.findAll({ where: { userId: req.params.id } });
        res.json({ folders });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Error fetching folder: ", error: error.message });
    }
};

exports.createFolders = async (req, res) => {
    const { folderTitle } = req.body;
    const userId = parseInt(req.params.id, 10); // Parse userId as an integer

    try {
        // Check if a folder with the same title already exists for the user
        const existingFolder = await Folder.findOne({ where: { title: folderTitle, userId: req.params.id } });
        console.log({ title: folderTitle, userId })
        if (existingFolder) {
            // If a folder with the same title and user ID exists, return its folderId
            console.log("existingFolder", existingFolder)
            res.json({ folderId: existingFolder.folderId, message: "Folder already exists." });
        } else {
            // If no matching folder found, create a new folder
            const newFolder = await Folder.create({
                title: folderTitle,
                userId,
                timestamp: Date.now(),
            });
            res.json({ folderId: newFolder.folderId, message: "Folder created successfully." });
        }
    } catch (error) {
        res.status(500).json({ message: "Error creating folder: " + error.message });
    }
};


