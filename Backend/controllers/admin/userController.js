const { User } = require("../../models");
const moment = require("moment");

const getUserName = async (req, res) => {
  try {
    const { id: userId } = req.params;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.name);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

async function getUser(req, res) {
  try {
    const { id: userId } = req.params;

    const user = await User.findByPk(userId);

    const userJSON = user.toJSON();
    if (userJSON.profileImage) {
      userJSON.profileImage = userJSON.profileImage.toString("base64");
    }

    if (!userJSON) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(userJSON);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

const getAllUsers = async (req, res) => {
  try {
    const listOfUser = await User.findAll({
      attributes: ["userId", "username", "profileImage", "isActive", "userType"],
    });

    const usersWithProfileImages = listOfUser.map((user) => {
      const userJSON = user.toJSON();
      if (userJSON.profileImage) {
        userJSON.profileImage = userJSON.profileImage.toString("base64");
      }

      return userJSON;
    });

    res.json(usersWithProfileImages);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const deactivateUser = async (req, res) => {
  const { id: userId } = req.params;

  try {
    const user = await User.findByPk(userId);

    req.body.isActive = false;
    req.body.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");

    await user.update(req.body);

    const updatedUser = await User.findByPk(userId);

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const activateUser = async (req, res) => {
  const { id: userId } = req.params;

  try {
    const user = await User.findByPk(userId);

    req.body.isActive = true;
    req.body.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");

    await user.update(req.body);

    const updatedUser = await User.findByPk(userId);

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getUserName,
  getUser,
  getAllUsers,
  deactivateUser,
  activateUser,
};
