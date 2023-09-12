

module.exports = (sequelize, DataTypes) => {
    const ForumPost = sequelize.define("ForumPost", {
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
    }
        , {
            freezeTableName: true
        }
    )

    ForumPost.associate = (models) => {
        ForumPost.hasMany(models.ForumComment, {
            onDelete: "CASCADE",
            foreignKey: {
                name: 'forumCommentId'
            },
            as: 'forumComments',
        });
        ForumPost.belongsTo(models.ForumTopic, {
            foreignKey: {
                allowNull: false,
                name: 'forumTopicId',
            },
            as: 'forumTopic',
        });
        ForumPost.belongsTo(models.User, {
            foreignKey: {
                allowNull: false,
                name: 'userId',
            },
            as: 'user',
        });
        ForumPost.belongsTo(models.Image, {
            foreignKey: 'imageId',
        });
    };

    return ForumPost;
}