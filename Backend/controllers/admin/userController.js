const { User } = require("../../models");
const moment = require("moment");
const { Op } = require("sequelize");

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
      attributes: [
        "userId",
        "userName",
        "profileImage",
        "isActive",
        "userType",
      ],
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

async function searchActiveUsers(req, res) {
  try {
    const { q } = req.query;

    const results = await User.findAll({
      where: {
        isActive: true,
        userType: "BUYER_SELLER",
        userName: { [Op.like]: `%${q}%` },
      },
    });

    console.log(results);

    const usersWithProfileImages = results.map((user) => {
      const userJSON = user.toJSON();
      if (userJSON.profileImage) {
        userJSON.profileImage = userJSON.profileImage.toString("base64");
      }

      return userJSON;
    });

    res.json(usersWithProfileImages);
  } catch (error) {
    console.log("Error in searchActiveUsers:", error);
    res.status(500).json({ error: error });
  }
}

async function searchInactiveUsers(req, res) {
  try {
    const { q } = req.query;

    const results = await User.findAll({
      where: {
        isActive: false,
        userType: "BUYER_SELLER",
        userName: { [Op.like]: `%${q}%` },
      },
    });

    const usersWithProfileImages = results.map((user) => {
      const userJSON = user.toJSON();
      if (userJSON.profileImage) {
        userJSON.profileImage = userJSON.profileImage.toString("base64");
      }

      return userJSON;
    });

    res.json(usersWithProfileImages);

    // const userIds = results.map((user) => user);

    // res.json(userIds);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

async function searchActiveLawyers(req, res) {
  try {
    const { q } = req.query;

    const results = await User.findAll({
      where: {
        isActive: true,
        userType: "LAWYER",
        userName: { [Op.like]: `%${q}%` },
      },
    });

    const usersWithProfileImages = results.map((user) => {
      const userJSON = user.toJSON();
      if (userJSON.profileImage) {
        userJSON.profileImage = userJSON.profileImage.toString("base64");
      }

      return userJSON;
    });

    res.json(usersWithProfileImages);

    // const userIds = results.map((user) => user);

    // res.json(userIds);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

async function searchInactiveLawyers(req, res) {
  try {
    const { q } = req.query;

    const results = await User.findAll({
      where: {
        isActive: false,
        userType: "LAWYER",
        userName: { [Op.like]: `%${q}%` },
      },
    });

    const usersWithProfileImages = results.map((user) => {
      const userJSON = user.toJSON();
      if (userJSON.profileImage) {
        userJSON.profileImage = userJSON.profileImage.toString("base64");
      }

      return userJSON;
    });

    res.json(usersWithProfileImages);

    // const userIds = results.map((user) => user);

    // res.json(userIds);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

async function searchActiveContractors(req, res) {
  try {
    const { q } = req.query;

    const results = await User.findAll({
      where: {
        isActive: true,
        userType: "CONTRACTOR",
        userName: { [Op.like]: `%${q}%` },
      },
    });

    const usersWithProfileImages = results.map((user) => {
      const userJSON = user.toJSON();
      if (userJSON.profileImage) {
        userJSON.profileImage = userJSON.profileImage.toString("base64");
      }

      return userJSON;
    });

    res.json(usersWithProfileImages);

    // const userIds = results.map((user) => user);

    // res.json(userIds);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

async function searchInactiveContractors(req, res) {
  try {
    const { q } = req.query;

    const results = await User.findAll({
      where: {
        isActive: false,
        userType: "CONTRACTOR",
        userName: { [Op.like]: `%${q}%` },
      },
    });

    const usersWithProfileImages = results.map((user) => {
      const userJSON = user.toJSON();
      if (userJSON.profileImage) {
        userJSON.profileImage = userJSON.profileImage.toString("base64");
      }

      return userJSON;
    });

    res.json(usersWithProfileImages);

    // const userIds = results.map((user) => user);

    // res.json(userIds);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

module.exports = {
  getUserName,
  getUser,
  getAllUsers,
  deactivateUser,
  activateUser,
  searchActiveUsers,
  searchInactiveUsers,
  searchActiveLawyers,
  searchInactiveLawyers,
  searchActiveContractors,
  searchInactiveContractors,
};
