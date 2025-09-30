import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String },
    state: { type: String },
    chef: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    imageUrl: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Shop", shopSchema);
