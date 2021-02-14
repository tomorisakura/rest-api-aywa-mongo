import mongoose from 'mongoose';

const types = mongoose.Schema({
    jenis: {
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

export default mongoose.model('Types', types);