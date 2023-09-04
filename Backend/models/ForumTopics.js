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
    })

    return ForumTopics;
}