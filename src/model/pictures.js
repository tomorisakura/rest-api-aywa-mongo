const mongoose = require('mongoose');

const pictures = mongoose.Schema({
    name : {
        type : String,
        required: true
    },
    pic_url : {
        type : String,
        required: true
    },
    pic_name : {
        type : String,
        required: true
    },
    createdAt : {
        type : Date,
        required: true,
        default: Date.now()
    },
    updatedAt: {
        type : Date,
        required : false,
        default : null
    }

});

module.exports = mongoose.model('Pictures', pictures);