module.exports = (sequelize, DataTypes) => {
    const ForumComments = sequelize.define("ForumComments", {
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

    ForumComments.associate = (models) => {
        ForumComments.belongsTo(models.ForumPosts, { 
            foreignKey: {
                name: 'forumPostId'
            } 
        });
         ForumComments.belongsTo(models.User, { 
            foreignKey: 'userId',
            as: 'user',
        });
        ForumComments.belongsToMany(models.Review, {
          through: "ReviewForumComments", // Specify the intermediary model
          foreignKey: "forumCommentId", // Foreign key in ScheduleUser
          otherKey: "reviewId", // Foreign key in Users
        });
    };

    return ForumComments;
}