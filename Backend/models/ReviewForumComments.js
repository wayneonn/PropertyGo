module.exports = (sequelize, DataTypes) => {
  const ReviewForumComment = sequelize.define("ReviewForumComment", {
      reviewForumCommentId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
  }, {
    freezeTableName: true
});

  return ReviewForumComment;
};

