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
                name: 'forumPostId'
            }
        });
        ForumTopic.belongsTo(models.User, { 
            foreignKey: {
                name: 'userId'
            },
            as: 'user',
        });
    };

    return ForumTopic;
}