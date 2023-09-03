const Users = require('./Users.js'); // Import the parent Users model

module.exports = (sequelize, DataTypes) => {
  sequelize.models = {};
  
   const Lawyer = sequelize.define("Lawyer", {
      experience: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      projectsCompleted: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      companyName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
  });

  return Lawyer;
};