module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define("Notification", {
        notificationId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        timeStamp: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        isRecent: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        isPending: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        isCompleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    })

    Notification.associate = (models) => {
        Notification.belongsTo(models.User);
    };

    return Notification;
}