module.exports = (sequelize, DataTypes) => {
    const Property = sequelize.define("Property", {
        propertyListingId: {
            type: DataTypes.BIGINT,
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
            type: DataTypes.ENUM('type1', 'type2', 'type3'), // replace with your types
            allowNull: false,
        },
        propertyStatus: {
            type: DataTypes.ENUM('status1', 'status2', 'status3'), // replace with your statuses
            allowNull: false,
        },
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

    Property.associate = function(models) {
        Property.hasOne(models.Transaction, {
            foreignKey: 'propertyId',
            as: 'transaction',
        });

        Property.belongsTo(models.Buyer, {
            foreignKey: 'buyerId',
            as: 'buyer',
        });

        Property.hasMany(models.Chat, {
            foreignKey: 'propertyId',
            as: 'chats',
        });

        Property.hasMany(models.Review, {
            foreignKey: 'propertyId',
            as: 'reviews',
        });
    };

    return Property;
}
