module.exports = (sequelize, DataTypes) => {
    const Document = sequelize.define("Document", {
        documentId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        document: {
            type: DataTypes.BLOB,
            allowNull: false,
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    })

    Document.prototype.changeDescription = function(newDescription) {
        this.description = newDescription;
    }

    Document.prototype.changeTitle = function(newTitle) {
        this.title = newTitle;
    }

    // Document.associate = function(models) {
    //     Document.belongsTo(models.User, { foreignKey: 'userId' });
    //     Document.belongsTo(models.Transaction, { foreignKey: 'transactionId' });
    // }

    return Document;
}
