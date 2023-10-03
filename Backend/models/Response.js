module.exports = (sequelize, DataTypes) => {
  const Response = sequelize.define(
    "Response",
    {
      responseId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
    }
  );

  Response.associate = (models) => {
    Response.belongsTo(models.ContactUs, {
      foreignKey: {
        name: "contactUsId",
        allowNull: false,
      },
      as: "contactUs",
    });
    Response.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        allowNull: true,
      },
      as: "user",
    });
    Response.belongsTo(models.Admin, {
      foreignKey: {
        name: "adminId",
        allowNull: true,
      },
      as: "admin",
    });
  };

  return Response;
};
