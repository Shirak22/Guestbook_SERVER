const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');



const entriesSchema = new mongoose.Schema({
    id:{
        type:String,
    },
    username: {
        type:String,
        required:true
    },
    userId: {
        type:Object
    },
    email: {
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true,
        maxLength:15
    },
    comment: {
        type:String,
        required:true,
        maxLength:1200
    },
    createdAt: {
        type:Date,
    }


}); 


entriesSchema.pre('save',async  function(next) {
    if(!this.isModified('id')){
        next();
    }

    this.id = uuidv4();
    this.createdAt = new Date(); 
});

const Entry = new mongoose.model('Entries',entriesSchema); 



module.exports = {
    Entry
}