const mongoose = require('mongoose'); 
const db_uri = process.env.DB_CONNECT; 

const {
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_NAME,
  } = process.env;

  
const connectDB = async () => {
    const uri = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authMechanism=DEFAULT&authSource=admin`; 
    try {
        const conn = await mongoose.connect(uri);
        console.log('connected on host: ' + conn.connection.host); 
    } catch (error) {
        console.log(error);
    }
}


module.exports =  {connectDB}; 