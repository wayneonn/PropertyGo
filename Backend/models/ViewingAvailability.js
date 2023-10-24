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
                allowNull: false,
            },
            as: 'propertyListing',
        });

    };

    return ViewingAvailability;
};
