const Sequelize = require("sequelize");
const sequelize = new Sequelize(process.env.SCHEMA,process.env.DB_USER,process.env.DB_PASS,{
    dialect: "mysql",
    host: "localhost"
});

async function connect() {
    try{
        await sequelize.authenticate({alter:true});
        console.log("Database connected");
    }catch (err){
        console.log(err);
    }
}

connect();
module.exports = sequelize;