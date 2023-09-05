module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define("Admin", {
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
    }, {
        freezeTableName: true
    });

    Admin.associate = (models) => {
        Admin.hasMany(models.FAQ, {
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: false
            }
        });
    };

    return Admin;
}