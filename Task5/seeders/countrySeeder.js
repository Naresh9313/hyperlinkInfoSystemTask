import mongoose from "mongoose";
import dotenv from "dotenv";
import Country from "../database/models/countryModel.js";

dotenv.config();

const countries = [
  { name: "India", code: "IN", dial_code: "+91", flag: "🇮🇳" },
  { name: "United States", code: "US", dial_code: "+1", flag: "🇺🇸" },
  { name: "United Kingdom", code: "GB", dial_code: "+44", flag: "🇬🇧" },
  { name: "Canada", code: "CA", dial_code: "+1", flag: "🇨🇦" },
  { name: "Australia", code: "AU", dial_code: "+61", flag: "🇦🇺" }
];

const seedCountries = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/hyperlinkTask5");

    await Country.deleteMany();

    await Country.insertMany(countries);

    console.log("✅ Countries seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding countries:", error);
    process.exit(1);
  }
};

seedCountries();
