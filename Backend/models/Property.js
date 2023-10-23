module.exports = (sequelize, DataTypes) => {
  const Property = sequelize.define(
    "Property",
    {
      propertyListingId: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      images: {
        type: DataTypes.BLOB,
        allowNull: true,
      },
      postedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      optionFee: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      optionExerciseFee: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      offeredPrice: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bed: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bathroom: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      size: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      top: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      tenure: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      propertyType: {
        type: DataTypes.ENUM("RESALE", "NEW_LAUNCH"),
        allowNull: false,
      },
      propertyStatus: {
        type: DataTypes.ENUM("ACTIVE", "ON_HOLD", "COMPLETED"),
        allowNull: false,
      },
      postalCode: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      unitNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      area: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      region: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      boostListingStartDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      boostListingEndDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      longitude: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      latitude: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      approvalStatus: {
        type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
        allowNull: false,
        defaultValue: "PENDING",
      },
      adminNotes: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
    }
  );

  Property.prototype.changePrice = function (newPrice) {
    this.price = newPrice;
    return this.save();
  };

  Property.prototype.changeDescription = function (newDescription) {
    this.description = newDescription;
    return this.save();
  };

  Property.prototype.changeImages = function (newImages) {
    this.images = newImages;
    return this.save();
  };

  Property.prototype.changeTitle = function (newTitle) {
    this.title = newTitle;
    return this.save();
  };

  Property.associate = (models) => {
    Property.belongsTo(models.User, {
      foreignKey: {
        name: "buyerId",
        allowNull: true,
      },
      as: "buyer",
    });
    // Property.belongsTo(models.User, {
    //   foreignKey: {
    //     name: "userId",
    //     allowNull: false,
    //   },
    //   as: "propertyAgent",
    // });
    Property.belongsTo(models.User, {
      foreignKey: {
        name: "sellerId",
        allowNull: false,
      },
      as: "seller",
    });
    Property.hasMany(models.Chat, {
      foreignKey: "propertyId",
      as: "chats",
    });
    Property.hasMany(models.Review, {
      foreignKey: "propertyId",
      as: "reviews",
    });
    Property.hasMany(models.Transaction, {
      foreignKey: "propertyId",
      as: "transactions",
    });
    // Property.hasMany(models.Image, {
    //     foreignKey: 'imageId',
    //     as: 'propertyImages',
    // });
    Property.belongsToMany(models.User, {
      through: "UserFavourites", // This is the name of the join table
      foreignKey: "propertyId",
      otherKey: "userId",
      as: "favouritedByUsers",
    });
  };

  return Property;
};
