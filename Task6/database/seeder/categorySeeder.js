import mongoose from "mongoose";
import dotenv from "dotenv";
import categoryModel from "../model/categoryModel.js";

dotenv.config();

const categories = [
  { name: "Electronics", description: "All kinds of electronic items" },
  { name: "Clothing", description: "Men and Women clothing" },
  { name: "Books", description: "All types of books" },
  { name: "Sports", description: "Sports equipment and accessories" },
];

const seedCategories = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/hyperlinkTask6", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Remove existing categories
    await categoryModel.deleteMany({});

    // Insert new categories
    await categoryModel.insertMany(categories);

    console.log("Categories seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Seeder error:", error);
    process.exit(1);
  }
};

seedCategories();
