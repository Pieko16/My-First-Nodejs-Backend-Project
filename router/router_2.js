const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {token_control} = require("../middleware/token_control");
const path = require("path");

router.get("/",(req,res) => {
 
    return res.send("Main page");
   
})

module.exports = router;