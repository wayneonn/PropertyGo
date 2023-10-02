module.exports = (sequelize, DataTypes) => {
  sequelize.models = {};
  const globalEmitter = require("../globalEmitter")

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
      allowNull: true,
      defaultValue: 0,
    },
    experience: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    projectsCompleted: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    contractorSpecialization: {
      type: DataTypes.ENUM('MOVER', 'INTERIOR DESIGNER', 'PLUMBER', 'CARPENTER'),
      allowNull: true,
    },
    userType: {
      type: DataTypes.ENUM('LAWYER', 'PROPERTY AGENT', 'CONTRACTOR', 'BUYER', 'SELLER'),
      allowNull: false,
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
   },   
   profileImage: {
    type: DataTypes.BLOB('long'),
    allowNull: true, 
  },
  }, {
    freezeTableName: true,
    hooks: {
      afterCreate: async (user, options) => {
        globalEmitter.emit('newUserCreated', user);
      }
    }
  });

  User.associate = (models) => {
    User.hasMany(models.Request, {
      onDelete: "CASCADE",
      foreignKey: {
        name: 'userId', 
      },
      as: 'requests'
    });
    User.hasMany(models.Notification, {
      onDelete: "CASCADE",
      foreignKey: {
        name: 'userId', 
      },
      as: 'notifications'
    });
    User.hasMany(models.ContactUs, {
      onDelete: "CASCADE",
      foreignKey: {
        name: 'userId', 
      },
      as: 'contactUs-es'
    }),
      User.hasMany(models.ForumTopic, {
        onDelete: "CASCADE",
        foreignKey: {
          name: 'userId', 
        },
        as: 'forumTopics'
      });
    User.hasMany(models.ForumComment, {
      onDelete: "CASCADE",
      foreignKey: {
        name: 'userId', 
      },
      as: 'forumComments'
    });
    User.hasMany(models.Document, {
      onDelete: "CASCADE",
      foreignKey: {
        name: 'userId', 
        allowNull: false
      },
      as: 'documents'
    });
    User.hasMany(models.Review, {
      onDelete: "CASCADE",
      foreignKey: {
        name: 'userId', 
      },
      as: 'reviews'
    });
    User.hasMany(models.Chat, {
      onDelete: "CASCADE",
      foreignKey: {
        name: 'userId', 
      },
      as: 'receiverChats'
    });
    User.hasMany(models.Chat, {
      onDelete: "CASCADE",
      foreignKey: {
        name: 'userId', 
      },
      as: 'senderChats'
    });
    User.hasMany(models.Property, {
      onDelete: "CASCADE",
      foreignKey: {
        name: 'userId',
      },
      as: 'favourites'
    });
    User.hasMany(models.Property, {
      onDelete: "CASCADE",
      foreignKey: {
        name: 'userId', 
      },
      as: 'buyerListings'
    });
    User.hasMany(models.Property, {
      onDelete: "CASCADE",
      foreignKey: {
        name: 'userId', 
        allowNull: false
      },
      as: 'sellerListings'
    });
    User.hasMany(models.Property, {
      onDelete: "CASCADE",
      foreignKey: {
        name: 'userId', 
      },
      as: 'agentListings'
    });
    User.belongsToMany(models.Schedule, {
      through: "ScheduleUser", // Specify the intermediary model
      foreignKey: "userId", // Foreign key in ScheduleUser
      otherKey: "scheduleId", // Foreign key in Schedule
      as: "schedules",
    });
    User.hasMany(models.Folder, {
      onDelete: "CASCADE",
      foreignKey: {
        name: 'userId', 
      },
      as: 'folders'
    });
    User.hasMany(models.ForumPost, {
      onDelete: "CASCADE",
      foreignKey: {
        name: 'userId', 
      },
      as: 'forumPosts'
    });
    User.hasMany(models.Transaction, {
      onDelete: "CASCADE",
      foreignKey: {
        name: 'userId', 
      },
      as: 'transactions'
    });
    User.hasOne(models.PartnerApplication, {
      onDelete: "CASCADE",
      foreignKey: {
        name: 'userId', 
      },
      as: 'partnerApplication'
    });
    User.belongsToMany(models.ForumTopic, {
      through: "UserTopicFlagged", // Specify the intermediary model
      foreignKey: "userId", // Foreign key
      as: "flaggedTopics",
    });
    User.belongsToMany(models.ForumTopic, {
      through: "UserTopicUpvoted", // Specify the intermediary model
      foreignKey: "userId", // Foreign key
      as: "upvotedTopics",
    });
    User.belongsToMany(models.ForumTopic, {
      through: "UserTopicDownvoted", // Specify the intermediary model
      foreignKey: "userId", // Foreign key
      as: "downvotedTopics",
    });
    User.belongsToMany(models.ForumPost, {
      through: "UserPostFlagged", // Specify the intermediary model
      foreignKey: "userId", // Foreign key
      as: "flaggedPosts",
    });
    User.belongsToMany(models.ForumPost, {
      through: "UserPostUpvoted", // Specify the intermediary model
      foreignKey: "userId", // Foreign key
      as: "upvotedPosts",
    });
    User.belongsToMany(models.ForumPost, {
      through: "UserPostDownvoted", // Specify the intermediary model
      foreignKey: "userId", // Foreign key
      as: "downvotedPosts",
    });
    User.belongsToMany(models.ForumComment, {
      through: "UserCommentFlagged", // Specify the intermediary model
      foreignKey: "userId", // Foreign key
      as: "flaggedComments",
    });
    User.belongsToMany(models.ForumComment, {
      through: "UserCommentUpvoted", // Specify the intermediary model
      foreignKey: "userId", // Foreign key
      as: "upvotedComments",
    });
    User.belongsToMany(models.ForumComment, {
      through: "UserCommentDownvoted", // Specify the intermediary model
      foreignKey: "userId", // Foreign key
      as: "downvotedComments",
    });

  };

  return User;
};
