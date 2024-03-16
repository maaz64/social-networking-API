const express = require ('express');
const app = express();
const passportJWT = require('./config/passport-jwt');
const errorMiddleware = require('./middleware/errorMiddleware');
const cors = require('cors');

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
app.use('/api/v1',require('./routes/index'));

app.use(errorMiddleware);

module.exports = app;