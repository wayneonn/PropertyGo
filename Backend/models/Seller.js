const Users = require('./Users.js'); // Import the parent Users model

module.exports = (sequelize, DataTypes) => {
  sequelize.models = {};

  const Seller = sequelize.define("Seller", {  
      sellerId: {
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
  });

  return Seller;
};

