const express = require("express");
const router = express.Router();
const db = require('../db/model');
const {email_control, password_control} = require("../db/control");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register",async (req,res) => {
    const email = req.body.email;
    if(email_control(email) == -1) {return res.send("Wrong format");}
    const user = await db.findOne({where: {email: email}});
    if(user !== null){ return res.send("User is defined, try different email");}
    const password = String(req.body.password).trim();
    if(password_control(password) == -1) { return res.send("Short password")}
    if(password_control(password) == -2) { return res.send("Space found in password");}
    if(password_control(password) == -3) { return res.send("Evil word detected!");}
    const name= req.body.name;
    await bcrypt.hash(password,10,async (err,result) => {
        if(err) {return console.log(err);}
        try{
            await db.create({
                email: email,
                name: name,
                password: result
            })
            res.clearCookie("authToken");
            return res.send("User Created Successfully");
        }catch(err) { console.log(err);}
    });
});

router.post("/login",async(req,res) => {
  
    const email = String(req.body.email).trim();
    if(email_control(email) == -1 ){ return res.send("Please, enter a correct email");}
    const user = await db.findOne({where: {email: email}});
    if(user == undefined) { return res.send("User not found!");}
    const password = String(req.body.password).trim();
    if(password_control(password) !== 1) { return res.send("Wrong password!");}
    
    const hash = user["password"];
    await bcrypt.compare(password,hash,(err,isMatch) => {
        if(err) {return console.log(err);}
        if(isMatch) {
            //GIRIS BASARILI ISE -> 
            const user_infos = {
                user_id: user.id,
                name: user.name
            }
            const token =  jwt.sign(user_infos,process.env.JWT_SECRET_KEY,{expiresIn: '1h'});
            return res.cookie('authToken',token,{maxAge: 1000*60*60, httpOnly: true}).redirect("/");

        }
    });

});



module.exports=  router;