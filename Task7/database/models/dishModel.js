
import mongoose from "mongoose";

const dishSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    chef: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId, // must be ObjectId
      ref: "Category",
    },
        shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
    imageUrl: { type: String },
    isAvailable: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Dish", dishSchema);
