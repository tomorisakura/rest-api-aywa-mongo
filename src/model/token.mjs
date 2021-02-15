import mongoose from 'mongoose';

const token = mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    role : {
        type: String,
        required: true
    },
    createdAt: {
        type : Date,
        required: true,
        default : Date.now
    },
    updatedAt: {
        type : Date,
        required : false,
        default : null
    }
});

export default mongoose.model('Token', token);