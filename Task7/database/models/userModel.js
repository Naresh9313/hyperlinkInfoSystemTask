import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    phoneNumber:{
      type:Number,
      required:true
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "chef"],
      default: "user",
    },
    lastLogin: {
      type: Date,
    },
    loginStatus: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "active",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    loginType: {
      type: String,
      enum: ["n", "g", "f", "a"],
      default: "n",
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    addresses:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Address"
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
