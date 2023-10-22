module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    "Transaction",
    {
      transactionId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      // timestamp: {
      //   type: DataTypes.DATE,
      //   allowNull: false,
      // },
      onHoldBalance: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.0,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("PENDING", "REFUNDED", "PAID"),
        allowNull: false,
      },
      stripePaymentResponse: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      transactionType: {
        type: DataTypes.ENUM("REQUEST", "OTP", "TOKENS"),
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
    }
  );

  Transaction.associate = function (models) {
    Transaction.hasMany(models.Document, {
      foreignKey: "transactionId",
      allowNull: false,
    });
    Transaction.belongsTo(models.Request, {
      as: "request",
      foreignKey: "requestId",
      allowNull: true,
    });
    Transaction.belongsTo(models.User, {
      as: "buyer",
      foreignKey: "buyerId",
      allowNull: false,
    });
    Transaction.belongsTo(models.Property, {
      foreignKey: "propertyId",
      as: "propertyListing",
      allowNull: false,
    });
    Transaction.belongsTo(models.Invoice, {
      foreignKey: "invoiceId", // This should match the foreign key in the Invoice model
      onDelete: "CASCADE", // If a transaction is deleted, delete the associated invoice
      allowNull: false,
    });
  };

  return Transaction;
};
