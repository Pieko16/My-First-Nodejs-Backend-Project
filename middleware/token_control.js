const jwt = require("jsonwebtoken");
const user_model = require("../db/model");

const token_control = async (req,res,next) => {
    const val = req.cookies["authToken"];
    if(val == undefined) {return res.status(400).send("Please login")};

    const verifyToken = (token) => {
        return new Promise((resolve,rejected) => {
            jwt.verify(token,process.env.JWT_SECRET_KEY,(err,result) => {
                if(err) {rejected(-1);}
                else resolve(result);
            });
        });
    }
    try {
        const token = await verifyToken(val);
        const user = await user_model.findOne({
            where:{
                id:token.user_id
            }
        })
        if(user == undefined) {return res.status(400).send("User not found, login again");}
        next(); 
    }catch(err){
        return res.status(400).clearCookie("authToken").send("Token is invalid!");
    }

}


module.exports = {
    token_control
}