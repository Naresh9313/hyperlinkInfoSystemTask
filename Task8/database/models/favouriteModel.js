import mongoose from "mongoose";

const favouriteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      addedAt: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model("favouriteModel", favouriteSchema);
