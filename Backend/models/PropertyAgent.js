const Users = require('./Users.js'); // Import the parent Users model

module.exports = (sequelize, DataTypes) => {
  sequelize.models = {};

  const PropertyAgent = sequelize.define("PropertyAgent", {
      experience: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      projectsCompleted: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
  });

  return PropertyAgent;
};