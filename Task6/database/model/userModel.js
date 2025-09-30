import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    mobileNo: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: { 
        type: String,
        required: true,
        enum: ["mediaReporter", "visitor"]
    },
    lastLogin: {
        type: Date
    },
    loginStatus: {
        type: String,
        enum: ["online", "offline"],
        default: "offline"
    },
    status: {
        type: String,
        enum: ["active", "inactive", "blocked"],
        default: "active"
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    loginType: {
        type: String,
        enum: ["n", "g", "f", "a"], // n->normal, g->google, f->facebook, a->apple
        default: "n"
    },
    deviceInfo: {
        deviceType: { type: String },  // e.g., "Mobile", "Desktop"
        os: { type: String },          // e.g., "iOS", "Android"
        browser: { type: String },     // e.g., "Chrome", "Safari"
        ipAddress: { type: String }    // Optional
    },
    resetPasswordToken:{
        type:String
    },
    resetPasswordExpires: {
        type:Date
    },
    country: { type: mongoose.Schema.Types.ObjectId, ref: "Country" },
    state: { type: mongoose.Schema.Types.ObjectId, ref: "State" },
    city: { type: mongoose.Schema.Types.ObjectId, ref: "City" },
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;
