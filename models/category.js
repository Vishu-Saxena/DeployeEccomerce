const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    slug : String
})

const categoryModule = mongoose.model('categories' , categorySchema);
module.exports = categoryModule;