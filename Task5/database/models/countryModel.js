import mongoose from "mongoose";

const countrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    dial_code: {
      type: String,
      default: "",
    },
    flag: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Country", countrySchema);
