module.exports = (sequelize, DataTypes) => {
    const ContactUs = sequelize.define("ContactUs", {
        contactUsId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        //create ReasonEnum
        reason: {
            type: DataTypes.ENUM('GENERAL', 'SUPPORT', 'FEEDBACK', 'OTHERS'),
            allowNull: false,
        },
        //create StatusEnum
        status: {
            type: DataTypes.ENUM('OPEN', 'CLOSED', 'PENDING'),
            allowNull: false,
        },
        timeStamp: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    })

    return ContactUs;
}