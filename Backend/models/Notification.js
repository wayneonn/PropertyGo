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
            defaultValue: true,
        },
        isPending: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        isCompleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        hasRead: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        hasUserRead: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        userNavigationScreen: {
            type: DataTypes.STRING,
            allowNull: true,
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

        Notification.belongsTo(models.Schedule, {
            foreignKey: {
                name: 'scheduleId',
                allowNull: true,
            },
            as: 'schedule',
        });

        Notification.belongsTo(models.Transaction, {
            foreignKey: {
                name: 'transactionId',
                allowNull: true,
            },
            as: 'transaction',
        });
    };

    return Notification;
};
