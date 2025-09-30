import mongoose from "mongoose";
import dotenv from "dotenv";
import Country from "../model/countryModel.js";
import State from "../model/stateModel.js";
import City from "../model/cityModel.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/hyperlinkTask6", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Database connected");

    // Clear old data
    await Country.deleteMany({});
    await State.deleteMany({});
    await City.deleteMany({});
    console.log("🧹 Old data cleared");

    // Create country
    const india = await Country.create({ name: "India", code: "IN" });

    // Create states
    const gujarat = await State.create({ name: "Gujarat", country: india._id });
    const maharashtra = await State.create({ name: "Maharashtra", country: india._id });

    // Cities for Gujarat
    const gujaratCities = [
      "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar",
      "Jamnagar", "Junagadh", "Gandhinagar", "Anand", "Navsari",
      "Bharuch", "Porbandar", "Morbi", "Nadiad", "Surendranagar",
      "Veraval", "Godhra", "Valsad", "Dahod", "Palanpur"
    ].map(name => ({ name, state: gujarat._id }));

    // Cities for Maharashtra
    const maharashtraCities = [
      "Mumbai", "Pune", "Nagpur", "Thane", "Nashik",
      "Aurangabad", "Solapur", "Amravati", "Kolhapur", "Jalgaon",
      "Akola", "Latur", "Dhule", "Ahmednagar", "Chandrapur",
      "Parbhani", "Ichalkaranji", "Nanded", "Sangli", "Bhiwandi"
    ].map(name => ({ name, state: maharashtra._id }));

    // Insert cities
    await City.insertMany([...gujaratCities, ...maharashtraCities]);

    console.log("✅ Seeding completed successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedData();