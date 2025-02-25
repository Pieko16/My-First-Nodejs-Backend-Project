const {DataTypes} = require("sequelize");
const db = require("./db_connection");

const model = db.define("user_model",{

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        required: true,
    },
    name: {
        type: DataTypes.STRING(255),
        required: true,
    },
    email: {
        type: DataTypes.STRING(255),
        unique: true,
        required: true
    },
    password :{
        type: DataTypes.STRING(255),
        required: true
    }

},{timestamps: false});

async function create() {
    try{
        await model.sync({alter: true});
        console.log("Model Created");
    }catch (err) {
        console.log(err);
    }
}
create();
 
module.exports = model;
