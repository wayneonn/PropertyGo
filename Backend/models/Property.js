module.exports = (sequelize, DataTypes) => {
    const Property = sequelize.define("Property", {
        propertyListingId: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
        },
        images: {
            type: DataTypes.BLOB,
            allowNull: true,
        },
        postedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        offeredPrice: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        bed: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        bathroom: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        size: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        top: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        tenure: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        propertyType: {
            type: DataTypes.ENUM('RESALE', 'NEW_LAUNCH'), 
            allowNull: false,
        },
        propertyStatus: {
            type: DataTypes.ENUM('ACTIVE', 'ON_HOLD', 'COMPLETED'), 
            allowNull: false,
        },
    }, {
        freezeTableName: true
    });

    Property.prototype.changePrice = function(newPrice) {
        this.price = newPrice;
        return this.save();
    };

    Property.prototype.changeDescription = function(newDescription) {
        this.description = newDescription;
        return this.save();
    };

    Property.prototype.changeImages = function(newImages) {
        this.images = newImages;
        return this.save();
    };

    Property.prototype.changeTitle = function(newTitle) {
        this.title = newTitle;
        return this.save();
    };

    // Property.associate = function(models) {
    //     Property.hasOne(models.Transaction, {
    //         foreignKey: 'propertyId',
    //         as: 'transaction',
    //     });

    //     Property.belongsTo(models.Buyer, {
    //         foreignKey: 'buyerId',
    //         as: 'buyer',
    //     });

    Property.associate = (models) => {
        Property.belongsTo(models.User, {
            foreignKey: {
                name: 'userId',
                allowNull: false,
              },
            as: 'buyer',
        });
        Property.belongsTo(models.User, {
            foreignKey: {
                name: 'userId',
                allowNull: false,
              },
          as: 'propertyAgent',
        });
        Property.belongsTo(models.User, {
            foreignKey: {
                name: 'userId',
                allowNull: false,
              },
          as: 'seller',
        });
        Property.hasMany(models.Chat, {
          foreignKey: 'propertyId',
          as: 'chats',
        });
        Property.hasMany(models.Review, {
            foreignKey: 'propertyId',
            as: 'reviews',
        });
        Property.hasOne(models.Transaction, {
            foreignKey: {
                name: 'transactionId',
                allowNull: false,
              }, // This will be the foreign key in the Transaction model
          onDelete: 'CASCADE', // If an invoice is deleted, delete the associated transaction
        });
        Property.hasMany(models.Image, {
            foreignKey: 'imageId',
            as: 'propertyImages',
        });
    };

    return Property;
}
