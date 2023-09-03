module.exports = (sequelize, DataTypes) => {
    const FAQs = sequelize.define("FAQs", {
        question: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        answer: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    })

    return FAQs;
}