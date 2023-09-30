const jwt = require('jsonwebtoken');


const generateToken = (res,userId) => {
    const token = jwt.sign({userId},process.env.JWT_SECRET, {
        expiresIn: '1h'
    }); 
    //setting cookie http only 
    res.cookie('jwt',token, {
        httpOnly:true,
        //https : returns false if development  
        secure: process.env.NODE_ENV !== 'development',

        sameSite:'strict',
        // maxAge: 1h 
        maxAge: 1000*60*60
    }); 
}


module.exports = generateToken; 