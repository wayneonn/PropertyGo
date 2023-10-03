module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define("Image", {
        imageId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        // title: {
        //     type: DataTypes.STRING,
        //     allowNull: false,
        // },
        image: {
            type: DataTypes.BLOB,
            allowNull: false,
        },
    }, {
        freezeTableName: true
    });

    Image.associate = (models) => {
        Image.belongsTo(models.Property, {
            foreignKey: {
                name: 'propertyId',
                allowNull: true,
              },
            as: 'propertyListing',
        });
    };

    return Image;
};
