require('dotenv').config()
//requiring dotenv file 
const express =require("express")
//requiring express
const app =express()

const mongoose=require("mongoose")
app.use(express.json()) 

mongoose.connect(process.env.mongodb_url,{ useNewUrlParser: true , useUnifiedTopology: true }) 
//conncting with importing url from .env file 
const db =mongoose.connection
db.on('error',(error)=>console.log(error))
// listenning to error
db.once('open',()=>console.log('connected to data base successfuly'))
// we need to listen to open once for khnowing if the data base is connected
app .listen(process.env.port,()=>console.log("server is runnig "))

const routes=require("./routes/person") // requiring file 
app.use("/person",routes)    // matching to url   