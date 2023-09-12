module.exports = (sequelize, DataTypes) => {
    const ForumTopic = sequelize.define("ForumTopic", {
        forumTopicId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        topicName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isInappropriate: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    }, {
        freezeTableName: true
    })
    ForumTopic.associate = (models) => {
        ForumTopic.hasMany(models.ForumPost, {
            onDelete: "CASCADE",
            foreignKey: {
                name: 'forumPostId'
            },
            as: 'forumPosts',
        });
        ForumTopic.belongsTo(models.User, { 
            foreignKey: {
                allowNull: false,
                name: 'userId'
            },
            as: 'user',
        });
        ForumTopic.belongsTo(models.Admin, { 
            foreignKey: {
                allowNull: false,
                name: 'adminId'
            },
            as: 'admin',
        });
    };

    return ForumTopic;
}