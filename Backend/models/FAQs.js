module.exports = (sequelize, DataTypes) => {
    const FAQ = sequelize.define("FAQ", {
        question: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        answer: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        freezeTableName: true
    }
    )

    return FAQ;
}