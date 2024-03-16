const express = require ('express');
const app = express();
require('dotenv').config();
const passportJWT = require('../src/config/passport-jwt');
const connectDB = require('../src/config/db');
const errorMiddleware = require('../src/middleware/errorMiddleware');
const cors = require('cors');

const Port = 8080 || process.env.Port;

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit:'16kb'}));
app.use(express.urlencoded({extended:true,limit:'1024kb'}));
app.use(express.static("public"));

app.get('/',(_,res)=>{
    res.status(200).json({
        message:"Success"
    })
})
app.use('/api/v1',require('../src/routes/index'));

app.use(errorMiddleware);


connectDB().then(()=>{
    app.listen(Port,(error)=>{
        
        if(error){
            console.log("Something went wrong while starting the server");
            return;
        }
        console.log(`Server is up and running on Port ${Port}`);
    })
}).catch((err)=>{
    console.log("MongoDB connection failed !!! ", err);
    
})

module.exports = app;