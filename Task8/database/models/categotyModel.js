// categoryModel.js
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  imageUrl: String,
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model("Category", categorySchema);
