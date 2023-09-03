const { Sequelize, DataTypes } = require("sequelize");

module.exports.Countries = Object.freeze({
  Singapore: 'Singapore',
  Malaysia: 'Malaysia',
  Indonesia: 'Indonesia'
});

module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
        userName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        token: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        countryOfOrigin: {
          type: DataTypes.ENUM,
          values: Object.values(this.Countries),
          defaultValue: this.Countries.Singapore,
          allowNull: false,
        },
        dateOfBirth: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
          allowNull: false,
        },
        rating: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          defaultValue: 0,
        },
    });

    return Users;
};