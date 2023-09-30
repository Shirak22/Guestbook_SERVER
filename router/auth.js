const {Router} = require('express'); 
const { validateRegisterUserInput, userExistence, protect } = require('../middleware/userControl');
const { User } = require('../models/user');
const generateToken = require('../utils/generateToken'); 
const router = Router();



//user register 
//@method post
router.post('/register',validateRegisterUserInput,userExistence,async(req,res)=> {
  try {
    const  {username,country,email,password} = req.body; 
    const user = await User.create({
        username,
        country,
        email,
        password,
        role:'user'
    });
    
    if(user){
        //generating jwt and set it in cookie.
        generateToken(res,user.userId);
        res.status(201).json({success:true,user:{
            userId:user.userId,
            username:user.username,
            email:user.email
        }}); 
    }else {
        res.status(400).json({success:false, message:'Faild to create user!'});
    }

  } catch (error) {
    res.json({
        success:false,
        message:error.message
    })
  }
});


//user login 
router.post('/login', async (req,res)=> {
    const {email,password} = req.body;
    const user = await User.findOne({email:email});

    if(user && (await user.passwordMatch(password))){
        generateToken(res,user.userId);
        res.json({success:true,message:{userId:user.userId,email:user.email,username:user.username,role:user?.role}});
    }else {
        res.json({success:false,message:'Please check your email or password! '}); 

    }


});


//check logged user, 
router.get('/checkuser',  protect , async (req,res)=> { 

    res.status(200).json({
        success:true,
        user:{
            userId:req.user?.userId,
            username:req.user?.username,
            email:req.user?.email
        }
    })
}); 

//user update user
router.put('/update',protect, async (req,res)=> {
    try {
        const user = await User.findOne({userId:req.user.userId});

    //if the user found, 
    if(user ){
             //if there is any new username or password then it will use it or it will be that the saved. 
        user.username = req.body.username || req.user.username;
        user.email = req.body.email || req.user.email;
        user.country = req.body.country || req.user.country; 
        
            //the user can change the password also 
            if(req.body.password){
                user.password = req.body.password;
            }
            
        const updatedUser = await user.save();
        res.status(200).json({success:true,user: {
            username:updatedUser.username,
            email:updatedUser.email,
            country:updatedUser.country
        }})
    }else {
        res.status(401).json({success:false, message:'User not found'});
    }

    } catch (error) {
        res.json({success:false, 
        message: error.message});
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