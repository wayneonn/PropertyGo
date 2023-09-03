const Users = require('./Users.js'); // Import the parent Users model

module.exports = (sequelize, DataTypes) => {
  sequelize.models = {};

  const Seller = sequelize.define("Seller", {  

  });

  return Seller;
};