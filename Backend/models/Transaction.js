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
    }, {
        freezeTableName: true
    })

    Transaction.associate = function (models) {
        Transaction.hasMany(models.Document, { foreignKey: 'transactionId' });
        Transaction.belongsTo(models.User, { as: 'buyer', foreignKey: 'userId' });
        Transaction.belongsTo(models.Property, { foreignKey: 'propertyId' });
        Transaction.belongsTo(models.Invoice, { foreignKey: 'invoiceId' });
        Transaction.belongsTo(models.User, { as: 'seller', foreignKey: 'userId' });
        Transaction.belongsTo(models.Invoice, {
            foreignKey: 'invoiceId', // This should match the foreign key in the Invoice model
            onDelete: 'CASCADE', // If a transaction is deleted, delete the associated invoice
        });
    }

    return Transaction;
}
