module.exports = (sequelize, DataTypes) => {
    const FAQ = sequelize.define("FAQ", {
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
            type: DataTypes.STRING,
            allowNull: false,
        },
        faqType: {
            type: DataTypes.ENUM('BUYER', 'SELLER'),
            allowNull: false
        }
    }, {
        freezeTableName: true
    });

    FAQ.associate = (models) => {
        FAQ.belongsTo(models.Admin, {
            foreignKey: {
                name: 'adminId',
                allowNull: false, 
            },
            as: 'admin',
        });
    };

    return FAQ;
}