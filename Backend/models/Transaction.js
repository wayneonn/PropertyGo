module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define("Transaction", {
        transactionId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        onHoldBalance: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
    })

    Transaction.associate = function(models) {
        Transaction.hasMany(models.Document, { foreignKey: 'transactionId' });
        Transaction.belongsTo(models.User, { as: 'Buyer', foreignKey: 'buyerId' });
        Transaction.belongsTo(models.Property, { foreignKey: 'propertyId' });
        Transaction.belongsTo(models.Invoice, { foreignKey: 'invoiceId' });
        Transaction.belongsTo(models.User, { as: 'Seller', foreignKey: 'sellerId' });
    }

    return Transaction;
}
