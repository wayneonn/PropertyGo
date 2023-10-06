const { Review } = require("../../models");

const getAllReviews = async (req, res) => {
  const reviews = await Review.findAll();

  res.status(200).json({ reviews: reviews });
};

module.exports = {
  getAllReviews,
};
