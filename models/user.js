const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
    role : {
        type : Number //role field is used to determin the user as admin or not if role=1 then admin and if 0 means not admin
    }
} , {timestamps : true} );

module.exports = mongoose.model('users' , userSchema);