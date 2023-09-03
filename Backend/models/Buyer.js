const Users = require('./Users.js'); // Import the parent Users model

module.exports = (sequelize, DataTypes) => {
  sequelize.models = {};

  const Buyer = sequelize.define("Buyer", {

  });

  return Buyer;
};