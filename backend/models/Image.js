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
            type: DataTypes.BLOB('long'),
            allowNull: false,
        },
        // propertyId: {
        //     type: DataTypes.BIGINT, // Adjust the data type as needed
        //     allowNull: false,
        // },
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

        Image.belongsTo(models.User, {
            foreignKey: {
                name: 'userId', allowNull: true
            },
            as: 'companyPhoto'
        })

        Image.belongsTo(models.Chat, {
            foreignKey: {
                name: "chatId",
                allowNull: true,
            }, as: "Chat"
        })
    };


    return Image;
};
