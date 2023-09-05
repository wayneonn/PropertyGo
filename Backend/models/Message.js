module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define("Message", {
        messageId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        messageText: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    }, {
        freezeTableName: true
    });

    return Message;
};
