const mongoose = require('mongoose');

const pets = mongoose.Schema({
    clinic_uniqname : {
        type : String,
        required : true
    },
    jenis : {
        type : String,
        required : true
    },
    nama_peliharaan : {
        type : String,
        required : true
    },
    uniqname : {
        type : String,
        required : true
    },
    pemilik_lama : {
        type : String,
        required : true
    },
    jenis_kelamin : {
        type : String,
        required : true
    },
    berat_peliharaan : {
        type : String,
        required : true
    },
    ras_peliharaan : {
        type : String,
        required : true
    },
    umur_peliharaan : {
        type : String,
        required : true
    },
    status_vaksin : {
        type : String,
        required : true
    },
    informasi : {
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

module.exports = mongoose.model('Pets', pets);