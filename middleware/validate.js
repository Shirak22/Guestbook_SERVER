
const {User} = require('../models/user');
const jwt = require('jsonwebtoken');




const  checkUserdata = (req,res,next) => {
    const body = req.body;
    const passwordPattern = /[0-9]+\w+/g;
    const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g ; 
    if( body.hasOwnProperty('username') &&
        body.hasOwnProperty('password') &&
        body.hasOwnProperty('confirm_passowrd') &&
        body.hasOwnProperty('email') &&
        body.hasOwnProperty('country') ){

        if(body.password.length > 3 && passwordPattern.test(body.password) &&
            emailPattern.test(body.email)){

            next(); 
        }else if(body.password.length < 3 || passwordPattern.test(body.password)){
            console.log(!passwordPattern.test(body.password));
            res.status(400).json({success:false, message: 'The password length is less then 3 and must  contains [numbers, lowercase and uppercase letters] !'}); 
        }else if(!emailPattern.test(body.email)){
            res.status(400).json({success:false, message: 'The email you provided is not valid !'}); 
        }
    } else{
        res.status(400).json({success:false,message: 'Please check your inputs! '}); 
    }
} 

const userExistence = async (req,res,next) => {
    const {email} = req.body;
    const user = await User.findOne({email:email.toLowerCase()});
        if(!user){
            next();
        }else {
            res.status(400).json({message:'the email is already exists, please try another one! '});
        }
}

//check the token and protect the private sections 
const protect = async (req,res,next)=> {
    let token = req.cookies.jwt; 
    if(token){  
        try {
           const decoded = await jwt.verify(token, process.env.JWT_SECRET); 
           req.user = await User.findById(decoded.userId).select('-password');
           next();
        } catch (error) {
            res.status(401).json({success:false, message:'invalid token'}); 

        }
    }else {
        res.status(401).json({success:false, message:'no token'}); 
    }
}

module.exports = {
    checkUserdata,
    userExistence,
    protect
}