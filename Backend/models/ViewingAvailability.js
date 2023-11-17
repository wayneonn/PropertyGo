module.exports = (sequelize, DataTypes) => {
    const ViewingAvailability = sequelize.define("ViewingAvailability", {
        viewingAvailabilityId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        date: {
            type: DataTypes.DATEONLY, // Use DATEONLY for date without time
            allowNull: false,
        },
        startTimeSlot: {
            type: DataTypes.TIME, // Use TIME for time slots
            allowNull: false,
        },
        endTimeSlot: {
            type: DataTypes.TIME, // Use TIME for time slots
            allowNull: false,
        },
    }, {
        freezeTableName: true
    });

    ViewingAvailability.associate = (models) => {
        ViewingAvailability.belongsTo(models.Property, {
            foreignKey: {
                name: 'propertyListingId',
                allowNull: true,
            },
            as: 'propertyListing',
        });

        ViewingAvailability.belongsTo(models.Chat, {
            foreignKey: {
                name: "chatId", allowNull: true,
            },
            as: "chat"
        })

        ViewingAvailability.addHook('beforeValidate', (viewingAvailability, options) => {
            if (viewingAvailability.propertyListingId === null && viewingAvailability.chatId === null) {
                throw new Error('Either propertyListingId or chatId must be set.');
            }
        });
    };

    return ViewingAvailability;
};
