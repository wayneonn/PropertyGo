module.exports = (sequelize, DataTypes) => {
    const Chat = sequelize.define("Chat", {
        chatId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        offeredPrice: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },

    }, {
        freezeTableName: true
    }
    )

    return Chat;
}