module.exports = (sequelize, DataTypes) => {
    const Invoice = sequelize.define("Invoice", {
        invoiceId: {
            type: DataTypes.BIGINT,
            allowNull: false,
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

    return Invoice;
}
