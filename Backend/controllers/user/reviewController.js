// const { User, Property, Review } = require('../../models');
// const sharp = require('sharp');

// async function getRatingForUser(req, res) {
//   try {
//     const { revieweeId } = req.params;

//     // Fetch reviews associated with the user
//     const userReviews = await Review.findAll({
//       where: { revieweeId },
//     });

//     // Calculate the user's rating by averaging the ratings from reviews
//     let totalRating = 0;
//     if (userReviews.length > 0) {
//       for (const review of userReviews) {
//         totalRating += review.rating;
//       }
//       const userRating = totalRating / userReviews.length;

//       return res.json({ revieweeId, userRating });
//     } else {
//       return res.json({ revieweeId, userRating: 0 }); // If no reviews, return a default rating of 0
//     }
//   } catch (error) {
//     console.error('Error fetching user rating:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// }

// module.exports = {
//   getRatingForUser,
// };
