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

    })

    Chat.associate = (models) => {
        Chat.belongsTo(models.User, { as: 'sender' }); // Many-to-one for sender
        Chat.belongsTo(models.User, { as: 'receiver' }); // Many-to-one for receiver
        Chat.belongsTo(models.Property)
        Chat.hasMany(models.Message, {
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: false
            }
        })
      };

    return Chat;
}