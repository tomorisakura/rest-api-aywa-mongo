const mongoose = require('mongoose');

const clincs = mongoose.Schema({
    clinic_name : {
        type :String,
        required : true
    },
    uniqname : {
        type : String,
        required : true
    },
    no_strv : {
        type : String,
        required : true
    },
    no_hp : {
        type : String,
        required : true
    },
    email : {
        type: String,
        required: true
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
        required : false,
        default : null
    }


});

module.exports = mongoose.model('Clinics', clincs);