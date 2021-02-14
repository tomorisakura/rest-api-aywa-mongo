import mongoose from 'mongoose';

const users = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : false,
        default : null
    },
    no_hp : {
        type : String,
        required : false,
        default : null
    },
    email : {
        type : String,
        required : true
    },
    alamat : {
        type : String,
        required : false,
        default : null
    },
    password : {
        type : String,
        required : false,
        default : null
    },
    uid_auth : {
        type: String,
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

export default mongoose.model('Users', users);