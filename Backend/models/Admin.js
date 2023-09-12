module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define("Admin", {
        adminId: {
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
    }, {
        freezeTableName: true
    });

    Admin.associate = (models) => {
        // Define a one-to-many relationship from Admin to FAQ (1..*)
        Admin.hasMany(models.FAQ, {
          onDelete: "CASCADE",
          foreignKey: {
            name: 'adminId',
            allowNull: false,
          },
          as: 'faqs',
        });
      
        // Define a one-to-many relationship from Admin to PartnerApplication (0..*)
        Admin.hasMany(models.PartnerApplication, {
          onDelete: "CASCADE",
          foreignKey: {
            name: 'adminId',
            allowNull: false,
          },
          as: 'partnerApplications', // Define an alias for the association
        });
      
        // Define a one-to-many relationship from Admin to ForumTopic (0..*)
        Admin.hasMany(models.ForumTopic, {
          onDelete: "CASCADE",
          foreignKey: {
            name: 'adminId',
            allowNull: false,
          },
          as: 'forumTopics', // Define an alias for the association
        });
      };
      

    return Admin;
}