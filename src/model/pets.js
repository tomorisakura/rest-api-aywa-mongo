const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const pets = mongoose.Schema({
    clinic : {
        type : ObjectId,
        ref : 'Clinics'
    },
    types : {
        type : ObjectId,
        ref : 'Types'
    },
    picture : [{
        pic_name : String,
        pic_url : String,
        pic_compress : String,
        required : false
    }],
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
        required : true,
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
    status : {
        type : Boolean,
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