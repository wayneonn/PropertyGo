module.exports = (sequelize, DataTypes) => {
  sequelize.models = {};
  const globalEmitter = require("../globalEmitter");

  const User = sequelize.define(
    "User",
    {
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
        type: DataTypes.ENUM("SINGAPORE", "MALAYSIA", "INDONESIA"),
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
        type: DataTypes.ENUM(
          "MOVER",
          "INTERIOR DESIGNER",
          "PLUMBER",
          "CARPENTER"
        ),
        allowNull: true,
      },
      userType: {
        type: DataTypes.ENUM(
          "LAWYER",
          "PROPERTY AGENT",
          "CONTRACTOR",
          "BUYER_SELLER"
        ),
        allowNull: false,
      },
      pushToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      googleId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profileImage: {
        type: DataTypes.BLOB("long"),
        allowNull: true,
      },
      boostListingStartDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      boostListingEndDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      stripeCustomerId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      partnerSubscriptionPaid: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      partnerSubscriptionEndDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      bankName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bankAccount: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
      hooks: {
        afterCreate: async (user, options) => {
          globalEmitter.emit("newUserCreated", user);
        },
      },
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Request, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "userId",
      },
      as: "requests",
    });
    User.hasMany(models.Notification, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "userId",
      },
      as: "notifications",
    });
    User.hasMany(models.ContactUs, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "userId",
      },
      as: "contactUs-es",
    }),
      User.hasMany(models.ForumTopic, {
        onDelete: "CASCADE",
        foreignKey: {
          name: "userId",
        },
        as: "forumTopics",
      });
    User.hasMany(models.ForumComment, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "userId",
      },
      as: "forumComments",
    });
    User.hasMany(models.Document, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
      as: "documents",
    });
    // User.hasMany(models.Review, {
    //   onDelete: "CASCADE",
    //   foreignKey: {
    //     name: "reviewerId",
    //   },
    //   as: "reviewsPosted",
    // });
    // User.hasMany(models.Review, {
    //   onDelete: "CASCADE",
    //   foreignKey: {
    //     name: "revieweeId",
    //   },
    //   as: "reviewsReceived",
    // });
    User.hasMany(models.Chat, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "receiverId",
        allowNull: false
      },
      as: "receiverChats",
    });
    User.hasMany(models.Chat, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "senderId",
        allowNull: false
      },
      as: "senderChats",
    });

    User.hasMany(models.Message, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "userId",
        allowNull: false
      },
      as: "messages",
    });

    User.hasMany(models.Response, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "userId",
        allowNull: true
      },
      as: "responses",
    });

    User.belongsToMany(models.Property, {
      through: "UserFavourites",
      foreignKey: "userId",
      otherKey: "propertyId",
      as: "favouriteProperties",
    });
    User.hasMany(models.Property, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "userId",
      },
      as: "buyerListings",
    });
    User.hasMany(models.Property, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
      as: "sellerListings",
    });
    User.hasMany(models.Property, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "userId",
      },
      as: "agentListings",
    });

    User.hasMany(models.Folder, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "userId",
      },
      as: "folders",
    });
    User.hasMany(models.ForumPost, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "userId",
      },
      as: "forumPosts",
    });
    User.hasMany(models.Transaction, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "userId",
      },
      as: "transactions",
    });
    User.hasOne(models.PartnerApplication, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "userId",
      },
      as: "partnerApplication",
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
    User.hasOne(models.Notification, {
      onDelete: "CASCADE",
      foreignKey: {
        name: 'userNotificationId',
        allowNull: true,
      },
      as: 'notification',
    });
  };

  return User;
};
