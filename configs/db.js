const mongoose = require('mongoose'); 
const db_uri = process.env.DB_CONNECT; 

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(db_uri);
        console.log('connected on host: ' + conn.connection.host); 
    } catch (error) {
        console.log(error);
    }
}


module.exports =  {connectDB}; 