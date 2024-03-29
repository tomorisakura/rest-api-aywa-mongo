import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;

const keep = mongoose.Schema({
    pet_id: {
        type: ObjectId,
        ref : 'Pets',
        required: true
    },

    users_id : {
        type: ObjectId,
        ref: 'Users',
        required: true
    },
    status_keep : {
        type : String,
        required : true
    },
    state : {
        type : Boolean,
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

export default mongoose.model('Keep', keep);