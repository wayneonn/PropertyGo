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
    console.log(req.body);
    try {
        const folder = await Folder.create({
            title: req.body.folderTitle,
            userId: req.params.id,
            timestamp: Date.now(),
        });
        res.json({ folder });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Error creating folder: ", error: error.message });
    }
}

