

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
        // likes: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        // },
        // dislikes: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        // },
        isInappropriate: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        // images: {
        //     type: DataTypes.BLOB,
        //     // allowNull: false,
        // },
    }
        , {
            freezeTableName: true
        }
    )

    ForumPost.associate = (models) => {
        ForumPost.hasMany(models.ForumComment, {
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: false,
                name: 'forumPostId'
            },
            as: 'forumComments',
        });
        ForumPost.belongsTo(models.ForumTopic, {
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: false,
                name: 'forumTopicId'
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
        ForumPost.hasMany(models.Image, {
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: true,
                name: 'forumPostId'
            },
            as: 'images',
        });
        ForumPost.belongsToMany(models.User, {
            through: "UserPostFlagged", // Specify the intermediary model
            foreignKey: "forumPostId",
            as: "usersFlagged",
        });
        ForumPost.belongsToMany(models.User, {
            through: "UserPostUpvoted", // Specify the intermediary model
            foreignKey: "forumPostId",
            as: "usersUpvoted",
        });
        ForumPost.belongsToMany(models.User, {
            through: "UserPostDownvoted", // Specify the intermediary model
            foreignKey: "forumPostId",
            as: "usersDownvoted",
        });
        ForumPost.hasMany(models.Notification, {
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: true,
                name: 'forumPostId'
            },
            as: 'notifications',
        });
    };

    return ForumPost;
}