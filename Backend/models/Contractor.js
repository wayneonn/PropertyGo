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
      contractorId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      token: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      countryOfOrigin: {
        type: DataTypes.ENUM('SINGAPORE', 'MALAYSIA', 'INDONESIA'),
        allowNull: true,
      },
      dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: true,
      },
      rating: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0,
      },     
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