const express = require("express");
const router = express.Router();
const task_model  = require("../db/taskmodel");
const {token_control} = require("../middleware/token_control");
const jwt = require("jsonwebtoken");

const get_token = (value) => {
    return new Promise((resolve,reject) => {
        jwt.verify(value,process.env.JWT_SECRET_KEY,(err,result) => {
            if(err) {reject(-1);}
            else {resolve(result);}
        })
    })
}

router.post("/",token_control,async (req,res) => {
    const title = String(req.body.title).trim();
    const description = String(req.body.description).trim();
    try{
        const user = await get_token(req.cookies["authToken"]);
        if(title == undefined || description == undefined) { return res.status(400).send("Values are can not be null");}
        await task_model.create({
            title,
            description,
            status:"pending",
            userId: user.user_id
        })
        return res.status(200).send("Task created");

    }catch(err) {
        console.log("Hata olustur",err);
    }
});

router.get("/",token_control,async(req,res) => {

    try{
        const user = await get_token(req.cookies["authToken"]);
        const vals = await task_model.findAll({
            where:{
                userId: user.user_id
            }
        });
        if(vals[0] == undefined) { return res.status(400).send("There is no any task.");}
        const show  = [];
        vals.forEach((values) => {
            show.push({
                title: values.title,
                description: values.description
            });
        })
        return res.status(200).send(show);
    }catch(err) {
        return res.send("There is an error, sorry for that")
    }
    
    
});

router.get("/:id",token_control,async (req,res) => {

    try{
        const param_id  = req.params.id;

        const user = await get_token(req.cookies["authToken"]);
        const tasks = await task_model.findOne({
            where: {
                id: param_id,
                userId: user.user_id
            }
        });
        if(tasks == null) {return res.send("There is no any task");}
        return res.send(tasks);
    }catch(err) {
        return res.send("There is an error, sorry for that!")
    }
   
    
})

router.put("/:id",token_control,async (req,res) => {
    try{
        const user = await get_token(req.cookies["authToken"]);
        const task = await task_model.findOne({
         where: {
             id:req.params.id,
             userId: user.user_id
         }
        });
        if(task == null) { return res.send("There is no any task");}
        task.title = req.body.title;
        task.description = req.body.description;
        task.save();
        return res.send("Update is successfull");
    }catch(err) {
        return res.send("There is an error, sorry for that!")
    }
   
});

router.delete("/:id",token_control,async(req,res) => {
    const jwt_user = await get_token(req.cookies["authToken"]);
    const user = await task_model.destroy({
        where: {
            id: req.params.id,
            userId: jwt_user.user_id
        }
    })
    if(user === 0) {return res.send("There is no any task like this id ", req.params.id);}
    return res.send("Task is deleted");
});



module.exports = router;