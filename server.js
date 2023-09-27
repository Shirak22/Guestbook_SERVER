const express = require('express');
const app = express();
require('dotenv').config(); 
const {connectDB} = require('./configs/db');
connectDB();
const cookieParser = require('cookie-parser');
const mainRoute = require('./router/main');
const authRoute = require('./router/auth');
const cors = require('cors');






app.use(express.json()); 
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({
    origin:`http://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}`,
    credentials:true,
}));
app.use('/api/',mainRoute); 
app.use('/api/auth',authRoute); 

app.all('*',(req,res)=> {
    res.status(404).json({success:false,message: '404 The page not found! '}); 
})


app.listen(process.env.PORT || 3000,()=> console.log('The server is running on port 3000')); 




