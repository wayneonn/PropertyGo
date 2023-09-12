module.exports = (sequelize, DataTypes) => {
    const Schedule = sequelize.define("Schedule", {
        scheduleId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        meetup: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    }, {
        freezeTableName: true
    });

    Schedule.associate = (models) => {
        Schedule.belongsToMany(models.User, {
            through: "ScheduleUser", // Specify the intermediary model
            foreignKey: "scheduleId", // Foreign key in ScheduleUser
            otherKey: "userId", // Foreign key in User
            allowNull: false,
        });
    };

    return Schedule;
};
