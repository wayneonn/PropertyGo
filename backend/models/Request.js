module.exports = (sequelize, DataTypes) => {
    const Request = sequelize.define("Request", {
        serviceId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    });

    return Request;
}
