const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const dbConnect = async()=>{
    try {
        const con = await mongoose.connect(process.env.URL);
        console.log(`connected to database successfully`);
    } catch (error) {
        console.log(error);
    }
}

module.exports = dbConnect;