const { Admin } = require("../../models");

const login = async (req, res) => {
    try {
    const { userName, password } = req.body;

    const admin = await Admin.findOne({ where: { userName } });

    if (!admin) {
      return res.status(404).json({ message: "Login unsuccessful" }); 
    }

    const match = await Admin.findOne({ where: { userName, password } });
    
    if (!match) {
      return res.status(404).json({ message: "Login unsuccessful" });
    }

    res.status(200).json(match);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const logout = async (req, res) => {
    res.status(200).json({ message: "Logout successful" });
}

module.exports = {
    login,
    logout
};
