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
            type: DataTypes.ENUM('General', 'Support', 'Feedback', 'Other'),
            allowNull: false,
        },
        //create StatusEnum
        status: {
            type: DataTypes.ENUM('Open', 'Closed', 'Pending'),
            allowNull: false,
        },
        timeStamp: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    })

    return ContactUs;
}