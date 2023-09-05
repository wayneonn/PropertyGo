module.exports = (sequelize, DataTypes) => {
  sequelize.models = {};

  const User = sequelize.define("User", {
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      token: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      countryOfOrigin: {
        type: DataTypes.ENUM('SINGAPORE', 'MALAYSIA', 'INDONESIA'),
        allowNull: false,
      },
      dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      rating: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      experience: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      projectsCompleted: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      companyName: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      specialization: {
        type: DataTypes.ENUM('MOVER', 'INTERIOR DESIGNER', 'PLUMBER', 'CARPENTER'),
        allowNull: false,
      },
      userType: {
        type: DataTypes.ENUM('LAWYER', 'PROPERTY AGENT', 'CONTRACTOR', 'BUYER', 'SELLER'),
        allowNull: false,
      },
  }, {
    freezeTableName: true
});

  User.associate = (models) => {
    User.hasMany(models.Request, {
      onDelete: "CASCADE",
      foreignKey: {
          allowNull: false
      },
      as: 'requests'
    });
    User.hasMany(models.Notification, {
      onDelete: "CASCADE",
      foreignKey: {
          allowNull: false
      },
      as: 'notifications'
    });
    User.hasMany(models.ContactUs, {
      onDelete: "CASCADE",
      foreignKey: {
          allowNull: false
      },
      as: 'contactUss'
    }),
    User.hasMany(models.ForumTopic, {
      onDelete: "CASCADE",
      foreignKey: {
          allowNull: false
      },
      as: 'forumTopics'
    });
    User.hasMany(models.ForumComment, {
      onDelete: "CASCADE",
      foreignKey: {
          allowNull: false
      },
      as: 'forumComments'
    });
    User.hasMany(models.Document, {
      onDelete: "CASCADE",
      foreignKey: {
          allowNull: false
      },
      as: 'documents'
    });
    User.hasMany(models.Review, {
      onDelete: "CASCADE",
      foreignKey: {
          allowNull: false
      },
      as: 'reviews'
    });
    User.hasMany(models.Chat, {
      onDelete: "CASCADE",
      foreignKey: {
          allowNull: false
      },
      as: 'receiverChats'
    });
    User.hasMany(models.Chat, {
      onDelete: "CASCADE",
      foreignKey: {
          allowNull: false
      },
      as: 'senderChats'
    });
    User.hasMany(models.Property, {
      onDelete: "CASCADE",
      foreignKey: {
          allowNull: false
      },
      as: 'favourites'
    });
    User.hasMany(models.Property, {
      onDelete: "CASCADE",
      foreignKey: {
          allowNull: false
      },
      as: 'buyerListings'
    });
    User.hasMany(models.Property, {
      onDelete: "CASCADE",
      foreignKey: {
          allowNull: false
      },
      as: 'sellerListings'
    });
    User.hasMany(models.Property, {
      onDelete: "CASCADE",
      foreignKey: {
          allowNull: false
      },
      as: 'agentListings'
     });
    User.belongsToMany(models.Schedule, {
      through: "ScheduleUser", // Specify the intermediary model
      foreignKey: "userId", // Foreign key in ScheduleUser
      otherKey: "scheduleId", // Foreign key in Schedule
     });
    User.hasMany(models.Folder, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      },
      as: 'folders'
    });
  };

  return User;
};
