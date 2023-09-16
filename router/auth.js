const {Router} = require('express'); 
const { validateRegisterUserInput, userExistence, protect } = require('../middleware/userControl');
const { User } = require('../models/user');
const generateToken = require('../utils/generateToken'); 
const router = Router();



//user register 
//@method post
router.post('/register',validateRegisterUserInput,userExistence,async(req,res)=> {
    const  {username,country,email,password} = req.body; 
    const user = await User.create({
        username,
        country,
        email,
        password
    });
    
    if(user){
        //generating jwt and set it in cookie.
        generateToken(res,user._id);
        console.log(user);
        
        res.status(201).json({success:true,user:{
            _id:user._id,
            username:user.username,
            email:user.email
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

//user update user
router.put('/update',protect, async (req,res)=> {
    const user = await User.findOne({_id:req.user._id});

    //if the user found, 
    if(user ){
             //if there is any new username or password then it will use it or it will be that the saved. 
        user.username = req.body.username || req.user.username;
        user.email = req.body.email || req.user.email; 
        
            //the user can change the password also 
            if(req.body.password){
                user.password = req.body.password;
            }
            
        const updatedUser = await user.save();
        res.status(200).json({success:true,user: {
            username:updatedUser.username,
            email:updatedUser.email,
        }})
    }else {
        res.status(401).json({success:false, message:'User not found'});
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