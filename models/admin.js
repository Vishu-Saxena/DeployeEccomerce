const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name :{
        type : String,
        required : true,
        trim : true
    },
    email :{
        type : String,
        required : true,
        unique : true
    },
    password :{
        type : String,
        required : true
    },
    phone : {
        type : String,
        requred : true
    },
    address : {
        type : String,
        required : true
    },
   
} , {timestamps : true} );

module.exports = mongoose.model('admins' , adminSchema);