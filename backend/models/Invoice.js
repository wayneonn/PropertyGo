module.exports = (sequelize, DataTypes) => {
    const Invoice = sequelize.define("Invoice", {
        invoiceId: {
            type: DataTypes.BIGINT,
            primaryKey: true, // Set requestId as the primary key
            autoIncrement: true, // Enable auto-increment
        },
        timestamp: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        stripePaymentResponse: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })

    Invoice.associate = (models) => {
        Invoice.hasOne(models.Transaction, {
            foreignKey: 'invoiceId', // This will be the foreign key in the Transaction model
            onDelete: 'CASCADE', // If an invoice is deleted, delete the associated transaction
        });
    };

    return Invoice;
}
