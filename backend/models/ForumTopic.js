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
                allowNull: false,
                name: 'forumTopicId'
            },
            as: 'forumPosts',
        });
        ForumTopic.belongsTo(models.User, { 
            foreignKey: {
                allowNull: true,
                name: 'userId'
            },
            as: 'user',
        });
        ForumTopic.belongsTo(models.Admin, { 
            foreignKey: {
                allowNull: true,
                name: 'adminId'
            },
            as: 'admin',
        });
        ForumTopic.belongsToMany(models.User, {
            through: "UserTopicFlagged", // Specify the intermediary model
            foreignKey: "forumTopicId", // Foreign key 
            as: "usersFlagged",
        });
        ForumTopic.belongsToMany(models.User, {
            through: "UserTopicUpvoted", // Specify the intermediary model
            foreignKey: "forumTopicId", // Foreign key 
            as: "usersUpvoted",
        });
        ForumTopic.belongsToMany(models.User, {
            through: "UserTopicDownvoted", // Specify the intermediary model
            foreignKey: "forumTopicId", // Foreign key 
            as: "usersDownvoted",
        });
    };

    return ForumTopic;
}