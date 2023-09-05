module.exports = (sequelize, DataTypes) => {
    const ForumTopic = sequelize.define("ForumTopic", {
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

    return ForumTopic;
}