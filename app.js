const express = require("express");
const app = express();
const cors =  require("cors")
const {router}  = require("./controllers/index.js")
const dotenv = require('dotenv')
dotenv.config()


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(cors())
app.use(router)
app.listen(process.env.PORT,()=>{
    console.log("server is running on "+process.env.PORT)
})