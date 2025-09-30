import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
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
  experience: {
    type: String,
  },
  fees: {
    type: Number,
  },
  image: {
    type: String,
  },
},{timestamps:true});

export default mongoose.model("Doctor", doctorSchema);
