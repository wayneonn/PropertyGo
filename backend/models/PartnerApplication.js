module.exports = (sequelize, DataTypes) => {
  const PartnerApplication = sequelize.define(
    "PartnerApplication",
    {
      partnerApplicationId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      companyName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userRole: {
        type: DataTypes.ENUM("GENERAL", "SUPPORT", "FEEDBACK", "OTHERS"),
        allowNull: false,
      },
      cardNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cardHolderName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cvc: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expiryDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
    }
  );

  PartnerApplication.associate = (models) => {
    // Define bi-directional relationships
    // One-to-one relationship from PartnerApplication to Admin (1)
    PartnerApplication.belongsTo(models.Admin, {
      foreignKey: {
        name: "adminId",
        allowNull: false,
      },
      as: "admin",
    });

    // One-to-one relationship from PartnerApplication to Document (1..*)
    PartnerApplication.hasMany(models.Document, {
      foreignKey: {
        name: "partnerApplicationId",
        allowNull: false,
      },
      as: "documents",
    });

    // One-to-one relationship from PartnerApplication to User (1)
    PartnerApplication.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
      as: "user",
    });
  };

  return PartnerApplication;
};
