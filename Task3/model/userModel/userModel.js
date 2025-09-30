const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {        
        type: String,
        required: true,
        unique: true    
    },
    password: {
        type: String,
        required: true
    },
    phone_no:{
        type: String,
        required: true  
    },
    address:{
        type: String,
        required: true  
    },
    gender:{
        type: String,
        required: true,
        enum:["male","female"]
    },
    company_name:{
        type: String,
        required: true  
    },
    status:{
        type: String,
        enum:["Active","Inactive"],
        default:"Active"
    },
    is_deleted:{
        type: Boolean,
        default: false
    }   
}, { timestamps: true });


const User = mongoose.model('User', userSchema);
module.exports = User;