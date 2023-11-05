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
        
        Chat.belongsTo(models.User, {
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: false,
                name: 'senderId'
            },
            as: 'sender',
        })

        Chat.belongsTo(models.User, {
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: false,
                name: 'receiverId'
            },
            as: 'receiver',
        })

        Chat.belongsTo(models.Property, {
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: false,
                name: 'propertyId'
            },
            as: 'propertyListing',
        })

        Chat.hasMany(models.Message, {
            onDelete: "CASCADE",
            foreignKey: {
                name: 'chatId',
                allowNull: false
            },
            as: 'messages'
        });

        Chat.hasOne(models.Request, {
            onDelete: "CASCADE",
            foreignKey: {
                name: 'chatId',
                allowNull: true
            },
            as: 'request'
        });

    };

    return Chat;
}