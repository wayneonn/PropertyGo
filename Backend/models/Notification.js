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
        // timeStamp: {
        //     type: DataTypes.DATE,
        //     allowNull: false,
        // },
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
        hasRead: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }, {
        freezeTableName: true
    })

    Notification.associate = (models) => {
        Notification.belongsTo(models.User, {
            foreignKey: {
                name: 'userId',
                allowNull: true,
              },
            as: 'user',
        });
        
        Notification.belongsTo(models.Admin, {
            foreignKey: {
                name: 'adminId',
                allowNull: true,
            },
            as: 'admin',
        });

        Notification.belongsTo(models.ForumTopic, {
            foreignKey: {
                name: 'forumTopicId',
                allowNull: true,
            },
            as: 'forumTopic',
        });

        Notification.belongsTo(models.ForumPost, {
            foreignKey: {
                name: 'forumPostId',
                allowNull: true,
            },
            as: 'forumPost',
        });

        Notification.belongsTo(models.ForumComment, {
            foreignKey: {
                name: 'forumCommentId',
                allowNull: true,
            },
            as: 'forumComment',
        });
        Notification.belongsTo(models.Admin, {
            foreignKey: {
                name: 'adminNotificationId',
                allowNull: true,
            },
            as: 'adminNotification',
        });

        Notification.belongsTo(models.User, {
            foreignKey: {
                name: 'userNotificationId',
                allowNull: true,
            },
            as: 'userNotification',
        });
    };

  return Notification;
};
