const express = require('express');
// const cors = require("cors"); // Import the cors middleware
const router = express.Router();
const {User, Lawyer} = require("../models")


// router.use(cors());
router.get("/", async (req, res)=>{
    const listOfUser = await User.findAll();
    res.json(listOfUser);
})

router.post("/", async (req, res)=>{
    const user = req.body;
    await User.create(user);
    res.json(user); //everytime we create a new user, we send back the user
})

module.exports = router;