const mongoose = require('mongoose');

const connect = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('oh yeahh Db connected ');
    }catch (error){
        console.log('Db connection error: ', error);
        process.exit(1);
    }
}

module.exports = connect;