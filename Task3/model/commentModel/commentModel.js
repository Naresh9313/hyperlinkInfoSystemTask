const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    post_id: {
        type: mongoose.Schema.Types.ObjectId,   
        ref: 'Post',
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text:{
        type: String,
        required: true  
    },
    is_deleted:{
        type: Boolean,
        default: false
    }   
}, { timestamps: true });   

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
