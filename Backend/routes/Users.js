const express = require('express');
const router = express.Router();
const {Users, Lawyer} = require("../models")

router.get("/", async (req, res)=>{
    const listOfUsers = await Users.findAll();
    res.json(listOfUsers);
})

router.post("/", async (req, res)=>{
    const user = req.body;
    await Users.create(user);
    res.json(user); //everytime we create a new user, we send back the user
})

module.exports = router;