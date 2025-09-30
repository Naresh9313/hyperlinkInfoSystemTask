import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
     password: {
      type: String,
      required: function () {
        return this.loginType === "n";
      },
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
     social_id: {
        type:String,
    },
    favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }],
  },
  { timestamps: true }
);

const User = new mongoose.model("User", userSchema);
export default User;
