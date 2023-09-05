

module.exports = (sequelize, DataTypes) => {
    const ForumPosts = sequelize.define("ForumPosts", {
        forumPostId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        likes: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        dislikes: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        isInappropriate: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        images: {
            type: DataTypes.BLOB,
            allowNull: false,
        },
    });

    ForumPosts.associate = (models) => {
        ForumPosts.hasMany(models.ForumComments, {
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: false,
                name: 'forumCommentId'
            }
        });
        ForumPosts.belongsTo(models.ForumTopics, { 
            foreignKey: {
                name: 'forumTopicId'
            } 
        });
        ForumPosts.belongsTo(models.User, { 
            foreignKey: 'userId',
            as: 'user',
        });
    };

    return ForumPosts;
}