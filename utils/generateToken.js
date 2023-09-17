const jwt = require('jsonwebtoken');


const generateToken = (res,userId) => {
    const token = jwt.sign({userId},process.env.JWT_SECRET, {
        expiresIn: '30d'
    }); 
    //setting cookie http only 
    res.cookie('jwt',token, {
        httpOnly:true,
        //https : returns false if development  
        secure: process.env.NODE_ENV !== 'development',

        sameSite:'strict',
        // maxAge: 30days 
        maxAge: 1000*60*60*24*30
    }); 
}


module.exports = generateToken; 