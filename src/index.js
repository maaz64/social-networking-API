require('dotenv').config();
const express = require ('express');
const app = express();
const connectDB = require ('./config/db');
const passportJWT = require('./config/passport-jwt');
const errorMiddleware = require('./middleware/errorMiddleware');


const Port = 8080 || process.env.Port;

app.use(express.json({limit:'16kb'}));
app.use(express.urlencoded({extended:true,limit:'1024kb'}));
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
