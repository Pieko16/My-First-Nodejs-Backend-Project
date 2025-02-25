const db = require("./db_connection");
const {DataTypes} = require("sequelize");

const task_model = db.define("task_model",{
    id: {
        primaryKey: true,
        autoIncrement: true,
        required: true,
        allowNull: false,
        type: DataTypes.INTEGER
    },
    title: {
        type: DataTypes.STRING,
        required: true,
        autoIncrement: false,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        required: true,
        autoIncrement: false,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM,
        required: true,
        values : ["pending","in progress", "completed"],
        defaultValue: "pending"
    }, 
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        required: true
    }
    
},{timestamps: false});

async function create() {
    try{
        await task_model.sync({alter: true});
        console.log("Task Model Created!");
    }catch(err) {console.log(err);}
}

create();

module.exports = task_model;
