const express = require('express');
const router = express.Router();

const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '975614309732-7efv821237vv7prh9oq73vek4bv2h4il.apps.googleusercontent.com';
// const REDIRECT_URI = 'https://c5c5-132-147-113-199.ngrok.io'; // Update with your actual redirect URI
const client = new OAuth2Client(CLIENT_ID);
// const client = new OAuth2Client(CLIENT_ID, '', REDIRECT_URI);

const db = require('../models'); // Adjust path as needed

router.post("/google-signin", async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const googleId = payload['sub'];
    const email = payload['email'];

    // Check if user exists in the database
    let user = await db.User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      // If the user doesn't exist, create a new user
      user = await db.User.create({
        email: email,
        googleId: googleId,
        // Add any other necessary fields

      });
    }

    // Send user data back to the frontend
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
