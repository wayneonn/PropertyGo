module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
        userId: {
            type: DataTypes.BIGINT,
            primaryKey: true, // Set requestId as the primary key
            autoIncrement: true, // Enable auto-increment
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        postText: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })

    Users.associate = models => {
        Users.hasMany(models.Request, {
            foreignKey: 'userId', // This should match the name specified in Request.belongsTo
            onDelete: "CASCADE",
        });

        Users.belongsToMany(models.Schedule, {
            through: "ScheduleUser", // Specify the intermediary model
            foreignKey: "userId", // Foreign key in ScheduleUser
            otherKey: "scheduleId", // Foreign key in Schedule
        });
    };

    return Users;
}