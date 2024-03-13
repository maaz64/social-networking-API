const express = require ('express');
require('dotenv').config();
const app = express();
const connectDB = require ('./config/db');
const errorMiddleware = require('./middleware/errorMiddleware');
const multer = require('multer');


const Port = 8080 || process.env.Port;

app.use(express.json({limit:'16kb'}));
app.use(express.urlencoded({extended:true,limit:'1034kb'}));
app.use(express.static("public"));



app.use('/api/v1',require('./routes/index'));

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
