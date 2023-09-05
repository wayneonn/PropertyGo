module.exports = (sequelize, DataTypes) => {
  const ReviewForumComments = sequelize.define("ReviewForumComments", {
      reviewForumCommentsId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
  });

  return ReviewForumComments;
};

