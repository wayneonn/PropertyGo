module.exports = (sequelize, DataTypes) => {
    const ForumTopics = sequelize.define("ForumTopics", {
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