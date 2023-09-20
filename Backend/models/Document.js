module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define(
    "Document",
    {
      documentId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      document: {
        type: DataTypes.BLOB("medium"), // max 16MB
        allowNull: false,
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      size: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
    }
  );

  Document.prototype.changeDescription = function (newDescription) {
    this.description = newDescription;
  };

  Document.prototype.changeTitle = function (newTitle) {
    this.title = newTitle;
  };

  Document.associate = function (models) {
    Document.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
      as: "User",
    });

    Document.belongsTo(models.Transaction, {
      foreignKey: {
        name: "transactionId",
        allowNull: false,
      },
      as: "Transaction",
    });

    Document.belongsTo(models.Folder, {
      foreignKey: {
        name: "folderId",
        allowNull: false,
      },
      as: "Folder",
    });

    Document.belongsTo(models.PartnerApplication, {
      foreignKey: {
        name: "partnerApplicationId",
        allowNull: true,
      },
      as: "PartnerApplication",
    });
  };

  return Document;
};
