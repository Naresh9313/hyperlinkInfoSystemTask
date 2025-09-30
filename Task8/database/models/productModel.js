// productModel.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: Number,
  description: String,
  imageUrl: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", productSchema);
