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
      transactionItem: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      gst: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      onHoldBalance: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.0,
        allowNull: true,
      },
      paymentAmount: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.0,
        allowNull: true,
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
        type: DataTypes.ENUM("REQUEST", "TOKEN_PURCHASE", "OPTION_FEE", "OPTION_EXERCISE_FEE", "PARTNER_SUBSCRIPTION", "COMMISSION_FEE"),
        allowNull: false,
      },
      reimbursed: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
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
      allowNull: true,
    });
  };

  return Transaction;
};
