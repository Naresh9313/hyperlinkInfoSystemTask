import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  logoUrl: String,
}, { timestamps: true });

export default mongoose.models.Brand || mongoose.model("Brand", brandSchema);
