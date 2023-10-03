module.exports = (sequelize, DataTypes) => {
  const ContactUs = sequelize.define(
    "ContactUs",
    {
      contactUsId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // Create ReasonEnum
      reason: {
        type: DataTypes.ENUM("GENERAL", "SUPPORT", "FEEDBACK", "OTHERS"),
        allowNull: false,
      },
      // Create StatusEnum
      status: {
        type: DataTypes.ENUM("REPLIED", "PENDING", "CLOSED"),
        allowNull: false,
      },
      // response: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      // },
    },
    {
      freezeTableName: true,
    }
  );

  ContactUs.associate = (models) => {
    ContactUs.belongsTo(models.User, {
      foreignKey: {
        name: "userId", // Specify the foreign key name explicitly
        allowNull: false,
      },
      as: "user",
    });
    ContactUs.belongsTo(models.Admin, {
      foreignKey: {
        name: "adminId", // Specify the foreign key name explicitly
        allowNull: true,
      },
      as: "admin",
    });
    ContactUs.hasMany(models.Response, {
      onDelete: "CASCADE",
      foreignKey: "contactUsId",
      as: "responses",
    });
  };

  return ContactUs;
};
