const { User } = require("../../models");

const getUserName = async (req, res) => {
    try {
        const { id: userId} = req.params;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user.name);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    getUserName
};