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
    });

    return Schedule;
};
