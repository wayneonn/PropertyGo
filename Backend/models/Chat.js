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

    Chat.associate = (models) => {
        Chat.belongsTo(models.User, { as: 'sender', foreignKey: 'senderId', }); // Many-to-one for sender
        Chat.belongsTo(models.User, { as: 'receiver', foreignKey: 'receiverId', }); // Many-to-one for receiver
        Chat.belongsTo(models.Property, { as: 'propertyListing', foreignKey: 'propertyId',});
        Chat.hasMany(models.Message, {
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: false
            }
        });
        Chat.hasMany(models.Request, {
          onDelete: "CASCADE",
          foreignKey: {
              allowNull: false
          }
       });
      };

    return Chat;
}