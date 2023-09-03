const Users = require('./Users.js'); // Import the parent Users model

module.exports.ContractorEnum = Object.freeze({
  Mover: 'Mover',
  InteriorDesign: 'InteriorDesign',
  Plumber: 'Plumber',
  Carpenter: 'Carpenter'
});

module.exports = (sequelize, DataTypes) => {
  sequelize.models = {};

  const Contractor = sequelize.define("Contractor", {
      experience: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      projectsCompleted: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      specialization: {
        type: DataTypes.ENUM,
        values: Object.values(this.ContractorEnum),
        defaultValue: this.ContractorEnum.Mover,
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

  return Contractor;
};