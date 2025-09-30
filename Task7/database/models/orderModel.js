import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    dishes: [
      {
        dish: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Dish",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        subtotal: {
          type: Number,
          required: true,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    payment: {
      method: {
        type: String,
        default: "COD",
      },
      status: {
        type: String,
        default: "Pending",
      },
    },
    status: {
      type: String,
      default: "Pending", // Pending, Preparing, Delivered, Cancelled
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
