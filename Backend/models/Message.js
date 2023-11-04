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

    Message.associate = (models) => {
        Message.belongsTo(models.Chat, {
          foreignKey: {
            name: 'chatId',
            allowNull: false,
          },
          as: 'chat'
        });

        Message.belongsTo(models.User, {
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: true,
                name: 'senderId'
            },
            as: 'sender',
        })

        Message.belongsTo(models.User, {
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: true,
                name: 'receiverId'
            },
            as: 'receiver',
        })

      };      

    return Message;
};
