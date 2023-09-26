const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');



const viewsSchema = new mongoose.Schema({
    id:{
        type:String
    },
    viewsCount: {
        type:Number
    }
}, {
    timestamps:true
}); 


viewsSchema.pre('save',async  function(next) {
    if(!this.isModified('id')){
        next();
    }

    this.id = uuidv4();

});


const viewsCounter = new mongoose.model('Views',viewsSchema); 




module.exports = {
    viewsCounter
}