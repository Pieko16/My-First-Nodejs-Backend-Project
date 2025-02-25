const express = require("express");
const app = express();
require("dotenv").config();
const router = require("./router/router_1");
const router_main = require("./router/router_2");
const db = require("./db/model");
const task = require("./db/taskmodel");
const cookieparser = require("cookie-parser");
const task_router = require("./router/task_router");
const rateLimit = require("express-rate-limit");
const path = require("path");

const limiter = rateLimit({
  windowMs: 60 * 1000, // 15 dakika
  max: 100, // 100 istek
  message: "Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin."
});
app.use(limiter);  

app.use(cookieparser());

app.set(express.static(path.join(__dirname,"public")));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api/auth",router);
app.use("/api/tasks",task_router);
app.use("/",router_main);






const server = app.listen(process.env.PORT, () => {
    console.log("Host opened");
})