module.exports = (sequelize, DataTypes) => {
  const Folder = sequelize.define("Folder", {
      folderId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
      },
      title: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      timestamp: {
          type: DataTypes.DATE,
          allowNull: false,
      },
  });

  Folder.associate = function(models) {
      Folder.hasMany(models.Document, {
        foreignKey: 'folderId',
        as: 'documents',
      });
  }

  return Folder;
};
