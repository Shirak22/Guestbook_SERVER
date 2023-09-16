const express = require('express');
const app = express();
require('dotenv').config(); 
const {connectDB} = require('./configs/db');
connectDB();
const cookieParser = require('cookie-parser');

const mainRoute = require('./router/main');
const authRoute = require('./router/auth');





app.use(express.json()); 
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use('/api/',mainRoute); 
app.use('/api/auth',authRoute); 



app.listen(3000,()=> console.log('The server is running on port 3000')); 



