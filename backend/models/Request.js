module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define(
    "Request",
    {
      requestId: {
        type: DataTypes.BIGINT,
        primaryKey: true, // Set requestId as the primary key
        autoIncrement: true, // Enable auto-increment
      },
      price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
    }
  );

  Request.associate = (models) => {
    // Request.belongsTo(models.User, {
    //   foreignKey: {
    //     name: "userId", // This will be the foreign key in the Request table
    //     allowNull: false, // A request must have a user associated with it
    //   },
    //   onDelete: "CASCADE", // If a user is deleted, delete their associated requests
    //   as: "contractor",
    // });
    // Request.belongsTo(models.User, {
    //   foreignKey: {
    //     name: "userId", // This will be the foreign key in the Request table
    //     allowNull: false, // A request must have a user associated with it
    //   },
    //   onDelete: "CASCADE", // If a user is deleted, delete their associated requests
    //   as: "lawyer",
    // });
    // Request.belongsTo(models.User, {
    //   foreignKey: {
    //     name: "userId", // This will be the foreign key in the Request table
    //     allowNull: false, // A request must have a user associated with it
    //   },
    //   onDelete: "CASCADE", // If a user is deleted, delete their associated requests
    //   as: "propertyAgent",
    // });
    Request.belongsTo(models.User, {
      foreignKey: {
        name: "userId", 
        allowNull: false, 
      },
      onDelete: "CASCADE", 
      as: "user",
    });
    Request.belongsTo(models.Chat, {
      foreignKey: {
        name: "chatId", 
        allowNull: true, 
      },
      onDelete: "CASCADE", 
      as: "chat",
    });
    Request.hasMany(models.Transaction, {
      foreignKey: "requestId",
      as: "transactions",
    });
    Request.hasMany(models.Review, {
      foreignKey: "requestId",
      as: "reviews",
    });
  };

  // Request.belongsTo(sequelize.models.Users, {
  //     foreignKey: {
  //         name: 'userId', // This will be the foreign key in Request.js
  //         allowNull: false, // A request must have a user associated with it
  //     },
  //     onDelete: 'CASCADE', // If a user is deleted, delete their associated requests
  // });

  return Request;
};
