const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',    
        required: true
    },
    title: {    
        type: String,
        required: true
    },
    content:{   
        type: String,
        required: true      
    }  ,
    status:{
        type: String,
        enum:["Published","Draft"],
        default:"Draft" 
    },
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'     
    }],
    dislikes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    is_deleted:{
        type: Boolean,
        default: false
    }   
}, { timestamps: true });   

const Post = mongoose.model('Post', postSchema);
module.exports = Post;