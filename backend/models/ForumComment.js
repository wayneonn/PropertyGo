module.exports = (sequelize, DataTypes) => {
    const ForumComment = sequelize.define("ForumComment", {
        forumCommentId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
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
        //     type: DataTypes.BLOB, // there is no array for BLOB. so either we use postgresql as sequelize offer arrays datatype for postgresql or we create an Images entity referencing to those entities require image and then the single image is in BLOB
        //     // allowNull: false,
        // },
    }, {
        freezeTableName: true
    }
    )

    ForumComment.associate = (models) => {
        // Define a unidirectional relationship from ForumComment to Image (0..*)
        ForumComment.belongsTo(models.Image, {
            foreignKey: 'imageId',
        });
        ForumComment.belongsTo(models.ForumPost, {
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: false,
                name: 'forumPostId'
            },
            as: 'forumPost', 
        });
        ForumComment.belongsTo(models.User, {
            foreignKey: {
                allowNull: false,
                name: 'userId',
            },
            as: 'user',
        });
        ForumComment.belongsToMany(models.User, {
            through: "UserCommentFlagged", // Specify the intermediary model
            foreignKey: "forumCommentId",
            as: "usersFlagged",
        });
        ForumComment.belongsToMany(models.User, {
            through: "UserCommentUpvoted", // Specify the intermediary model
            foreignKey: "forumCommentId",
            as: "usersUpvoted",
        });
        ForumComment.belongsToMany(models.User, {
            through: "UserCommentDownvoted", // Specify the intermediary model
            foreignKey: "forumCommentId",
            as: "usersDownvoted",
        });
    };

    return ForumComment;
}