const mongoose = require('mongoose');
const config = require('config');
const db= config.get('mongoURI');

const connectDB = async () => {
    try{
        await mongoose.connect(db,{
            useNewUrlParser:true
        });
        console.log("Mongo Db connect");
    }
    catch(err){
        console.log("Db connection error=", err.message);
        process.exit(1);
    }
}

module.exports = connectDB;