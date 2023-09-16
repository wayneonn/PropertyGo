const express = require('express');
const cors = require("cors"); // Import the cors middleware
const bcrypt = require('bcrypt');
const { User } = require('../models');

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { userName, password, email, country, dateOfBirth } = req.body;

    // Basic validation, you can add more validation as needed
    if (!userName || !password || !email || !country || !dateOfBirth) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the user already exists (you can use a database query here)
    const existingUser = await User.findOne({ where: { userName } });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = {
      userName,
      password: hashedPassword,
      email,
      country,
      dateOfBirth,
    };

    // Save the new user to the database (you can adjust this according to your database model)
    const user = await User.create(newUser);

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
