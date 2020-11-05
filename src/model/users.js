const mongoose = require('mongoose');

const users = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true
    },
    no_hp : {
        type : String,
        required : true
    },
    alamat : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        required : true,
        default : Date.now()
    },
    updatedAt : {
        type : Date,
        default : null
    }

});

module.exports = mongoose.model('Users', users);