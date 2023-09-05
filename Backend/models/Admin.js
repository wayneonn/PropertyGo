module.exports = (sequelize, DataTypes) => {
    const Admins = sequelize.define("Admins", {
        adminId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    Admins.associate = (models) => {
        Admins.hasMany(models.FAQs, {
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: false
            }
        });
    };

    return Admins;
}