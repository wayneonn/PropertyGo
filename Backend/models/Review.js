module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define(
    "Review",
    {
      reviewId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      // images: {
      //     type: DataTypes.ARRAY(DataTypes.BLOB),
      //     allowNull: true,
      // },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      rating: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
    }
  );

  Review.prototype.changeDescription = function (newDescription) {
    this.description = newDescription;
  };

  Review.prototype.changeImages = function (newImages) {
    this.images = newImages;
  };

  Review.prototype.changeTitle = function (newTitle) {
    this.title = newTitle;
  };

  Review.associate = function (models) {
    Review.belongsTo(models.User, {
      foreignKey: {
        name: "reviewerId",
        allowNull: false,
      },
      as: "reviewer",
    });
    Review.belongsTo(models.User, {
      foreignKey: {
        name: "revieweeId",
        allowNull: false,
      },
      as: "reviewee",
    });
    Review.belongsTo(models.Property, {
      foreignKey: {
        name: "propertyId",
        allowNull: true,
      },
      as: "property",
    });
    Review.belongsTo(models.Request, {
      foreignKey: {
        name: "requestId",
        allowNull: true,
      },
      as: "request",
    });
    Review.belongsTo(models.Image, {
      foreignKey: "imageId",
    });
  };

  return Review;
};
