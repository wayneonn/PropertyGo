module.exports = (sequelize, DataTypes) => {
    const ForumTopics = sequelize.define("ForumTopics", {
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
    });

    ForumTopics.associate = (models) => {
        ForumTopics.hasMany(models.ForumPosts, {
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: false,
                name: 'forumPostId'
            }
        });
        ForumTopics.belongsTo(models.User, { 
            foreignKey: {
                name: 'userId'
            },
            as: 'user',
        });
    };

    return ForumTopics;
}