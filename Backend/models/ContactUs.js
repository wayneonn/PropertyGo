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
      // Create ReasonEnum
      reason: {
        type: DataTypes.ENUM('GENERAL', 'SUPPORT', 'FEEDBACK', 'OTHERS'),
        allowNull: false,
      },
      // Create StatusEnum
      status: {
        type: DataTypes.ENUM('REPLIED', 'CLOSED', 'PENDING'),
        allowNull: false,
      },
      // timeStamp: {
      //   type: DataTypes.DATE,
      //   allowNull: false,
      // },
    }, {
      freezeTableName: true,
    });
  
    ContactUs.associate = (models) => {
      ContactUs.belongsTo(models.User, {
        foreignKey: {
          name: 'userId', // Specify the foreign key name explicitly
          allowNull: false,
        },
        as: 'user',
      });
    };
  
    return ContactUs;
  };
  