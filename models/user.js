const  mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');



const userSchema = new mongoose.Schema({
    userId: {
        type:String
    },
    username: {
        type:String,
        required: true,
        minLength:3,
        maxLength:25
    },
    country: {
        type:String,
        required: true,
        minLength:3,
        maxLength:15
    },
    email: {
        type:String,
        required:true,
        unique:true,
        minLength: 10
    },
    password: {
        type:String,
        required:true,
    }
}, {
    timestamps: true
}); 

userSchema.pre('save',async  function(next) {
    if(!this.isModified('password')){
        next();
    }

const salt = await  bcrypt.genSalt(10); 
this.password = await bcrypt.hash(this.password,salt);
this.userId =  uuidv4();
this.email = this.email.toLowerCase(); 
});

//making method into user to check the enterd passowrd validation  with bcrypt and hashed password
//@this.password is the hashed password whick we creatred in userSchema.pre 
userSchema.methods.passwordMatch = async function(userInputPassword) {

    return await bcrypt.compare(userInputPassword,this.password); 
}

const User = new mongoose.model('User',userSchema); 


module.exports = {User}; 