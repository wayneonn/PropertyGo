module.exports = (sequelize, DataTypes) => {
    const Schedule = sequelize.define("Schedule", {
        scheduleId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        meetupDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        meetupTime: {
            type: DataTypes.TIME,
            allowNull: false,
        },
    }, {
        freezeTableName: true
    });

    Schedule.associate = (models) => {
        Schedule.belongsTo(models.User, {
            foreignKey: {
                name: 'userId',
                allowNull: false,
            },
            as: 'user',
        });
        Schedule.belongsTo(models.Property, {
            foreignKey: {
                name: 'propertyId',
                allowNull: false,
            },
            as: 'property',
        });
    };

    return Schedule;
};
