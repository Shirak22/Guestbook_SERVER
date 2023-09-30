const express = require('express');
const app = express();
require('dotenv').config(); 
const {connectDB} = require('./configs/db');
connectDB();
const cookieParser = require('cookie-parser');
const mainRoute = require('./router/main');
const authRoute = require('./router/auth');
const cors = require('cors');
const https = require("https");
const fs = require("fs");






app.use(express.json()); 
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({
    origin:`${process.env.FRONTEND_HOST}`,
    credentials:true,
}));
app.use('/api/',mainRoute); 
app.use('/api/auth',authRoute); 

app.all('*',(req,res)=> {
    res.status(404).json({success:false,message: '404 The page not found! '}); 
})


// https
//   .createServer(
// 		// Provide the private and public key to the server by reading each
// 		// file's content with the readFileSync() method.
//     {
//       key: fs.readFileSync("key.pem"),
//       cert: fs.readFileSync("cert.pem"),
//     },
//     app
//   ).listen(process.env.PORT || 3000,()=> console.log('The server is running on port 3000')); 




app.listen(process.env.PORT || 3000,()=> console.log('The server is running on port 3000')); 