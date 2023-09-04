module.exports = (sequelize, DataTypes) => {
    const FAQs = sequelize.define("FAQs", {
        faqId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
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