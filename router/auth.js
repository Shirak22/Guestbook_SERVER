const {Router} = require('express'); 
const { checkUserdata, userExistence } = require('../middleware/validate');
const { User } = require('../models/user');
const generateToken = require('../utils/generateToken'); 
const router = Router();



//user register 
//@method post
router.post('/register',checkUserdata,userExistence,async(req,res)=> {
    const  {username,country,email,password} = req.body; 
    const userCreate = await User.create({
        username,
        country,
        email,
        password
    });
    
    if(userCreate){
        //generating jwt and set it in cookie.
        generateToken(res,userCreate._id);
        console.log(userCreate);
        
        res.status(201).json({success:true,user:{
            _id:userCreate._id,
            username:userCreate.username,
            email:userCreate.email
        }}); 
    }else {
        res.status(400).json({success:false, message:'Faild to create user!'});
    }
});


//user login 
router.post('/login', async (req,res)=> {
    const {email,password} = req.body;
    const user = await User.findOne({email:email});

    if(user && (await user.passwordMatch(password))){
        generateToken(res,user._id);
        res.json({success:true,message:{_id:user._id,email:user.email,username:user.username,}});
    }else {
        res.json({success:false,message:'Please check your email or password! '});

    }


}); 
//user logout 
router.post('/logout', async (req,res)=> {
    res.cookie('jwt','', {
        httpOnly:true,
        expires:new Date(0)
    });

    res.status(200).json({success:true,message:'Logout User'});
});



//user history 


module.exports = router; 