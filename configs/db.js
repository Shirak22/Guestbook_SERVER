const mongoose = require('mongoose'); 

const {
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_REMOTE
  } = process.env;


const remoteDatabase = (bool) => {
    if(bool === 'true'){
        return `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authMechanism=DEFAULT&authSource=admin`; 
    }else {
        return `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`
    }
} 

const connectDB = async () => {
    const uri = remoteDatabase(DB_REMOTE);
    try {
        const conn = await mongoose.connect(uri);
        console.log(uri);
        console.log('connected on host: ' + conn.connection.host); 
    } catch (error) {
        console.log(error);
    }
}




module.exports =  {connectDB}; 