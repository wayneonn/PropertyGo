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
        ScheduleStatus: {
            type: DataTypes.ENUM("AWAIT_SELLER_CONFIRMATION", "SELLER_CONFIRMED", "SELLER_REJECT", "BUYER_CANCELLED", "SELLER_CANCELLED", "COMPLETED"),
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
        Schedule.belongsTo(models.User, {
            foreignKey: {
                name: 'sellerId',
                allowNull: false,
            },
            as: 'seller',
        });
        Schedule.belongsTo(models.Property, {
            foreignKey: {
                name: 'propertyId',
                allowNull: false,
            },
            as: 'property',
        });
        Schedule.hasMany(models.Notification, {
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: true,
                name: 'scheduleId'
            },
            as: 'notifications',
        });
    };

    return Schedule;
};
