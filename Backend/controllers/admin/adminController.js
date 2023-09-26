const { Admin } = require("../../models");

// helper function
const getAdmin = (userName) => {
  return Admin.findOne({ where: { userName } });
};

const getSingleAdmin = async (req, res) => {
  try {
    const { id: adminId } = req.params;

    const admin = await Admin.findByPk(adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllAdmins = async (req, res) => {
  const admins = await Admin.findAll();

  res.status(200).json({ admins : admins });
}

const updateAdminUsername = async (req, res) => {
  try {
    const { oldUserName, updatedUserName } = req.body;

    const admin = await getAdmin(updatedUserName);

    if (oldUserName === updatedUserName) {
      return res.status(200).json({ message: "unchanged" });
    }

    if (admin) {
      return res
        .status(409)
        .json({ message: "Admin UserName found. Change to another userName" });
    }
    const currentAdmin = await getAdmin(oldUserName);

    currentAdmin.userName = updatedUserName;

    await currentAdmin.save();

    res
      .status(200)
      .json({ message: "You have updated your userName successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateAdminPassword = async (req, res) => {
  try {
    const { userName, oldPassword, newPassword, newConfirmedPassword } =
      req.body;

    const admin = await getAdmin(userName);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const currentPassword = admin.password;

    if (currentPassword !== oldPassword) {
      return res.status(401).json({ message: "Password is incorrect" });
    }

    if (newPassword !== newConfirmedPassword) {
      return res.status(400).json({
        message: "New password and confirmed passwords are different",
      });
    }

    admin.password = newPassword;
    await admin.save();

    res
      .status(200)
      .json({ message: "You have updated your password successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getAllAdmins,
  getSingleAdmin,
  updateAdminUsername,
  updateAdminPassword,
};
